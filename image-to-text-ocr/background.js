import chromeService from "./src/services/chromeService";
import Routes from "./src/routes";
import messagePassing from "./src/services/messagePassing";
import constants from "./constants";
import db, { schema } from "./src/services/dbService";
import Constants from "./constants";
import { DataStore, generateGuid } from "./src/services/helper";
/**
 * Main extension functionality
 *
 * @class Main
 */
class Main {
  constructor() {
    this.ctxMenuId1 = null;
    this.ctxMenuId2 = null;
    this.ctxMenuId3 = null;
    this.init().catch((e) => {
      console.log("Error loading extension", { e });
    });
    // set feedback form url
    this.setFeedbackFormUrl();
  }
  init = async () => {
    Routes();
    this.initDb();
    this.initContextMenu();
    this.popUpClickSetup();
  };
  /**
   * initialize db settings
   * @method
   * @memberof Main
   */
  initDb = async () => {
    const res = await db.get("____loaded");
    if (!res.hasOwnProperty("____loaded")) {
      await db.set({ ____loaded: true, ...schema.data });
      chromeService.openHelpPage("welcome");
      this.mountCSOnPreviouslyOpenedTabs().catch(() => {});
    }
  };
  openCropWindow = async () => {
    const screenshotUrl = await chromeService.takeScreenShot();
    await messagePassing.sendMessageToActiveTab(
      "/show_popup",
      { screenshotUrl },
      () => {}
    );
  };
  /**
   * mount content script on previously opened tabs
   * @method
   * @memberof Main
   */
  mountCSOnPreviouslyOpenedTabs = async () => {
    chrome.tabs.query({}, (result) => {
      result.map((tabInfo) => {
        messagePassing.sendMessageToTab(
          "/cs_mounted",
          tabInfo.id,
          {},
          async (res) => {
            if (!res) {
              chrome.tabs.executeScript(tabInfo.id, {
                file: "content_script.bundle.js",
              });
            }
          }
        );
      });
    });
  };
  popUpClickSetup = () => {
    chrome.action.onClicked.addListener(this.openCropWindow);
  };
  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    if (this.ctxMenuId1) return;
    const extractTextFromScreenLabel = chromeService.getI18nMessage(
      "extractTextFromScreenLabel"
    ); // Extract Text from this screen
    this.ctxMenuId1 = chromeService.createContextMenu({
      title: extractTextFromScreenLabel,
      contexts: ["all"],
      onclick: this.onContextMenu1Click,
    });
    if (this.ctxMenuId2) return;
    const extractTextFromImageLabel = chromeService.getI18nMessage(
      "extractTextFromImageLabel"
    ); // Extract Text from this image
    this.ctxMenuId2 = chromeService.createContextMenu({
      title: extractTextFromImageLabel,
      contexts: ["image"],
      onclick: this.onContextMenu2Click,
    });
    if (this.ctxMenuId3) return;
    const uploadPdfLabel = chromeService.getI18nMessage("uploadPdfLabel"); // upload pdf to extract text from
    this.ctxMenuId3 = chromeService.createContextMenu({
      title: uploadPdfLabel,
      contexts: ["all"],
      onclick: this.onContextMenu3Click,
    });
  };
  onContextMenu1Click = async (info, tab) => {
    this.openCropWindow();
  };
  onContextMenu2Click = async (info, tab) => {
    const { srcUrl } = info;
    const uid = generateGuid();
    DataStore.set(uid, srcUrl);
    const url = `${Constants.appConfig.endpoint}/screen?id=${uid}`;
    chrome.tabs.query({ url: "https://imagetext.xyz/*" }, (tabs) => {
      const [tab] = tabs;
      if (tab) {
        chrome.tabs.update(tab.id, { url, active: true });
      } else {
        chrome.tabs.create({ url }, () => {});
      }
    });
  };
  onContextMenu3Click = async (info, tab) => {
    const url = `${Constants.appConfig.endpoint}/pdfs`;
    chrome.tabs.create({ url }, () => {});
  };
  /**
   *set feedback form url shown while uninstalling
   * */
  setFeedbackFormUrl = () => {
    chrome.runtime.setUninstallURL(constants.support.uninstallFeedbackForm);
  };
}

// init main
new Main();
