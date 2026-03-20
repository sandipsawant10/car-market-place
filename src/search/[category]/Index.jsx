import CarItem from "@/components/CarItem";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { db } from "@/config";
import { carImages, CarListing } from "@/config/schema";
import Service from "@/shared/Service";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchByCategory() {
  const { category } = useParams();
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    getCarList();
  }, []);

  const getCarList = async () => {
    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.category, category));
    const images = await db.select().from(carImages);
    const result = [];
    listings.forEach((car) => {
      const carImgs = images.filter((img) => img.CarListingId === car.id);
      carImgs.forEach((img) => {
        result.push({ carListing: car, carImages: img });
      });
    });

    const res = Service.FormatResult(result);
    setCarList(res);
  };

  return (
    <div>
      <Header />

      <div className="p-16 bg-black flex justify-center">
        <Search />
      </div>

      <div className="p-10 md:p-20">
        <h2 className="font-bold text-4xl  ">{category}</h2>

        {/* List of carList */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {carList.length > 0
            ? carList.map((item, index) => (
                <div key={index}>
                  <CarItem car={item} />
                </div>
              ))
            : [1, 2, 3, 4, 5, 6].map((item, index) => (
                <div
                  key={item}
                  className="h-92.5 rounded-xl bg-slate-200 animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default SearchByCategory;
