"use strict";

var ITEM_ID = "screenshots";
var canvas;
var context;
var cy = 0;
var SCROLLBAR_WIDTH = 22;
var STICKY_HEADER_PADDING = 200;

var TEST_REDUCED_DONATION = false;

const patch1 = false; // commented seems this fixed iself, DetectClient.isFirefox(); // patch for laptop devicePixelRatio 1.5 issue with firefox
const patch2 = globalThis.devicePixelRatio < 1; // patch for 90% zoom https://jasonsavard.com/forum/discussion/6974/is-there-a-workaround-for-taking-screenshots-when-zoomed-out-on-chrome-os

if (patch1 || patch2) {
    globalThis.devicePixelRatio = 1;
}

var JError = {};
JError.DID_NOT_CONTRIBUTE = "DID_NOT_CONTRIBUTE";
JError.NETWORK_ERROR = "NETWORK_ERROR";

var ExtensionId = {};
if (DetectClient.isFirefox()) {
    ExtensionId.Drive = "checkerplusforgoogledrive@jasonsavard.com";
} else if (DetectClient.isEdge()) {
	ExtensionId.LocalDrive = "chlojnjhoanbiippnehobiclefodbdic";
	ExtensionId.Drive = "ndcbbjeihlogjndoheabejedggehfbei";
	ExtensionId.LocalScreenshot = "ajdcpfdbildfaahcgabgjhojmbalcnff";
} else {
	ExtensionId.LocalDrive = "chlojnjhoanbiippnehobiclefodbdic";
	ExtensionId.Drive = "pppfmbnpgflleackdcojndfgpiboghga";
	ExtensionId.LocalScreenshot = "ajdcpfdbildfaahcgabgjhojmbalcnff";
}

var Urls = {};
Urls.NotificationError = "https://jasonsavard.com/forum/categories/explain-and-send-screenshots?ref=errorNotification";

var NOTIFICATION_ICON_URL = "/images/icons/default128.png";

const Alarms = {
    UPDATE_UNINSTALL_URL: "UPDATE_UNINSTALL_URL"
}

const VIDEO_CONTENT_TYPE = "video/webm";

const WINDOW_IDS = {
    RecordScreen: "_record-screen-window-id"
}

const TAB_IDS = {
    Editor: "_editor-tab-id"
}

const STORAGE_DEFAULTS = {
    uploadedImgurFiles: [],
    presetButtonAction: "popupWindow",
    imageFormat: "image/jpeg",
    buttonIcon: "default",
    afterGrabAction: "openEditor",
    defaultTool: "arrow",
    fontFamily: "cambria",
    fontSize: "normal",
    lineWeight: 5,
    fontBackground: "semi-transparent",
    blurShape: "selectArea",
    drawingColor: "#f44336", // // must be HEX for color-picker to work! NOT rgba(244,67,54,1)
    downloadButton: true,
    saveAsButton: true,
    uploadButton: true,
    saveToDriveButton: true,
    copyToClipboardButton: true,
    editInPixlrButton: true,
    shareButton: true,
    openButton: true,
    pdfButton: true,
    searchImageButton: true,
    grabEntireScreenButton: true,
    openFromClipboardButton: true,
    openFileButton: true,
    audioInput: "default",
    fillStyle: "transparent",
};

const DEFAULT_SETTINGS_ALLOWED_OFF = [];

async function getAudioMedia() {
    const audioInputDeviceId = await storage.get("audioInput");

    let constraints;
    if (audioInputDeviceId == "default") {
        constraints = {
            audio: true
        }
    } else {
        constraints = {
            audio: {
                deviceId: {
                    ideal: audioInputDeviceId
                }
            }
        }
    }

    return navigator.mediaDevices.getUserMedia(constraints);
}

function getScreenMedia(streamId) {
	return navigator.mediaDevices.getUserMedia({
		/*
		width: { max: 1920 },
		height: { max: 1080 },
		frameRate: { max: 10 },
		deviceId: { exact: [sourceId] },
		mediaStreamSource: { exact: ['desktop'] }
		*/
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: "desktop",
				chromeMediaSourceId: streamId,
				maxWidth: 2560,
				maxHeight: 1440
				//width: { min: 1024, ideal: 1280, max: 1920 },
				//height: { min: 776, ideal: 720, max: 1080 }
			}
		}
	});
}

async function captureRecursively(params = {}) {
	console.log("captrecur")
	await captureToCanvas(params);
    console.log("sendnext")
    await sleep(150);
    const response = await chrome.tabs.sendMessage(params.tab.id, {msg:"scroll_next", stickyHeaderPadding:STICKY_HEADER_PADDING});
    if (response.msg == "scroll_next_done") {
        console.log("sendnextdone")
        if (response.canScrollAgain) {
            params.stickyHeaderPadding = STICKY_HEADER_PADDING;
        } else {
            params.stickyHeaderPadding = 0;
        }
        await captureRecursively(params);
    } else {
        console.log("finish")
    }
}

async function captureToCanvas(params) {
	const data = await chrome.tabs.captureVisibleTab(null, await generateCaptureVisibleTapOptions());
    console.log("capture");

    const response = await fetch(data);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);

    var height = (cy+image.height > canvas.height) ? canvas.height-cy : image.height;
    if (height > 0) {
        var sx = 0;
        var sy = image.height - height;
        if (params.stickyHeaderPadding) {
            sy += params.stickyHeaderPadding * params.zoomFactor;
        }
        //sy *= params.zoomFactor;
        
        var sWidth = image.width-SCROLLBAR_WIDTH;
        //sWidth *= params.zoomFactor;
        
        var sHeight = height;
        if (params.stickyHeaderPadding) {
            sHeight -= params.stickyHeaderPadding;
        }
        //sHeight *= params.zoomFactor;
        var width = canvas.width-SCROLLBAR_WIDTH;
        if (params.stickyHeaderPadding) {
            height -= params.stickyHeaderPadding;
        }
        //width *= params.zoomFactor;
        //height *= params.zoomFactor;
        
        //context.drawImage(image, sx, sy, sWidth * devicePixelRatio, sHeight * devicePixelRatio, 0, cy, width, height);
        context.drawImage(image, sx, sy, sWidth, sHeight, 0, cy, width, height);
    }
    
    if (cy+image.height < canvas.height) {
        cy += image.height;// / params.zoomFactor;
        if (params.stickyHeaderPadding) {
            cy -= params.stickyHeaderPadding * params.zoomFactor;
        }
    }
}

async function generateCaptureVisibleTapOptions() {
    const imageFormat = await storage.get("imageFormat");

    const captureOptions = {
        format: getCaptureVisibleTabFormat(imageFormat),
    }

    // patch for blurred image in firefox: https://jasonsavard.com/forum/discussion/comment/26542#Comment_26542
    if (DetectClient.isFirefox()) {
        captureOptions.quality = 92;
    }

    return captureOptions;
}

async function captureVisibleTab(params = {}) {
    const options = await generateCaptureVisibleTapOptions();

    let data;
    try {
        data = await chrome.tabs.captureVisibleTab(null, options);
    } catch (error) {
        console.warn(error);

        if (!error.includes("chrome-extension")) {
            if (params.delay) {
                showMessageNotification("Problem with screenshot", "You must stay within the same tab");
            }
        }

        await grabTab(params);
        return;
    }

    const tab = await getActiveTab();

    await setScreenshotVars({
        screenShotTab: tab,
        screenShotData: data,
        screenShotParams: params
    });

    openTabInGroup(params.urlToGoAfter, params.currentTab);
}

function possibleDelay(params = {}) {
    let delay;
    console.log("possibledelay", params);
	// chrome-extension pages will probably give an error later, so skip timer this time
	if (!params.grabTab && params.currentTab?.url?.includes("chrome-extension://")) {
        delay = null;
	} else {
        delay = params.delay;
    }

    console.log("delay", delay);

	return new Promise((resolve, reject) => {
		if (delay) {
			let intervalTimer;
			let TIMER_NOTIFICATION_ID = "timer";
			if (chrome.notifications.update) {
				let options = {
					title: (delay / ONE_SECOND).toString(),
					message: "",
					type: "progress",
					iconUrl: NOTIFICATION_ICON_URL,
					progress: 100
				};
				chrome.notifications.create(TIMER_NOTIFICATION_ID, options, notificationId => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message);
					} else {
						let secondCount = delay / ONE_SECOND;
						intervalTimer = setInterval(() => {
							secondCount--;
							let progress = Math.round(secondCount / (delay / ONE_SECOND) * 100);
							if (progress > 0) {
								options.title = (secondCount).toString();
                                options.progress = progress;

                                // notification.update would freze on 2nd update, so clearing and createing in step instead
                                //chrome.notifications.update(TIMER_NOTIFICATION_ID, options);
                                chrome.notifications.clear(TIMER_NOTIFICATION_ID, () => {
                                    chrome.notifications.create(TIMER_NOTIFICATION_ID, options);
                                });
							}
						}, ONE_SECOND);
					}
				});
			}
			setTimeout(() => {
                clearInterval(intervalTimer);
                console.log("clear notif")
				chrome.notifications.clear(TIMER_NOTIFICATION_ID);
				resolve();
			}, delay);
		} else {
			resolve();
		}
	});
}

async function grabSelectedArea(params = {}) {
    console.log("grabSelectedArea", params);
	await possibleDelay(params);
    await setGrabMethod("selectedArea");
    params.urlToGoAfter = "snapshot.html";
    return captureVisibleTab(params);
}

async function selectElement(params) {
    await possibleDelay(params);
    const tab = await getActiveTab();
    await chrome.scripting.executeScript({target: {tabId: tab.id}, files: [
        "js/contentScriptSelectElement.js"
    ]});
}

async function grabVisiblePart(params = {}) {
	await possibleDelay(params);
    await setGrabMethod("visibleArea");
    params.urlToGoAfter = "editor.html";
    return captureVisibleTab(params);
}

function grabTab(params = {}) {
	params.grabTab = true;
	return grabScreen(params);
}

async function openRecordScreenWindow(command, params = {}) {
    const POPUP_WIDTH = 700;
    const POPUP_HEIGHT = 600;

    //const currentWindow = await chrome.windows.getCurrent();
    const screens = await chrome.system.display.getInfo();
    const screen = screens.find(screen => screen.isPrimary);
    console.log("screen", screen);

    createWindow({
        url: `record-screen.html?command=${encodeURIComponent(command)}&params=${encodeURIComponent(JSON.stringify(params))}`,
        type: 'popup',
        width: POPUP_WIDTH,
        height: POPUP_HEIGHT,
        left: Math.round((screen.bounds.width - POPUP_WIDTH) / 2),
        top: Math.round((screen.bounds.height - POPUP_HEIGHT) / 2),
    });
}

async function grabScreen(params = {}) {
    openRecordScreenWindow("grabScreenFromWindow", params);
}

async function maybeStartAudioRecorder(params = {}) { // popupwindow, enableMic
    if (params.enableMic || await storage.get("alwaysRecordAudio")) {
        // need to use popupwindow or else the user would not get prompted to accept/deny when called from background
        return getAudioMedia();
    }
}

async function recordScreen(params = {}) {
    openRecordScreenWindow("recordScreenFromWindow", params);
}

async function getRecordScreenWindow() {
    const windowId = await storage.get(WINDOW_IDS.RecordScreen);
    if (windowId) {
        try {
            return await chrome.windows.get(windowId);
        } catch (error) {
            // ignore error
        }
    }
}

async function grabEntirePage() {
    await setGrabMethod("entirePage");

    const tab = await getActiveTab();
    let sendMessageResponded = false;

    setTimeout(() => {
        if (!sendMessageResponded) {
            //throw "no sendMessageResponded";
        }
    }, 2000);
    
    if (DetectClient.isFirefox()) {
        await chrome.tabs.executeScript(tab.id, {file: "js/contentScript.js", allFrames: true});
    } else {
        // make sure to send this to main window by setting frameId = 0 and not to frames inside window
        const responses = await chrome.scripting.executeScript({target: {tabId: tab.id, frameIds:[0]}, files: [
            "js/contentScript.js"
        ]});
        console.log("execute responses", responses);
    }

    const zoomFactor = await chrome.tabs.getZoom();
    const response = await chrome.tabs.sendMessage(tab.id, {msg:"scroll_init"}); // {frameId: 0}

    console.log("response", response);
    sendMessageResponded = true;

    if (typeof OffscreenCanvas != "undefined") {
        canvas = new OffscreenCanvas(response.width * response.devicePixelRatio, response.height * response.devicePixelRatio);
    } else if (typeof document != "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = response.width * response.devicePixelRatio;
        canvas.height = response.height * response.devicePixelRatio;
    }

    context = canvas.getContext("2d");
    cy = 0;

    await captureRecursively({
        tab: tab,
        zoomFactor: zoomFactor,
        scrollInitResponse: response
    });
    await setScreenshotVars({
        screenShotTab: tab,
        screenShotData: await getDataUrl(canvas),
    });

    openTabInGroup("editor.html");
}

async function openEditor(params = {}) {
    if (params.dataUrl) {
        await setScreenshotVars({
            screenShotData: params.dataUrl
        });
    }

    if (params.sameWindow) {
        location.href = "editor.html";
    } else {
        openTabInGroup("editor.html");
    }
}

async function openTabInGroup(url, currentTab) {
    currentTab ||= await getActiveTab();

    const createTabsParams = {
        url: url,
    }

    if (currentTab) {
        createTabsParams.index = currentTab.index // insert tab to the left of the current tab - so that when user closes the tab the focus returns automaticaly to the last tab
    }

    const tab = await chrome.tabs.create(createTabsParams);

    storage.set(TAB_IDS.Editor, tab.id);

    if (currentTab && currentTab.groupId != -1 && chrome.tabs.group) {
        chrome.tabs.group({
            tabIds: tab.id,
            groupId: currentTab.groupId
        });
    }
}

async function openFromClipboard(params = {}) {
    if (params.crop) {
        await setGrabMethod("openFromClipboardAndCrop");
    } else {
        await setGrabMethod("openFromClipboard");
    }

    const permissions = {permissions: ["clipboardRead"]};
    const result = await chrome.permissions.contains(permissions);
    if (!result) {
        const granted = await chrome.permissions.request(permissions);
        if (!granted) {
            // do nothing
            throw {permissionNotGranted:true};
        }
    }
    document.execCommand("paste");
    /*
    await sendMessageToBG("setVar", {
        name: "screenShotTab",
        value: null
    });
    */
}

async function initPopup() {
	console.log("initPopup");
	if (await storage.get("presetButtonAction") == "popupWindow") {
		console.log("popup");
		chrome.action.setPopup({popup:"popup.html"});
	} else {
		chrome.action.setPopup({popup:""});
	}
}

async function setButtonIcon() {
    const buttonIcon = await storage.get("buttonIcon");
	chrome.action.setIcon({ path: {
			"19": `/images/icons/${buttonIcon}19.png`,
			"38": `/images/icons/${buttonIcon}38.png`
		}
	});
}

async function initContextMenu() {
	chrome.contextMenus.removeAll();
	
	const contexts = [globalThis.ACTION_CONTEXT];
	if (!await storage.get("removeMenuItems")) {
		contexts.push("page");
	}

    chrome.contextMenus.create({id: "grabSelectedArea", title: getMessage("selectArea"), contexts: contexts});
    chrome.contextMenus.create({id: "selectElement", title: getMessage("selectElement"), contexts: contexts});
	chrome.contextMenus.create({id: "grabVisiblePart", title: getMessage("grabVisiblePart"), contexts: contexts});
	chrome.contextMenus.create({id: "grabEntirePage", title: getMessage("grabEntirePage"), contexts: contexts});
	if (DetectClient.isChromium()) {
		chrome.contextMenus.create({ id: "grabEntireScreen", title: getMessage("grabEntireScreen"), contexts: contexts });
		chrome.contextMenus.create({ id: "recordScreen", title: getMessage("recordScreen"), contexts: contexts });
	}
}

async function daysElapsedSinceFirstInstalled() {
	if (TEST_REDUCED_DONATION) {
		return true;
	}
	
	return Math.abs(Math.round(new Date(await storage.get("installDate")).diffInDays()));
}

async function isEligibleForReducedDonation() {
	if (TEST_REDUCED_DONATION) {
		return true;
	}
	
	return (await daysElapsedSinceFirstInstalled() >= (14) && !await storage.get("donationClicked"));
}

function getImageFormatExtension(imageFormat) {
	var extension;
	if (imageFormat == "image/jpeg") {
		extension = ".jpg";
	} else {
		extension = ".png";
	}
	return extension;
}

function getCaptureVisibleTabFormat(imageFormat) {
	var captureVisibleTabFormat;
	if (imageFormat == "image/jpeg") {
		captureVisibleTabFormat = "jpeg";
	} else {
		captureVisibleTabFormat = "png";
	}
	return captureVisibleTabFormat;
}

async function copyToClipboard() {
    // clipboard.write returned Sanitize error when using image/jpeg so forcing to png
    const blob = await canvasToBlob(canvas, "image/png");
    /* From file...
    const imgURL = '/images/jason.png';
    const data = await fetch(imgURL);
    const blob = await data.blob();
    */

    await navigator.clipboard.write([
        new ClipboardItem({
            [blob.type]: blob
        })
    ]);
}

function RGBToHex(r,g,b) {
    return RGBAToHexA(r,g,b);
}

function RGBAToHexA(r,g,b,a = "") {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (a != "") {
        a = Math.round(a * 255).toString(16);
    }
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a == 1)
      a = "0" + a;
  
    return "#" + r + g + b + a;
}

function hexToRgb(hex) {
	var c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x' + c.join('');
		return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
	}
	//throw new Error('Bad Hex: ' + hex);
}

function openChangelog(ref) {
    const url = new URL("https://jasonsavard.com/wiki/Explain_and_Send_Screenshots_changelog");
    url.searchParams.set("cUrl", chrome.runtime.getURL("contribute.html"));
    if (ref) {
        url.searchParams.set("ref", ref);
    }
    openUrl(url.href);
}

async function getGrabMethod() {
    return storage.get("grabMethod");
}

async function setGrabMethod(methodName) {
    return storage.set("grabMethod", methodName);
}

async function sendMessageToBG(command, params, stringifyParams = false) {
    if (!DetectClient.isFirefox()) {
        stringifyParams = false;
    }

    if (globalThis.inBackground) { // if running in same context
        if (command.includes(".")) { // ie. forgottenReminder.start
            const commands = command.split(".");
            return globalThis[commands[0]][commands[1]](params);
        } else {
            return globalThis[command](params);
        }
    } else {
        if (stringifyParams) {
            params = JSON.stringify(params);
        }
        let response = await chrome.runtime.sendMessage({command: command, params: params, stringifyParams: stringifyParams});
        response = initUndefinedObject(response);
        if (response?.error) {
            console.log("error2", response);
            if (response.error.message) { // recreate errorobj
                const errorObj = Error(response.error.message);
                copyObj(response.error, errorObj);
                console.error("recreate error obj", errorObj)
                throw errorObj;
            } else {
                throw response.error;
            }
        } else {
            return response;
        }
    }
}

function selectPreviousTool() {
    if (    previousClickedTool != "color" &&
            previousClickedTool != "color-list-button" &&
            previousClickedTool != "zoomIn" &&
            previousClickedTool != "zoomOut" &&
            previousClickedTool != "resize") {

        previousClickedTool ||= "arrow";
        byId(previousClickedTool).click();
    }
}

async function getScreenshotVars() {
    let obj = await chrome.storage.session?.get();
    if (obj?.screenShotData) {
        console.log("Using session memory");
    } else {
        console.log("Using service worker");
        if (globalThis.inBackground) {
            // shouldn't happen, but just in case
            obj = {
                screenShotTab: screenShotTab,
                screenShotData: screenShotData,
                screenShotParams: screenShotParams
            }
        } else {
            obj = await sendMessageToBG("getScreenshotVars");
        }
    }

    return obj;
}

async function setScreenshotVars(vars = {}) {
    await chrome.storage.session?.clear();

    if (globalThis.inBackground) {
        setScreenshotVarsToServiceWorker(vars);
    } else {
        const BUFFER = 1000;
        if (chrome.storage.session && vars.screenShotData?.length < chrome.storage.session?.QUOTA_BYTES - BUFFER) {
            try {
                await chrome.storage.session.set(vars);
            } catch (error) {
                console.warn("could not set to session memory, so using service worker:", error);
                await sendMessageToBG("setScreenshotVars", vars);
            }
        } else {
            await sendMessageToBG("setScreenshotVars", vars);
        }

    }
}

function drawRectangle(x1, y1, x2, y2, mod, ctx, toolName) {
	ctx.beginPath();
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);

	if(mod && dx != dy) {	//shift held down: constrain
		if(dx < dy) {
			y2 = y1+(((y2-y1)/dy)*dx);
		} else {
			x2 = x1+(((x2-x1)/dx)*dy);
		}
	}
	
	if(ctx.strokeFill == 2 || ctx.lineWidth % 2 == 0) {    //no antialiasing
		x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2);
	}

    if (ctx.roundRect) {
        ctx.roundRect(x1, y1, (x2-x1), (y2-y1), 5);
    } else {
        ctx.rect(x1, y1, (x2-x1), (y2-y1));
    }

    if (globalThis.ctx?.strokeFill == "fill" && toolName != "select") {
        ctx.fill();
    } else {
        ctx.stroke()
    }

	ctx.beginPath();
}