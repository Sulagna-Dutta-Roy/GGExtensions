"use strict";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command == "closePopupWindow") {
        window.close();
    }
});

let currentTab;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if (tabs?.length) {
		currentTab = tabs[0];
	}
});

function showCannotCaptureWarning(node, error) {
	hideSpinner(node);
	openDialog("cannotCaptureWarningTemplate").then(response => {
		if (response == "ok") {
			// nothing
		}
	});
	if (error) {
		console.error(error);
		showError("Error: " + error);
	}
}

function showSpinner(node) {
    const icon = node.shadowRoot?.querySelector("iron-icon");
    if (icon) {
        const spinner = document.createElement("paper-spinner");
        spinner.setAttribute("active", "");
        spinner.setAttribute("slot", "item-icon");
    
        icon.after(spinner);
        hide(icon);
    }
}

function hideSpinner(node) {
    const spinner = node.querySelector("paper-spinner");
    if (spinner) {
        node.querySelector("paper-spinner").remove();
        show(node.querySelector("iron-icon"));
    }
}

(async () => {

    await initUI();
    
    console.log("settings", storage);
    
    if (await storage.get("removeToolbarInPopup")) {
        hide("app-toolbar");
    }
    if (!await storage.get("grabEntireScreenButton")) {
        hide("#entireScreen");
    }
    if (!await storage.get("openFromClipboardButton")) {
        hide("#openFromClipboard");
    }
    if (!await storage.get("openFileButton")) {
        hide(".separator");
        hide("#openFile");
    }
    
    onClick("#titleClickArea", () => {
        chrome.tabs.create({url:"https://jasonsavard.com?ref=SSHeader"});
    });

    polymerPromise.then(async () => {
        const $newsNotification = byId("newsNotification");

		if (await storage.get("_lastBigUpdate")) {
            onClick($newsNotification, async () => {
                await storage.remove("_lastBigUpdate");
                openChangelog("bigUpdateFromPopupWindow")
            });
            show($newsNotification);
            show("#newsNotificationBigUpdateMessage");
        }
    });		

    async function popupAction(params) { // button, sendGAName, grabFunc, grabFuncParams
        const button = params.button;
        const popupWindow = params.popupWindow;

        delete params.button; // removing for sendMessage to work later
        delete params.popupWindow;

        params.currentTab = currentTab;

        if (params.permissions) {
            const result = await chrome.permissions.contains({permissions: params.permissions});
            if (!result) {
                try {
                    const granted = await chrome.permissions.request({permissions: params.permissions});
                    if (!granted) {
                        // do nothing
                        throw {permissionNotGranted:true};
                    }
                } catch (error) {
                    error = "Access not granted to desktopCapture: (" + error + ")";
                    console.error(error);
                    throw error;
                }
            }
        }
        if (params.delay) {
            button.classList.add("clicked");
        }

        if (params.grabFunc == "grabEntirePage") {
            const button = selector("#entirePage .extraActionButton");
            show(button);
            showSpinner(button);
        } else {
            showSpinner(button);
        }

        let sendMessageResponded = false;
        console.log("params", params);
        try {
            if (params.delay) {
                globalThis.closeWindowTimeout = setTimeout(() => {
                    window.close();
                }, 300);
            } else {
                if (DetectClient.isFirefox()) {
                    globalThis.closeWindowTimeout = setTimeout(() => {
                        window.close();
                    }, 300);
                }
            }

            if (params.grabFunc != "grabEntirePage") {
                setTimeout(() => {
                    if (!sendMessageResponded) {
                        throw "Taking too long or no sendMessageResponded";
                    }
                }, 500);
            }

            if (params.delay || (DetectClient.isFirefox() && params.grabFunc == "grabEntirePage")) {
                await sendMessageToBG(params.grabFunc, params);
            } else {
                await globalThis[params.grabFunc](params);
            }
        } catch (error) {
            clearTimeout(globalThis.closeWindowTimeout);

            if (params.grabFunc == "grabEntirePage") {
                hideSpinner(button);
                openDialog("entirePageIssueDialogTemplate").then(response => {
                    if (response == "ok") {
                        // nothing
                    } else {
                        byId("visibleArea").click();
                    }
                });
                showError(error);
            } else {
                showCannotCaptureWarning(button, error);
            }
        } finally {
            sendMessageResponded = true;
        }
        sendGA('popup', params.sendGAName);
    }
    
    onClick("#selectedArea", function(event) {
        popupAction({
            button: this,
            sendGAName: "selectedArea",
            grabFunc: "grabSelectedArea"
        });
    });
    
    onClick("#selectedArea .extraActionButton", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "selectedAreaDelay",
            grabFunc: "grabSelectedArea",
            delay: seconds(3)
        });
        event.preventDefault();
        event.stopPropagation();
    });
    
    onClick("#selectElement", function(event) {
        popupAction({
            button: this,
            sendGAName: "selectElement",
            grabFunc: "selectElement"
        });
    });
    
    onClick("#selectElement .extraActionButton", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "selectElementDelay",
            grabFunc: "selectElement",
            delay: seconds(3)
        });
        event.preventDefault();
        event.stopPropagation();
    });
    
    onClick("#visibleArea, #justInstalledGrabVisibleArea", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "visibleArea",
            grabFunc: "grabVisiblePart"
        });
    });

    onClick("#visibleArea .extraActionButton", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "visibleAreaDelay",
            grabFunc: "grabVisiblePart",
            delay: seconds(3)
        });
        event.preventDefault();
        event.stopPropagation();
    });

    onClick("#entirePage", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "grabEntirePage",
            grabFunc: "grabEntirePage"
        });
        event.preventDefault();
        event.stopPropagation();
    });

    onClick("#entireScreen", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "screen",
            grabFunc: "grabScreen",
            popupWindow: window,
            permissions: ["desktopCapture"]
        });
    });

    onClick("#entireScreen .extraActionButton", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "screenDelay",
            grabFunc: "grabScreen",
            popupWindow: window,
            permissions: ["desktopCapture"],
            delay: seconds(5)
        });
        event.preventDefault();
        event.stopPropagation();
    });

    onClick("#recordScreen", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "recordScreen",
            grabFunc: "recordScreen",
            popupWindow: window,
            permissions: ["desktopCapture"]
        });
    });

    onClick("#recordScreen .extraActionButton", function(event) {
        popupAction({
            button: event.target,
            sendGAName: "recordScreenEnableMic",
            grabFunc: "recordScreen",
            popupWindow: window,
            permissions: ["desktopCapture"],
            enableMic: true
        });
        event.preventDefault();
        event.stopPropagation();
    });

    onClick("#openFile", function(event) {
        sendGA('popup', 'openFile');
        chrome.tabs.create({url:"openFile.html"});
        window.close();
    });

    onClick("#openFromClipboard", function(event) {
        sendGA('popup', 'openFromClipboard');
        window.clickedOpenFromClipboard = true;
        openFromClipboard().catch(response => {
            if (response.permissionNotGranted) {
                showError("You must grant this minimal permission if you want this extension to grab your image from the clipboard!");
            } else {
                showError(response);
            }
        });
    });

    onClick("#openFromClipboard .extraActionButton", function(event) {
        sendGA('popup', 'openFromClipboardAndCrop');
        window.clickedOpenFromClipboard = true;
        openFromClipboard({crop:true}).catch(response => {
            if (response.permissionNotGranted) {
                showError("You must grant this minimal permission if you want this extension to grab your image from the clipboard!");
            } else {
                showError(response);
            }
        });
        event.preventDefault();
        event.stopPropagation();
    });

    requestIdleCallback(() => {
        openFromClipboard({autoDetectClipboard:true}).catch(response => {
            //ignore
        });
    });
    
    // Delay some
    requestIdleCallback(() => {
        var $optionsMenu = initTemplate("optionsMenuItemsTemplate");
        initMessages("#options-menu *");
        
        onClick(".contribute", () => {
            chrome.tabs.create({url: 'contribute.html?fromPopup'});
            window.close();
        });

        onClick(".discoverMyApps", () => {
            chrome.tabs.create({url:"https://jasonsavard.com?ref=SSOptionsMenu"});
            window.close();
        });

        onClick(".feedback", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/forum/categories/explain-and-send-screenshots?ref=SSOptionsMenu"});
            window.close();
        });

        onClick(".changelog", async () => {
            await storage.remove("_lastBigUpdate");
            openChangelog("SSOptionsMenu");
            window.close();
        });

        onClick(".options", () => {
            chrome.tabs.create({url:"options.html"});
            window.close();
        });

        onClick(".aboutMe", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/about?ref=SSOptionsMenu"});
            window.close();
        });

        onClick(".help", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/wiki/Explain_and_Send_Screenshots"});
            window.close();
        });
        
    });
    
    onClick(".close", () => {
        window.close();
    });

    function processClipboardItem(item) {
        return new Promise((resolve, reject) => {
            if (item.kind == "file") {
                const fileName = item.name;
                const fileType = item.type;
                console.log("mimetype", JSON.stringify(item)); // will give you the mime types
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve({fileName:fileName, fileType:fileType, dataUrl:event.target.result});
                };
                reader.readAsDataURL(blob);
            } else if (item.kind == "string") {
                // when i paste text, type=text/plain
                // when i copy/paste from paint it's a file with type=image/png
                // when i right click and "Copy image" type=text/html
                if (item.type == "text/html") {
                    item.getAsString(function(s) {
                        // returns this:   <html><body><xxStartFragmentxx><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA...2EpZhOpUxE7OGFwX1dzxv3vX5ufsAUAFABQAUAFABQAUAFABQB//Z"/><xxEndFragmentxx></body></html> 
                        console.log("getasstring:", item, s);
                        const $div = document.createElement("div");
                        $div.append(s);
                        const dataUrl = $div.querySelector("img")?.getAttribute("src");

                        if (dataUrl?.indexOf("data:") == 0) {
                            console.log("data: found");
                            resolve({dataUrl:dataUrl});
                        } else {
                            resolve({couldNotProcessReason:"Can't process url: " + s});
                        }
                    });
                } else if (item.type == "text/plain") {
                    item.getAsString(function(s) {
                        if (s.indexOf("http") == 0) {
                            resolve({urlWasCopied:true, url:s});
                        } else {
                            resolve({couldNotProcessReason:"Could not parse this text/plain: " + s});
                        }
                    });
                } else {
                    resolve({couldNotProcessReason:"Could not determine item.type: " + item.type});
                }
            } else {
                resolve({couldNotProcessReason:"Could not determine item.kind: " + item.kind});
            }
        });
    }
    
    document.body.addEventListener("paste", event => {
        console.log("paste");
        const items = event.clipboardData.items;
        
        const promises = [];
        for (var a=0; a<items.length; a++) {
            const promise = processClipboardItem(items[a]);
            promises.push(promise);
        }
        
        Promise.all(promises).then(function(promisesResponse) {
            var success = false;
            var urlWasCopied = false;
            var errors = [];
            promisesResponse.some(function(promiseResponse, index) {

                if (window.clickedOpenFromClipboard) {
                    if (promiseResponse.couldNotProcessReason) {
                        var error = "item " + index + " " + promiseResponse.couldNotProcessReason;
                        errors.push(error);
                        console.log(error);
                    } else if (promiseResponse.urlWasCopied) {
                        urlWasCopied = true;
                        openDialog("urlWasCopiedTemplate").then(function(response) {
                            if (response == "ok") {
                                // nothing
                            } else {
                                chrome.tabs.create({url:promiseResponse.url});
                            }
                        });
                    } else {
                        console.log("item " + index, promiseResponse);
                        
                        getGrabMethod().then(async grabMethod => {
                            if (grabMethod == "openFromClipboardAndCrop") {

                                await setScreenshotVars({
                                    screenShotData: promiseResponse.dataUrl
                                });

                                chrome.tabs.create({url: "snapshot.html"});
                            } else {
                                openEditor({
                                    dataUrl: promiseResponse.dataUrl
                                });
                            }
                        });
                        
                        success = true;
                        return true;
                    }
                } else {
                    // auto-detect clipboard image
                    if (!promiseResponse.couldNotProcessReason && !promiseResponse.urlWasCopied) {
                        show("#clipboard-separator");
                        
                        const $openFromClipboard = byId("openFromClipboard");
                        $openFromClipboard.style["background-image"] = `url('${promiseResponse.dataUrl}')`;
                        $openFromClipboard.classList.add("with-clipboard-contents");
                        show($openFromClipboard);
                        hide($openFromClipboard.querySelectorAll(".remove-in-presence-of-clipboard-contents"));

                        success = true;
                        return true;
                    }
                }

            });
            if (window.clickedOpenFromClipboard && (!success && !urlWasCopied)) {
                showError("No images in clipboard!");
            }
        }).catch(error => {
            if (window.clickedOpenFromClipboard) {
                showError(error);
            }
        });

    });
})();