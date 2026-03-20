import { db } from "@/config";
import { carImages, CarListing } from "@/config/schema";
import Service from "@/shared/Service";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarItem from "@/components/CarItem";
import Header from "@/components/Header";
import Search from "@/components/Search";

function SearchByOptions() {
  const [carList, setCarList] = useState([]);

  const [searchParam] = useSearchParams();

  const condition = searchParam.get("cars");
  const make = searchParam.get("make");
  const price = searchParam.get("price");

  useEffect(() => {
    (async () => {
      let query = db.select().from(CarListing);

      if (condition) query = query.where(eq(CarListing.condition, condition));
      if (make) query = query.where(eq(CarListing.make, make));
      if (price) query = query.where(eq(CarListing.sellingPrice, price));

      const listings = await query;

      const images = await db.select().from(carImages);

      // Create one entry per image to match join result format
      const result = [];
      listings.forEach((car) => {
        const carImgs = images.filter((img) => img.CarListingId === car.id);
        carImgs.forEach((img) => {
          result.push({ carListing: car, carImages: img });
        });
      });

      const res = Service.FormatResult(result);
      setCarList(res);
    })();
  }, [condition, make, price]);
  return (
    <div>
      <Header />

      <div className="p-16 bg-black flex justify-center">
        <Search />
      </div>

      <div className="p-10 md:p-20">
        <h2 className="font-bold text-4xl  ">Search Result </h2>

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

export default SearchByOptions;
