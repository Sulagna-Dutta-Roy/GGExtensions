"use strict";

try {
    importScripts("common.js", "explainAndSendScreenshots.js");
} catch (error) {
    console.error("error in sw: " + error);
}

var inBackground = true;

var screenShotTab;
var screenShotData;
var screenShotParams;
var videoBlob;

async function getManagedStorage() {
    if (chrome.storage.managed) {
        return await chrome.storage.managed.get();
    }
}

if (chrome.runtime.onInstalled && chrome.storage.sync) {
	chrome.runtime.onInstalled.addListener(async details => {
		if (details.reason == "install") {
			await storage.setDate("installDate");
			
			const managedItems = await getManagedStorage();
            if (!managedItems?.DoNotOpenWebsiteOnInstall) {
                const items = await chrome.storage.sync.get();
                console.info("sync items", items);
                if (items?.installDate) {
                    if (items.donationClicked) {
                        // transfer from sync to local
                        storage.set("donationClicked", items.donationClicked);
                        storage.set("removeHeaderFooter", items.removeHeaderFooter);
                    }
                } else {
                    const optionsUrl = chrome.runtime.getURL("options.html?action=install");
                    chrome.tabs.create({
                        url: `https://jasonsavard.com/thankYouForInstalling?app=screenshot&optionsUrl=${encodeURIComponent(optionsUrl)}`
                    });
                    chrome.storage.sync.set({"installDate": new Date().toJSON()});
                }
            }
			
			sendGA("installed", chrome.runtime.getManifest().version);
			
		} else if (details.reason == "update") {
			// seems that Reloading extension from extension page will trigger an onIntalled with reason "update"
			// so let's make sure this is a real version update by comparing versions
			var realUpdate = details.previousVersion != chrome.runtime.getManifest().version;
			if (realUpdate) {
				console.log("real version changed");
			}

			// exception, no major change for firefox
			if (chrome.runtime.getManifest().version == "9.0.1") {
				return;
			}
			
			var previousVersionObj = parseVersionString(details.previousVersion)
			var currentVersionObj = parseVersionString(chrome.runtime.getManifest().version);
			if (previousVersionObj.major != currentVersionObj.major || previousVersionObj.minor != currentVersionObj.minor) {
                storage.set("_lastBigUpdate", chrome.runtime.getManifest().version);

				const options = {
                    type: "basic",
                    title: getMessage("extensionUpdated"),
                    message: `${getMessage("name")} ` + chrome.runtime.getManifest().version,
                    iconUrl: NOTIFICATION_ICON_URL,
				}

                if (supportsNotificationButtons()) {
                    options.buttons = [{title: getMessage("seeUpdates")}];
                } else {
                    options.message += `\n${getMessage("seeUpdates")}`;
                }

				if (DetectClient.isFirefox()) {
					options.priority = 2;
				} else {
                    if (!DetectClient.isMac()) { // patch for macOS Catalina not working with requireinteraction
                        options.requireInteraction = true;
                    }
				}
				
				chrome.notifications.create("extensionUpdate", options, function(notificationId) {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message);
					}
				});
			}
        }
        
        init();
	});
} else {
	globalThis.failedOnInstall = true;
}

if (chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(() => {
        init();
    })
}

async function init() {
    console.info("init");

    await initMisc();

    if (globalThis.failedOnInstall && !await storage.get("installDate")) {
        await storage.setDate("installDate");
        const optionsUrl = chrome.runtime.getURL("options.html?action=install");
        chrome.tabs.create({
            url: `https://jasonsavard.com/thankYouForInstalling?app=screenshot&optionsUrl=${encodeURIComponent(optionsUrl)}`
        });
    }

    setUninstallUrl();

    await initPopup();
    setButtonIcon();
    initContextMenu();
}

if (chrome.commands) {
	chrome.commands.onCommand.addListener(async command => {
        try {
            if (command == "grab_selected_area") {
                await grabSelectedArea();
            } else if (command == "select_element") {
                await selectElement();
            } else if (command == "grab_visible_page") {
                await grabVisiblePart();
            } else if (command == "grab_entire_page") {
                await grabEntirePage();
            } else if (command == "grab_entire_screen") {
                await grabScreen();
            } else if (command == "record_screen") {
                const recordScreenWindow = await getRecordScreenWindow();
                if (recordScreenWindow) {
                    chrome.runtime.sendMessage({command: "stopMediaRecord"});
                } else {
                    await recordScreen();
                }
            }
        } catch (error) {
            showMessageNotification("Problem with screenshot", "Keyboard error: " + error);
        }
	});
}

//Add listener once only here and it will only activate when browser action for popup = ""
chrome.action.onClicked.addListener(async tab => {
    await initMisc();

    const recordScreenWindow = await getRecordScreenWindow();
    if (recordScreenWindow) {
        chrome.runtime.sendMessage({command: "stopMediaRecord"});
    } else {
        console.log("buttonAction: ", storage);
        try {
            const presetButtonAction = await storage.get("presetButtonAction");
            if (presetButtonAction == "grabSelectedArea") {
                await grabSelectedArea();
            } else if (presetButtonAction == "grabVisiblePart") {
                await grabVisiblePart();
            } else if (presetButtonAction == "grabEntirePage") {
                await grabEntirePage();
            }
        } catch (error) {
            showMessageNotification("Problem with screenshot", error);
        }
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    if (tabId == await storage.get(TAB_IDS.Editor)) {
        try {
            await chrome.windows.remove(await storage.get(WINDOW_IDS.RecordScreen));
        } catch (error) {
            console.warn("remove error", error);
        }
    }
});

function openChangelogAndCloseNotification(notificationId) {
    chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {focused:true});
    const contributePage = encodeURIComponent(chrome.runtime.getURL("contribute.html"));
	chrome.tabs.create({url: `https://jasonsavard.com/wiki/Explain_and_Send_Screenshots_changelog?cUrl=${contributePage}`, active:true});
	chrome.notifications.clear(notificationId, function() {});
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    await initMisc();
    try {
        if (info.menuItemId == "grabSelectedArea") {
            await grabSelectedArea();
        } else if (info.menuItemId == "selectElement") {
            await selectElement();
        } else if (info.menuItemId == "grabVisiblePart") {
            await grabVisiblePart();
        } else if (info.menuItemId == "grabEntirePage") {
            await grabEntirePage();
        } else if (info.menuItemId == "grabEntireScreen") {
            await grabScreen();
        } else if (info.menuItemId == "recordScreen") {
            await recordScreen();
        }
    } catch (error) {
        showMessageNotification("Problem with screenshot", "Context menu error: " + error);
    }
});

function onButtonClicked(notificationId, buttonIndex) {
	if (notificationId == "extensionUpdate") {
		if (buttonIndex == -1 || buttonIndex == 0) {
			openChangelogAndCloseNotification(notificationId);
		} else if (buttonIndex == 1) {
			chrome.notifications.clear(notificationId, function(wasCleared) {
				// nothing
			});
		}
        storage.remove("_lastBigUpdate");
	} else if (notificationId == "error") {
		openUrl(Urls.NotificationError);
		chrome.notifications.clear(notificationId, function () {});
		sendGA("errorNotification", "clicked notification");
    }
}

chrome.notifications.onClicked.addListener(async notificationId => {
    await initMisc();
	onButtonClicked(notificationId, -1);
});

// buttons clicked
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    await initMisc();
	onButtonClicked(notificationId, buttonIndex);
});

// closed notif
chrome.notifications.onClosed.addListener(async (notificationId, byUser) => {
    console.log("notif onclose", notificationId, byUser);
    await initMisc();
	
	if (notificationId == "extensionUpdate") {
		if (byUser) {
			
		}
	}
});

if (chrome.permissions) {
	if (chrome.permissions.onAdded) {
		chrome.permissions.onAdded.addListener(async response => {
            console.log("onadded", response);
            await initMisc();
			if (response.permissions && response.permissions.length && /downloads|desktopCapture/.test(response.permissions[0])) {
				// ignore
			} else {
				var options = {
					type: "basic",
					title: "Access granted",
					iconUrl: NOTIFICATION_ICON_URL,
					message: "Repeat the same action to grab from clipboard."
				}
	
				chrome.notifications.create("permissionAdded", options, function (notificationId) {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message);
					}
				});
			}
		});
	}
}

async function setUninstallUrl() {
    const url = `https://jasonsavard.com/uninstalled?app=screenshots&version=${encodeURIComponent(chrome.runtime.getManifest().version)}&daysInstalled=${await daysElapsedSinceFirstInstalled()}`;
    chrome.runtime.setUninstallURL(url);
}

let lastAlarm = 0;

if (chrome.alarms) {
    (async function lostEventsWatchdog() {
        let quietCount = 0;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 65000));
            const now = Date.now();
            const age = now - lastAlarm;
            console.log(`lostEventsWatchdog: last alarm ${age/1000}s ago`);
            if (age < 95000) {
                quietCount = 0;  // alarm still works.
            } else if (++quietCount >= 3) {
                if (await storage.get("_test")) {
                    return chrome.windows.create({url: "about:blank?should-reload-but-not-doing-it-fortesting" + new Date()});
                } else {
                    const recordScreenWindow = await getRecordScreenWindow();
                    if (!recordScreenWindow) {
                        return chrome.runtime.reload();
                    }    
                }
            } else {
                chrome.alarms.create(`lostEventsWatchdog/${now}`, {delayInMinutes: 1});
            }
        }
    })();
    
    chrome.alarms.create(Alarms.UPDATE_UNINSTALL_URL, { periodInMinutes: 60 * 24, delayInMinutes: generateRandomAlarmDelay() }); // 1 day

    chrome.alarms.onAlarm.addListener(async alarm => {
        lastAlarm = Date.now();
        
        await initMisc();
        if (alarm.name == Alarms.UPDATE_UNINSTALL_URL) {
            setUninstallUrl();
        }
    })
}

function setScreenshotVarsToServiceWorker(params) {
    screenShotTab = params.screenShotTab;
    screenShotData = params.screenShotData;
    screenShotParams = params.screenShotParams;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async function() {
        try {
            console.log("onMessage", message);

            // reconstruct params to because of firefox issue "The object could not be cloned."
            if (message.stringifyParams) {
                message.params = JSON.parse(message.params);
            }
            
            if (message.command == "afterSelectElement") {
                await grabVisiblePart(message.params);
                sendResponse();
            } else if (message.command == "setVar") {
                globalThis[message.params.name] = globalThis[message.params.value];
                sendResponse();
            } else if (message.command == "getScreenshotVars") {
                sendResponse({
                    screenShotTab: screenShotTab,
                    screenShotData: screenShotData,
                    screenShotParams: screenShotParams
                });
            } else if (message.command == "setScreenshotVars") {
                setScreenshotVarsToServiceWorker(message.params);
                sendResponse();
            } else if (message.command == "getVideoData") {
                if (videoBlob) {
                    let data = await blobToBase64(videoBlob);
                    data = data.split(",")[1];
                    sendResponse(data);
                } else {
                    throw "videoBlob does not exist (anymore?)";
                }
            } else if (message.command == "clearCommand") {
                if (screenShotParams) {
                    screenShotParams.command = null;
                }
                sendResponse();
            } else if (globalThis[message.command]) {
                const response = await globalThis[message.command](message.params);
                sendResponse(response);
            } else {
                console.error("Could not match onMessage message: ", JSON.stringify(message));
            }
        } catch (error) {
            console.error(error);
            sendResponse({
                error: error.message ?? error
            });
        }
    })();

    return true;
});