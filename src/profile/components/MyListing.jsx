import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db } from "@/config/index";
import { carImages, CarListing } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { useUser } from "@clerk/react";
import Service from "@/shared/Service";
import CarItem from "@/components/CarItem";
import { FaRegTrashCan } from "react-icons/fa6";

function MyListing() {
  const { user } = useUser();

  const [carList, setCarList] = useState([]);

  useEffect(() => {
    user && getUserCarListing();
  }, [user]);

  const getUserCarListing = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(carImages, eq(CarListing.id, carImages.CarListingId))
      .where(eq(CarListing.createBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(CarListing.id));

    const res = Service.FormatResult(result);
    setCarList(res);
  };

  const deleteListing = async (id) => {
    await db.delete(carImages).where(eq(carImages.CarListingId, id));
    await db.delete(CarListing).where(eq(CarListing.id, id));
    getUserCarListing(); // Refresh the listing after deletion
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-4xl">My Listing</h2>
        <Link to="/add-listing">
          <Button>Add Listing</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
        {carList.map((car, index) => (
          <div key={index}>
            <CarItem car={car} />
            <div className="p-2 bg-gray-50 rounded-lg flex justify-between gap-3">
              <Link
                to={"/add-listing?mode=edit&id=" + car?.id}
                className="w-full"
              >
                <Button variant="outline" className="w-full ">
                  Edit
                </Button>
              </Link>

              <Button
                variant="destructive"
                onClick={() => deleteListing(car?.id)}
              >
                <FaRegTrashCan />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListing;
