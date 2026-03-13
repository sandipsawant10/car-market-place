import { Button } from "@base-ui/react";
import { UserButton, useUser } from "@clerk/react";
import React from "react";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="flex justify-between items-center shadow-sm p-5">
      <img src="/public/icons.svg" alt="logo" width={150} height={100} />

      <ul className="hidden md:flex gap-16">
        <li>Home</li>
        <li>Search</li>
        <li>New</li>
        <li>PreOwned</li>
      </ul>

      {isSignedIn ? (
        <div className="flex items-center gap-5">
          <UserButton />
          <Button>Submit Listing</Button>
        </div>
      ) : (
        <Button>Submit Listing</Button>
      )}
    </div>
  );
}

export default Header;
