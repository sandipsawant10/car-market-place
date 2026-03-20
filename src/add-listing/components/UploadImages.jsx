import React, { useCallback, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import cloudinaryConfig from "@/config/cloudinaryConfig";
import { carImages } from "@/config/schema";
import { db } from "@/config/index";
import { eq } from "drizzle-orm";

function UploadImages({ triggerUploadImages, setLoader, carInfo, mode }) {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [removedDbImageIds, setRemovedDbImageIds] = useState([]);

  const editCarImageList =
    mode === "edit"
      ? (carInfo?.images || [])
          .filter((image) => !removedDbImageIds.includes(image?.id))
          .map((image) => image?.imageUrl)
      : [];

  const uploadImageToServer = useCallback(() => {
    setLoader(true);
    selectedFileList.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryConfig.uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (data.secure_url) {
          console.log("Image uploaded to Cloudinary:", data.secure_url);
          await db.insert(carImages).values({
            imageUrl: data.secure_url,
            CarListingId: triggerUploadImages,
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoader(false);
      }
    });
  }, [selectedFileList, setLoader, triggerUploadImages]);

  useEffect(() => {
    if (triggerUploadImages) {
      uploadImageToServer();
    }
  }, [triggerUploadImages, uploadImageToServer]);

  const onFileSelected = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      setSelectedFileList((prev) => [...prev, file]);
    }
  };

  const onImageRemove = (image) => {
    const result = selectedFileList.filter((item) => item !== image);
    setSelectedFileList(result);
  };

  const onImageRemoveFromDB = async (_image, index) => {
    const imageId = carInfo?.images[index]?.id;
    if (!imageId) return;

    await db
      .delete(carImages)
      .where(eq(carImages.id, imageId))
      .returning({ id: carImages.id });

    setRemovedDbImageIds((prev) => [...prev, imageId]);
  };

  return (
    <div>
      <h2 className="font-medium text-xl my-10">Upload Car Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {mode === "edit" &&
          editCarImageList?.map((image, index) => (
            <div key={index}>
              <IoMdCloseCircle
                className="absolute m-2 text-lg text-white"
                onClick={() => onImageRemoveFromDB(image, index)}
              />
              <img
                src={image}
                className="w-full h-32.5 object-cover rounded-xl"
              />
            </div>
          ))}

        {selectedFileList.map((image, index) => (
          <div key={index}>
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white"
              onClick={() => onImageRemove(image, index)}
            />
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-32.5 object-cover rounded-xl"
            />
          </div>
        ))}

        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-4 cursor-pointer hover:shadow-md">
            <h2 className="text-lg text-center text-primary">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple={true}
          id="upload-images"
          className="opacity-0"
          onChange={onFileSelected}
        />
      </div>
      {/* <Button onClick={uploadImageToServer}>Upload</Button> */}
    </div>
  );
}

export default UploadImages;
