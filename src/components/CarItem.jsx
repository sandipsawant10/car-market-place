import { Separator } from "@/components/ui/separator";
import { LuFuel } from "react-icons/lu";
import { SiSpeedtest } from "react-icons/si";
import { GiGearStickPattern } from "react-icons/gi";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from "react-router-dom";


function CarItem({ car }) {
  return (
    <Link to={`/listing-details/${car?.id}`}>
    <div className="rounded-xl bg-white hover:shadow-md cursor-pointer ">
      <h2 className='absolute m-2 bg-green-500 px-2 rounded-full text-sm pb-1 text-white'>New</h2>
      <img
        className="rounded-t-xl h-[180px] object-cover "
        src={car?.image[0]?.imageUrl}
        alt="car-img"
        width={'100%'}
        height={250}
      />
      <div className='p-4'>
      <h2 className="font-bold text-black text-lg mb-2">{car?.listingTitle}</h2>
      <Separator />
      <div className='grid grid-cols-3 mt-5'>
        <div className="flex flex-col items-center">
          <LuFuel className='text-lg mb-2'/>
          <h2>{car?.mileage} Miles</h2>
        </div>
        <div className="flex flex-col items-center">
          <SiSpeedtest className='text-lg mb-2'/>
          <h2>{car?.fullType} </h2>
        </div>
        <div className="flex flex-col items-center">
          <GiGearStickPattern className='text-lg mb-2'/>
          <h2>{car?.transmission} </h2>
        </div>
      </div>
      <Separator className='my-2' />
      <div className='flex item-center justify-between'>
        <h2 className="font-bold text-xl">
          ${car?.sellingPrice}
        </h2>
        <h2 className='text-primary text-sm flex gap-2 items-center'>
          <IoOpenOutline />
          View Details
        </h2>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default CarItem;
