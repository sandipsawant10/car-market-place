import axios from "axios";

const SendBirdApplicationId =
  import.meta.env.VITE_SENDBIRD_APP_ID || import.meta.env.VITE_APPLICATION_ID;
const SendBirdApiToken =
  import.meta.env.VITE_SENDBIRD_MASTER_API_TOKEN ||
  import.meta.env.VITE_SENDBIRD_API_TOKEN ||
  "";

const normalizeSendBirdUserId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
const FormatResult = (resp) => {
  let result = [];
  let finalResult = [];
  resp.forEach((item) => {
    const listingId = item.carListing?.id;
    if (!result[listingId]) {
      result[listingId] = {
        car: item.carListing,
        images: [],
      };
    }

    if (item.carImages) {
      result[listingId].images.push(item.carImages);
    }
  });

  result.forEach((item) => {
    finalResult.push({
      ...item.car,
      images: item.images,
    });
  });

  return finalResult;
};

const CreateSendBirdUser = (userId, nickName, profileUrl) => {
  const normalizedUserId = normalizeSendBirdUserId(userId);

  if (!SendBirdApplicationId || !SendBirdApiToken) {
    throw new Error(
      "SendBird configuration missing. Check VITE_APPLICATION_ID/VITE_SENDBIRD_APP_ID and VITE_SENDBIRD_MASTER_API_TOKEN/VITE_SENDBIRD_API_TOKEN in .env",
    );
  }

  return axios.post(
    "https://api-" + SendBirdApplicationId + ".sendbird.com/v3/users",
    {
      user_id: normalizedUserId,
      nickname: nickName || normalizedUserId,
      ...(profileUrl ? { profile_url: profileUrl } : {}),
      issue_access_token: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    },
  );
};

const EnsureSendBirdUser = async (userId, nickName, profileUrl) => {
  const normalizedUserId = normalizeSendBirdUserId(userId);

  if (!SendBirdApplicationId || !SendBirdApiToken) {
    throw new Error(
      "SendBird configuration missing. Check VITE_APPLICATION_ID/VITE_SENDBIRD_APP_ID and VITE_SENDBIRD_MASTER_API_TOKEN/VITE_SENDBIRD_API_TOKEN in .env",
    );
  }

  try {
    // Avoid duplicate-user POST failures by first checking if the user exists.
    return await axios.get(
      "https://api-" +
        SendBirdApplicationId +
        ".sendbird.com" +
        "/v3/users/" +
        encodeURIComponent(normalizedUserId),
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": SendBirdApiToken,
        },
      },
    );
  } catch (error) {
    const code = Number(error?.response?.data?.code);
    const message = String(error?.response?.data?.message || "").toLowerCase();

    if (code === 400201 || message.includes("not found")) {
      return CreateSendBirdUser(normalizedUserId, nickName, profileUrl);
    }

    throw error;
  }
};

const CreateSendBirdChannel = (users, title) => {
  const normalizedUsers = [
    ...new Set(users.map(normalizeSendBirdUserId)),
  ].filter(Boolean);

  if (!SendBirdApplicationId || !SendBirdApiToken) {
    throw new Error(
      "SendBird configuration missing. Check VITE_APPLICATION_ID/VITE_SENDBIRD_APP_ID and VITE_SENDBIRD_MASTER_API_TOKEN/VITE_SENDBIRD_API_TOKEN in .env",
    );
  }

  return axios.post(
    "https://api-" + SendBirdApplicationId + ".sendbird.com/v3/group_channels",
    {
      user_ids: normalizedUsers,
      is_distinct: true,
      name: title,
      operator_ids: normalizedUsers[0] ? [normalizedUsers[0]] : [],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": SendBirdApiToken,
      },
    },
  );
};

export default {
  FormatResult,
  EnsureSendBirdUser,
  CreateSendBirdUser,
  CreateSendBirdChannel,
};
