import React from "react";
import { Button } from "@/components/ui/button";
import Service from "@/shared/Service";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

function OwnersDetail({ carDetail }) {
  const navigate = useNavigate();

  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const ownerUserId = carDetail?.createBy?.split("@")[0];

  const onMessageOwnerButtonClick = async () => {
    if (!userId || !ownerUserId) return;

    // Create Current User ID
    try {
      await Service.CreateSendBirdUser(
        userId,
        user?.fullName,
        user?.imageUrl,
      ).then((res) => {
        console.log("User Created in SendBird", res);
      });
    } catch (error) {
      console.log("Error creating user in SendBird", error);
    }

    //Owner User ID
    try {
      await Service.CreateSendBirdUser(
        ownerUserId,
        carDetail?.userName,
        carDetail?.userImageUrl,
      ).then((res) => {
        console.log("User Created in SendBird", res);
      });
    } catch (error) {
      console.log("Error fetching owner user ID", error);
    }

    //Create Channel
    try {
      await Service.CreateSendBirdChannel(
        [userId, ownerUserId],
        carDetail?.listingTitle,
      ).then((res) => {
        console.log("Channel Created in SendBird", res);
        navigate("/profile");
      });
    } catch (error) {
      console.log("Error creating channel in SendBird", error);
    }
  };

  return (
    <div className="p-10 rounded-xl border shadow-md mt-7">
      <h2 className="font-medium text-2xl mb-3">Owners/Dealers</h2>
      <img
        src={carDetail?.userImageUrl}
        alt="Owner"
        className="w-17.5 h-17.5 rounded-full"
      />
      <h2 className="mt-2 font-bold text-xl">{carDetail?.userName}</h2>
      <h2 className="mt-2 text-gray-500">{carDetail?.createBy}</h2>

      <Button onClick={onMessageOwnerButtonClick} className="w-full mt-6">
        Message Owner
      </Button>
    </div>
  );
}

export default OwnersDetail;
