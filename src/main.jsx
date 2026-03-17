import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.jsx";
import Contact from "./Contact.jsx";
import { ClerkProvider } from "@clerk/react";
import Profile from "./profile/Index";
import AddListing from "./add-listing/Index";
import { Toaster } from "@/components/ui/sonner"
import SearchByCategory from "./search/[category]/Index";
import ListingDetail from "./listing-details/[id]/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/profile",
    element: <Profile />,
  }, 
  {
    path: "/add-listing",
    element: <AddListing />,
  },
   {
    path: "/search/:category",
    element: <SearchByCategory/>
  },
   {
    path: "/search",
    element: <SearchByCategory/>
  }, 
  {
    path: '/listing/:id',
    element: <ListingDetail />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ClerkProvider>
  </StrictMode>,
);
