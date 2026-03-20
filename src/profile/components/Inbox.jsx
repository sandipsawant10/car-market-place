import React, { useEffect, useState } from "react";
import { SendBirdProvider } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import { useUser } from "@clerk/react";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import { GroupChannel } from "@sendbird/uikit-react/GroupChannel";

function Inbox() {
  const { user } = useUser();

  const [userId, setUserId] = useState("");
  const [channelUrl, setChannelUrl] = useState("");

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const id = user.primaryEmailAddress.emailAddress.split("@")[0];
      setUserId(id);
    }
  }, [user]);

  return (
    <div>
      <div style={{ width: "100%", height: "500px" }}>
        {userId ? (
          <SendBirdProvider
            appId={import.meta.env.VITE_APPLICATION_ID}
            userId={userId}
            nickname={user?.fullName || userId}
            profileUrl={user?.imageUrl}
            allowProfileEdit={true}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 h-full">
              <div className="p-5 border shadow-lg">
                <GroupChannelList
                  onChannelSelect={(channel) => {
                    setChannelUrl(channel?.url || "");
                  }}
                  channelListQueryParams={{
                    includeEmpty: true,
                  }}
                />
              </div>

              <div className="md:col-span-2 shadow-lg">
                {channelUrl ? (
                  <GroupChannel channelUrl={channelUrl} />
                ) : (
                  <div className="h-full min-h-40 p-6 text-sm text-gray-500">
                    Select a channel to start chatting.
                  </div>
                )}
              </div>
            </div>
          </SendBirdProvider>
        ) : (
          <div className="p-6 text-sm text-gray-500">Loading inbox...</div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
