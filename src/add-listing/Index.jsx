import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import CarDetails from "@/shared/carDetail.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import { Separator } from "@/components/ui/separator";
import TextAreaField from "./components/TextAreaField";
import features from "@/shared/features.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CarListing, carImages } from "@/config/schema";
import { db } from "@/config/index";
import IconField from "./components/IconField";
import UploadImages from "./components/UploadImages";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/react";
import moment from "moment";
import { eq } from "drizzle-orm";
import Service from "@/shared/Service";

function AddListing() {
  const [formData, setFormData] = useState([]);
  const [featuresData, setFeaturesData] = useState([]);
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get("mode");
  const recordId = searchParams.get("id");

  useEffect(() => {
    if (mode === "edit") {
      getListingDetails();
    }
  }, []);

  const getListingDetails = async () => {
    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, recordId));
    const images = await db
      .select()
      .from(carImages)
      .where(eq(carImages.CarListingId, recordId));
    const result = listings.map((car) => ({
      carListing: car,
      carImages: images,
    }));

    const res = Service.FormatResult(result);
    setCarInfo(res[0]);
    setFormData(res[0]);
    setFeaturesData(res[0]?.features);
  };

  // used to save form data
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // used to save selected featured list
  const handleFeaturesChange = (name, value) => {
    setFeaturesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    toast("Please Wait...");

    if (mode === "edit") {
      const result = await db
        .update(CarListing)
        .set({
          ...formData,
          features: featuresData,
          createBy: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          userImageUrl: user?.imageUrl,
          postedOn: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: CarListing.id })
        .where(eq(CarListing.id, recordId));
      navigate("/profile");
      setLoader(false);
    } else {
      try {
        const result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            createBy: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            userImageUrl: user?.imageUrl,
            postedOn: moment().format("DD/MM/YYYY"),
          })
          .returning({ id: CarListing.id });
        if (result) {
          console.log("Data inserted successfully");
          setTriggerUploadImages(result[0]?.id);
          setLoader(false);
        }
      } catch (error) {
        console.error("Error inserting data:", error);
        toast("Error occurred while submitting the form.");
        setLoader(false);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">Add New Listing</h2>
        <form className="p-10 rounded-xl mt-10">
          {/* Car Details */}
          <div>
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CarDetails.carDetails.map((item, index) => (
                <div key={index}>
                  <label className="text-sm flex gap-2 items-center mb-1">
                    <IconField icon={item.icon} />
                    {item?.label}{" "}
                    {item.required && <span className="text-red-600">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Features List */}
          <div>
            <h2 className="font-medium text-xl mb-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.features.map((item, index) => (
                <div key={index} className="flex gap-2 item-center">
                  <Checkbox
                    onCheckedChange={(value) =>
                      handleFeaturesChange(item.name, value)
                    }
                    checked={featuresData?.[item.name]}
                  />{" "}
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Car Images */}
          <Separator className="my-6" />
          <UploadImages
            triggerUploadImages={triggerUploadImages}
            carInfo={carInfo}
            mode={mode}
            setLoader={(v) => {
              setLoader(v);
              navigate("/profile");
            }}
          />
          <div className="mt-10 flex justify-end">
            <Button
              disabled={loader}
              type="submit"
              onClick={(e) => onSubmit(e)}
            >
              {!loader ? (
                "Submit"
              ) : (
                <BiLoaderAlt className="animate-spin text-lg" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;
