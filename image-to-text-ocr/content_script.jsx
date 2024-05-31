import React from "react";
import ReactDOM from "react-dom";
import constants from "./constants";
import Index from "./src/content-scripts/components";

const mountId = constants.contentScript.mountId;
const Element = document.createElement("div");
Element.setAttribute("id", mountId);
document.body.appendChild(Element);
ReactDOM.render(<Index />, document.getElementById(mountId));
