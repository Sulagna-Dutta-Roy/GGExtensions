"use strict";

import { dom } from "./dom.js";

/******************************************************************************/

(async () => {
  const appData = await vAPI.messaging.send("dashboard", {
    what: "getAppData",
  });

  dom.text("#aboutNameVer", appData.name + " " + appData.version);
})();
