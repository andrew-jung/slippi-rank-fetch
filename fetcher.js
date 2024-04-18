import { getPlayerRank } from "./ranks.js";

export async function getSlippiData(connectCode) {
  let convertedConnectCode = `${connectCode.replace("-", "#")}`;
  convertedConnectCode = convertedConnectCode.toUpperCase();
  try {
    let res = await fetch(
      "https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Host: "gql-gateway-dot-slippi.uc.r.appspot.com",
          "Accept-Language": "en-GB,en;q=0.9",
          Origin: "https://slippi.gg",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.05",
          Connection: "keep-alive",
          Referer: "https://slippi.gg/",
          Priority: "u=3, i",
          "apollographql-client-name": "slippi-web",
        },
        body: JSON.stringify({
          operationName: "AccountManagementPageQuery",
          variables: {
            cc: `${convertedConnectCode}`,
            uid: `${convertedConnectCode}`,
          },
          query:
            "fragment userProfilePage on User {\n  fbUid\n  displayName\n  connectCode {\n    code\n    __typename\n  }\n  status\n  activeSubscription {\n    level\n    hasGiftSub\n    __typename\n  }\n  rankedNetplayProfile {\n    id\n    ratingOrdinal\n    ratingUpdateCount\n    wins\n    losses\n    dailyGlobalPlacement\n    dailyRegionalPlacement\n    continent\n    characters {\n      id\n      character\n      gameCount\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery AccountManagementPageQuery($cc: String!, $uid: String!) {\n  getUser(fbUid: $uid) {\n    ...userProfilePage\n    __typename\n  }\n  getConnectCode(code: $cc) {\n    user {\n      ...userProfilePage\n      __typename\n    }\n    __typename\n  }\n}\n",
        }),
      }
    );

    let resUnpacked = await res.json();
    console.log(resUnpacked);
    let player = resUnpacked?.data?.getConnectCode?.user;
    if (!res) return;

    let rank = getPlayerRank(
      player.rankedNetplayProfile.ratingOrdinal,
      player.rankedNetplayProfile.dailyRegionalPlacement,
      player.rankedNetplayProfile.dailyGlobalPlacement
    );
    let ratingOrdinal = player.rankedNetplayProfile.ratingOrdinal;
    return { rank: rank, rating: ratingOrdinal };
  } catch (error) {
    console.log(error);
    return { error: "Try again later." };
  }
}
