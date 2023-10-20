"use strict";

var donationClickedFlagForPreventDefaults;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.command == "featuresProcessed") {
		location.reload();
	}
});

(async () => {
    initUI();

    await polymerPromise;

    donationClickedFlagForPreventDefaults = await storage.get("donationClicked");

    console.log("settings", storage);

    if (await storage.get("donationClicked")) {
        selectorAll("[mustDonate]").forEach(element => element.removeAttribute("mustDonate"));
    }

    // must init options BEFORE polymer because paper-radio-group would keep it's ripple on if i tried selecting it after it was loaded
    initOptions();

    function initAudioInputs() {
        emptyNode("#audioInput");
        if (navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(gotDevices => {
                gotDevices.forEach(device => {
                    if (device.kind == "audioinput") {
                        const $node = document.createElement("paper-item");
                        $node.setAttribute("value", device.deviceId);
                        $node.textContent = device.label;
                        byId("audioInput").append($node);
                    }
                });
            });
        } else {
            const $node = document.createElement("paper-item");
            $node.setAttribute("value", "default");
            $node.textContent = "Default";
            byId("audioInput").append($node);
        }
    }

    initAudioInputs();

    onClick("#fetch-audio-devices", () => {
        getAudioMedia().then(audioStream => {
            console.log("audioStream", audioStream);
            audioStream.getTracks()[0].stop();
            initAudioInputs();
            showMessage(getMessage("done"));
        }).catch(error => {
            console.error(error);
            if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
                openGenericDialog({
                    title: "You must grant access to use this feature",
                    content: "Click Allow to grant access."
                });
            } else if (error.name == "PermissionDismissedError") {
                openGenericDialog({
                    content: "You must grant access to use this feature.",
                    okLabel: getMessage("grantAccess"),
                    showCancel: true
                });
            } else if (error.name == "NotFoundError") {
                niceAlert("Input device not found - try changing it or restart the browser");
            } else {
                niceAlert(error.name);
            }
        });
    });
    
    addEventListeners("#logo", "dblclick", async () => {
        await storage.toggle("donationClicked");
        location.reload(true);
    });
    
    addEventListeners("#presetButtonAction", "iron-select", async () => {
        setTimeout(function() {
            initPopup();
        }, 500);
    });
    
    addEventListeners("#buttonIcons paper-radio-button", "change", async () => {
        if (await storage.get("donationClicked")) {
            setTimeout(() => {
                setButtonIcon();
            }, 1);
        }
    });
    
    addEventListeners("#removeMenuItems", "change", async () => {
        setTimeout(() => {
            initContextMenu();
        }, 500);
    });
    
    addEventListeners("#darkMode", "change", async () => {
        setTimeout(() => {
            initUI();
        }, 1);
    });

    onClick("#viewUploadedFiles", async () => {
        const uploadedImgurFiles = await storage.get("uploadedImgurFiles");
        if (uploadedImgurFiles.length) {
            if (isVisible("#uploadedFiles")) {
                slideUp("#uploadedFiles");
            } else {
                emptyNode("#uploadedFiles");
                uploadedImgurFiles.forEach(file => {
                    console.log("file", file);
                    file.imageUrl ||= file.url;
                    const $div = importTemplateNode("#uploaded-files-template");
                    $div.querySelector("img").src = file.imageUrl;
                    $div.querySelector("img").addEventListener("click", () => {
                        window.open(file.imageUrl);
                    });
                    $div.querySelector(".delete").addEventListener("click", () => {
                        window.open(file.deleteUrl);
                        uploadedImgurFiles.some((thisFile, thisIndex) => {
                            if (thisFile.imageUrl == file.imageUrl) {
                                uploadedImgurFiles.splice(thisIndex, 1);
                                return true;
                            }
                        });
                        storage.set("uploadedImgurFiles", uploadedImgurFiles);
                        slideUp($div);
                    });
                    byId("uploadedFiles").append($div);
                });
                slideDown("#uploadedFiles");
            }
        } else {
            openGenericDialog({content: "No files uploaded to Imgur!"});
        }
    });
    
    byId("version").textContent = "v." + chrome.runtime.getManifest().version;
    onClick("#version", () => {
        showLoading();
        if (chrome.runtime.requestUpdateCheck) {
            chrome.runtime.requestUpdateCheck(function(status, details) {
                hideLoading();
                console.log("updatechec:", details)
                if (status == "no_update") {
                    openGenericDialog({title:"No update!", otherLabel: "More info"}).then(function(response) {
                        if (response == "other") {
                            location.href = "https://jasonsavard.com/wiki/Extension_Updates";
                        }
                    })
                } else if (status == "throttled") {
                    openGenericDialog({title:"Throttled, try again later!"});
                } else {
                    openGenericDialog({title:"Response: " + status + " new version " + details.version});
                }
            });
        } else {
            location.href = "https://jasonsavard.com/wiki/Extension_Updates";
        }
    });
    
    onClick("#changelog", event => {
        openChangelog("SSOptions");
        event.preventDefault();
        event.stopPropagation();
    });
})();