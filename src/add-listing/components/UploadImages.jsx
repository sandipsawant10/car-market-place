import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { storage } from "@/config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { carImages } from "@/config/schema";
import { db } from "@/config/index";

function UploadImages({triggerUploadImages, setLoader}) {
  const [selectedFileList, setSelectedFileList] = useState([]);

  useEffect(() => {
    if(triggerUploadImages) {
      UploadImageToServer();
    }
  },[triggerUploadImages])

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

  const UploadImageToServer = () => {
    setLoader(true);
    selectedFileList.forEach((file) => {
      const fileName = Date.now() + ".jpg";
      const storageRef = ref(storage, `images/${fileName}`);
      const metaData = {
        contentType: "image/jpg",
      };
      uploadBytes(storageRef, file, metaData)
        .then(() => {
          console.log("Uploaded File");
        })
        .then(() => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            console.log(downloadUrl);
            await db.insert(carImages).values({
              imageUrl: downloadUrl,
              CarListingId: triggerUploadImages
            })
          });
        });
        setLoader(false);
    });

    return (
      <div>
        <h2 className="font-medium text-xl my-10">Upload Car Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
        {/* <Button onClick={UploadImageToServer}>Upload</Button> */}
      </div>
    );
  };

  return UploadImageToServer();
}

export default UploadImages;
