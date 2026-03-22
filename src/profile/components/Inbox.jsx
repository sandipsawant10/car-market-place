import React, { useState } from "react";
import { SendBirdProvider } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";
import { useUser } from "@clerk/react";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import { GroupChannel } from "@sendbird/uikit-react/GroupChannel";
import { useSearchParams } from "react-router-dom";

function Inbox() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const sendbirdAppId =
    import.meta.env.VITE_SENDBIRD_APP_ID || import.meta.env.VITE_APPLICATION_ID;

  const normalizeSendBirdUserId = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .slice(0, 80);

  const userId = normalizeSendBirdUserId(
    user?.primaryEmailAddress?.emailAddress || "",
  );
  const [channelUrl, setChannelUrl] = useState(
    searchParams.get("channelUrl") || "",
  );

  return (
    <div>
      <div style={{ width: "100%", height: "500px" }}>
        {userId ? (
          <SendBirdProvider
            appId={sendbirdAppId}
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
