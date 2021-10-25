import { check, group, sleep } from "k6";
import { SharedArray } from "k6/data";
import * as brandkit from "./brandkit-web.js";
import * as factory from "./factory.js";

const FILES = factory.all_images();
const USERS = new SharedArray("users", () => JSON.parse(open("./users.json")));

export const options = {
  scenarios: {
    uploads: {
      executor: "per-vu-iterations",
      vus: 2,
      iterations: 2,
      maxDuration: "1h30m",
      exec: "uploads",
    },
  },
};

export function uploads() {
  group("Sing in page and submit", () => {
    const { username, password } = factory.get_random(USERS);
    const response = brandkit.sing_in(__ENV.HOSTNAME, username, password);
    sleep(1);

    check(response, {
      "http2 is used": (r) => r.proto === "HTTP/2.0",
      "status is 200": (r) => r.status === 200,
      "content is present": (r) => r.body.indexOf("Me") !== -1,
    });
  });

  group("New Assets Page", () => {
    const response = brandkit.visit_asset_page(__ENV.HOSTNAME);
    sleep(1);

    check(response, {
      "http2 is used": (r) => r.proto === "HTTP/2.0",
      "status is 200": (r) => r.status === 200,
      "content is present": (r) => r.body.indexOf("Add assets") !== -1,
    });
  });

  group("Upload Assets Page and submit", () => {
    const response = brandkit.upload_asset(__ENV.HOSTNAME, FILES);
    sleep(10);

    check(response, { "is status 200": (r) => r.status === 200 });
  });
}
