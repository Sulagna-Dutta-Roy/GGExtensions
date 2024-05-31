import React from "react";
import Dialog from "@material-ui/core/Dialog";

import IFrame from "./IFrame";
import messagePassing from "../../services/messagePassing";
import mediaControl from "../../services/MediaControl";
import dbService from "../../services/dbService";

const queryString = require("query-string");

/**
 * return browser name. if it's google chrome than return false.
 * */
const isBadBrowser =
  window.navigator.userAgent.indexOf("Edg") > -1
    ? "Microsoft Edge"
    : window.navigator.userAgent.indexOf("Firefox") > -1
    ? "Firefox"
    : void 0 !== window.navigator.brave
    ? "Brave"
    : void 0 !== window.safari
    ? "Safari"
    : !!(function () {
        for (let a = 0; a < navigator.plugins.length; a += 1)
          if (
            null != navigator.plugins[a].name &&
            -1 !== navigator.plugins[a].name.indexOf("Chromium")
          )
            return !0;
        return !1;
      })() && "Chromium";
const isGoogleChrome = isBadBrowser == false;
const isBrave = isBadBrowser == "Brave";
const isFirefox = isBadBrowser == "Firefox";
const isMicrosoftEdge = isBadBrowser == "Microsoft Edge";
const isChromium = isBadBrowser == "Chromium";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      isModalOpen: false,
    };
  }
  init = async () => {
    const { endpoint } = await dbService.get("endpoint");
    /** logic specific to firefox browser */
    if (isFirefox && window.location.href.startsWith(`${endpoint}/screen`)) {
      const parsed = queryString.parse(window.location.search);
      const uId = decodeURIComponent(parsed.id ? parsed.id : "");
      messagePassing.sendMessage(
        "/get_image_data",
        { id: uId },
        (imageb64Data) => {
          const event = new CustomEvent("CROPPEDIMAGEDATA", {
            detail: imageb64Data,
          });
          window.dispatchEvent(event);
        }
      );
    }
    /** Check for content script mount acknowledgement from background script */
    messagePassing.on("/cs_mounted", async (req, res) => {
      res({ mounted: true });
    });
    messagePassing.on("/show_popup", (req, res, options) => {
      const { path, screenshotUrl } = req;
      if (path == "/show_popup") {
        if (!this.state.isModalOpen) {
          mediaControl.mutePage();
          this.setState({ imgSrc: screenshotUrl });
        } else {
          mediaControl.unmutePage();
        }
        this.setState({ isModalOpen: !this.state.isModalOpen });
      }
    });
  };
  componentDidMount() {
    this.init().catch((e) => {});
  }
  handleClose = () => {
    mediaControl.unmutePage();
    this.setState({ isModalOpen: false });
  };
  onCropEnd = (imgSrc) => {
    console.log({ imgSrc });
    messagePassing.sendMessage("/open_tab", { imgSrc });
    this.handleClose();
  };
  render() {
    return (
      <Dialog
        fullScreen
        style={{ zIndex: 2147483647 }}
        open={this.state.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IFrame imgSrc={this.state.imgSrc} onCropEnd={this.onCropEnd} />
      </Dialog>
    );
  }
}
