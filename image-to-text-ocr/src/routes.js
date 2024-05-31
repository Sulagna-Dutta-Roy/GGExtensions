import MessagePassingService from "./services/messagePassing";
import MessagePassingExternalService from "./services/messagePassingExternal";
import { generateGuid, getBrowserLocale } from "./services/helper";
import dbService from "./services/dbService";
import { LruCacheLinear } from "./services/cache";

const Routes = () => {
  const cache = new LruCacheLinear(3)
  // set extra options
  MessagePassingService.setOptions({});
  //open new tab
  MessagePassingService.on("/open_tab", async (req, res, options) => {
    const uid = generateGuid();
    cache.set(uid, req.imgSrc);
    const locale = getBrowserLocale();
    const { endpoint } = await dbService.get("endpoint");
    const url = `${endpoint}/screen?id=${uid}&hl=${locale}`;
    chrome.tabs.query({ url: `${endpoint}/*` }, (tabs) => {
      const [tab] = tabs;
      if (tab) {
        chrome.tabs.update(tab.id, { url, active: true });
      } else {
        chrome.tabs.create({ url }, () => {});
      }
    });
  });
  MessagePassingExternalService.on(
    "/get_image_data",
    async (req, res, options) => {
      const { id } = req;
      const imgData = cache.get(id);
      if (imgData) {
        res(imgData.replace(/^data:image\/(png|jpg);base64,/, ""));
      } else {
        res(null);
      }
    }
  );
  MessagePassingExternalService.on("/upgrade", async (req, res, options) => {
    const { endpoint } = req;
    await dbService.set({
      endpoint: endpoint ? endpoint : "https://imagetext.xyz",
    });
  });
  MessagePassingService.on("/get_image_data", async (req, res, options) => {
    const { id } = req;
    const imgData = cache.get(id);
    if (imgData) {
      res(imgData.replace(/^data:image\/(png|jpg);base64,/, ""));
    } else {
      res(null);
    }
  });
  MessagePassingExternalService.on("/clear_image_data", (req, res, options) => {
    const { id } = req;
  });
};

export default Routes;
