import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import DetailHeader from "../components/DetailHeader";
import { useParams } from "react-router-dom";
import { carImages, CarListing } from "@/config/schema";
import { eq } from "drizzle-orm";
import { db } from "@/config";
import Service from "@/shared/Service";
import ImageGallery from "../components/ImageGallery";
import Description from "../components/Description";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Specification from "../components/Specification";
import OwnersDetail from "../components/OwnersDetail";
import Footer from "@/components/Footer";
import FinancialCalculator from "../components/FinancialCalculator";
import MostSearchedCar from "@/components/MostSearchedCar";

function ListingDetail() {
  const { id } = useParams();

  const [carDetail, setCarDetail] = useState();

  useEffect(() => {
    getCarDetails();
  }, []);

  const getCarDetails = async () => {
    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, Number(id)));
    const images = await db
      .select()
      .from(carImages)
      .where(eq(carImages.CarListingId, Number(id)));
    const result = [];
    listings.forEach((car) => {
      images.forEach((img) => {
        result.push({ carListing: car, carImages: img });
      });
    });

    const res = Service.FormatResult(result);
    setCarDetail(res[0]);
  };

  return (
    <div>
      <Header />

      <div className="p-10 md:p-20">
        {/* Header Details Component */}
        <DetailHeader carDetail={carDetail} />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5">
          {/* Left */}
          <div className="md:col-span-2">
            {/* Image Gallery */}
            <ImageGallery carDetail={carDetail} />

            {/* Description */}
            <Description carDetail={carDetail} />

            {/* Features List */}
            <Features features={carDetail?.features} />

            {/* Financial Calculator */}
            <FinancialCalculator carDetail={carDetail} />
          </div>

          {/* Right */}
          <div>
            {/* Pricing  */}
            <Pricing carDetail={carDetail} />

            {/* Car Specification */}
            <Specification carDetail={carDetail} />

            {/* Owner Details */}
            <OwnersDetail carDetail={carDetail} />
          </div>
        </div>
        <MostSearchedCar />
      </div>

      <Footer />
    </div>
  );
}

export default ListingDetail;
