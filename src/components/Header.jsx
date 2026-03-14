import { UserButton, useUser } from "@clerk/react";
import React from "react";
import { Link } from "react-router-dom";
import {Button} from "@/components/ui/button"

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="flex justify-between items-center shadow-sm p-5 ">
      <img src="/car-logo.svg" alt="logo" width={150} height={100} />

      <ul className=" m-0 flex list-none items-center gap-16 p-0 md:gap-12">
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          Search
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          Home
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          New
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          PreOwned
        </li>
      </ul>

      {isSignedIn ? (
        <div className="flex items-center gap-5">
          <UserButton />
          <Link to="/profile">
          <Button>Submit Listing</Button>
          </Link>
        </div>
      ) : (
        <Button>Submit Listing</Button>
      )}
    </div>
  );
}

export default Header;
