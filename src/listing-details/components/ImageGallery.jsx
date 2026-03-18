import React from 'react'

function ImageGallery({ carDetail }) {
  return (
    <div>
      <img src={carDetail?.image[0]?.imageUrl} className='w-full h-125 object-cover rounded-xl' />
    </div>
  )
}

export default ImageGallery