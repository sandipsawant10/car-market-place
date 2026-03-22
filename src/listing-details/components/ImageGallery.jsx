import React from "react";

function ImageGallery({ carDetail }) {
  const imageUrl = carDetail?.images?.[0]?.imageUrl;

  return (
    <div>
      <img
        src={imageUrl || "/tesla.png"}
        className="w-full h-125 object-cover rounded-xl"
      />
    </div>
  );
}

export default ImageGallery;
