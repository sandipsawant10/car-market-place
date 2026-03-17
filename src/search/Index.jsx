import { db } from '@/config';
import { carImages, CarListing } from '@/config/schema';
import Service from '@/shared/Service';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import CarItem from '@/components/CarItem';
import Header from '@/components/Header';
import Search from '@/components/Search';

function SearchByOptions() {
  const [carList, setCarList] = useState();

  const [searchParam] = useSearchParams();

    const condition = searchParam.get("condition");
    const make = searchParam.get("make");
    const price = searchParam.get("price");

     useEffect(() => {
      getCarList();
    }, []);

    const getCarList = async () => {
      const result = await db
      .select()
      .from(CarListing)
      .innerJoin(carImages, eq(CarListing.id, carImages.CarListingId))
      .where(
        condition !== undefined &&
        eq(CarListing.condition, condition),

        make !== undefined &&
        eq(CarListing.make, make),

        price !== undefined &&
        eq(CarListing.price, price),
      )

      const res = Service.FormatResult(result);
      setCarList(res);
    }
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
            : [1, 2, 3, 4, 5, 6].map((item, index) => 
            <div className="h-92.5 rounded-xl bg-slate-200 animate-pulse">

            </div>)}
        </div>
      </div>
    </div>
  )
}

export default SearchByOptions