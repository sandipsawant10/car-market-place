import React from "react";
import { Button } from "@/components/ui/button";
import Service from "@/shared/Service";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function OwnersDetail({ carDetail }) {
  const navigate = useNavigate();

  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress;
  const ownerUserId = carDetail?.createBy;

  const buildFallbackProfileUrl = (name, id) => {
    const label = encodeURIComponent(name || id || "User");
    return `https://ui-avatars.com/api/?name=${label}&background=random`;
  };

  const ensureSendBirdUser = async (id, name, imageUrl) => {
    const resolvedProfileUrl = imageUrl || buildFallbackProfileUrl(name, id);

    try {
      await Service.EnsureSendBirdUser(id, name, resolvedProfileUrl);
      return true;
    } catch (error) {
      const errorCode = Number(error?.response?.data?.code);
      const message = String(
        error?.response?.data?.message || "",
      ).toLowerCase();
      // Existing users are fine for chat flow; continue.
      if (
        errorCode === 400202 ||
        message.includes("exists") ||
        message.includes("duplicate") ||
        message.includes("unique constraint")
      ) {
        return true;
      }

      if (errorCode === 400401) {
        toast.error("Sendbird credentials are invalid for this application.");
      }
      if (errorCode === 400105) {
        toast.error("Sendbird requires a valid profile image URL.");
      }

      console.log(
        "SendBird user error details",
        JSON.stringify(error?.response?.data || error, null, 2),
      );
      return false;
    }
  };

  const onMessageOwnerButtonClick = async () => {
    if (!userId || !ownerUserId) return;

    if (userId === ownerUserId) {
      toast.info("You cannot message your own listing.");
      return;
    }

    const currentUserOk = await ensureSendBirdUser(
      userId,
      user?.fullName,
      user?.imageUrl,
    );
    if (!currentUserOk) {
      toast.error("Failed to initialize your chat profile.");
      return;
    }

    const ownerUserOk = await ensureSendBirdUser(
      ownerUserId,
      carDetail?.userName,
      carDetail?.userImageUrl,
    );
    if (!ownerUserOk) {
      toast.error("Failed to initialize owner chat profile.");
      return;
    }

    try {
      const res = await Service.CreateSendBirdChannel(
        [userId, ownerUserId],
        carDetail?.listingTitle,
      );
      console.log("Channel Created in SendBird", res?.data || res);
      const createdChannelUrl = res?.data?.channel_url;
      const params = new URLSearchParams({ tab: "inbox" });
      if (createdChannelUrl) {
        params.set("channelUrl", createdChannelUrl);
      }
      navigate(`/profile?${params.toString()}`);
    } catch (error) {
      const errorCode = Number(error?.response?.data?.code);
      if (errorCode === 400401) {
        toast.error("Sendbird credentials are invalid for this application.");
      }
      console.log(
        "Error creating channel in SendBird",
        JSON.stringify(error?.response?.data || error, null, 2),
      );
      toast.error("Unable to start chat. Please try again.");
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
