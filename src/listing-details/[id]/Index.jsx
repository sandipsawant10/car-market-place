import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import DetailHeader from "../components/DetailHeader";
import { useParams } from "react-router-dom";
import { carImages, CarListing } from "@/config/schema";
import { eq } from "drizzle-orm";
import { db } from "@/config";
import Service from "@/shared/Service";

function ListingDetail() {
  const { id } = useParams();

  const [carDetail, setCarDetail] = useState();

  useEffect(() => {
    getCarDetails();
  }, []);

  const getCarDetails = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(carImages, eq(CarListing.id, carImages.CarListingId))
      .where(CarListing.id, id);

    const res = Service.FormatResult(result);
    setCarDetail(res[0]);
  };

  return (
    <div>
      <Header />

      <div className="p-10 md:p-20" c>
        {/* Header Details Component */}
        <DetailHeader carDetail={carDetail} />
      </div>
    </div>
  );
}

export default ListingDetail;
