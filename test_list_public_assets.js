import { check, group, sleep } from "k6";
import * as brandkit from "./brandkit-web.js";

export const options = {
  scenarios: {
    list_assets: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "50s", target: 1000 },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "0s",
    },
  },
};

export default () => {
  group("List Assets Page", () => {
    const response = brandkit.visit_public_list_asset_page(__ENV.HOST);
    sleep(1);

    check(response, {
      "http2 is used": (r) => r.proto === "HTTP/2.0",
      "status is 200": (r) => r.status === 200,
      "content is present": (r) => r.body.indexOf("Search") !== -1,
    });
  });
};
