import React, { useEffect, useState } from "react";
import FakeData from "@/shared/FakeData.jsx";
import CarItem from "./CarItem";
import { db } from "@/config/index";
import { desc, eq } from "drizzle-orm";
import { carImages, CarListing } from "@/config/schema";
import Service from "@/shared/Service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function MostSearchedCar() {

  const [carList, setCarList] = useState([]);

  useEffect(() => {
    getPopularCarList();
  }, []);

  const getPopularCarList = async() => {
    const result = await db
          .select()
          .from(CarListing)
          .leftJoin(carImages, eq(CarListing.id, carImages.CarListingId))
          .orderBy(desc(CarListing.id))
          .limit(10);
    const res = Service.FormatResult(result);
    setCarList(res);
  }
  return (
    <div className="mx-24">
      <h2 className="font-bold text-3xl text-center mt-16 mb-7">
        Most Searched Car
      </h2>
      <Carousel>
        <CarouselContent>
          {carList.map((car, index) => (
            <CarouselItem key={index} className='basis-1/4'>
              <CarItem  car={car} />{" "}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default MostSearchedCar;
