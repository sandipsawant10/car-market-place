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
              <Button variant="outline" className='w-full ' >Edit</Button>
              <Button variant="destructive"  >
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
