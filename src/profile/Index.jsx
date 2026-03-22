import Header from "@/components/Header";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListing from "./components/MyListing";
import Inbox from "./components/Inbox";
import { useSearchParams } from "react-router-dom";

function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = ["my-listing", "inbox", "profile"].includes(tabParam)
    ? tabParam
    : "my-listing";
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    const nextTab = ["my-listing", "inbox", "profile"].includes(tabParam)
      ? tabParam
      : "my-listing";
    setActiveTab(nextTab);
  }, [tabParam]);

  const onTabChange = (nextTab) => {
    setActiveTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", nextTab);
    if (nextTab !== "inbox") {
      nextParams.delete("channelUrl");
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full flex justify-start">
            <TabsTrigger value="my-listing">My Listing</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent value="profile">
            Profile details is coming soon...
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
