"use strict";

let mediaRecorder;
let recordingScreen;
let videoStream;

chrome.windows.getCurrent(window => {
    storage.set(WINDOW_IDS.RecordScreen, window.id);
});

const command = getUrlValue("command");
const params = JSON.parse(getUrlValue("params"));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // v2 apparently not related v1 commented return true below because was getting unhandled error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
    //(async function() {
        console.log("onmessage", message);
        const params = message.params;
        
        if (message.command === 'stopMediaRecord') {
            if (recordingScreen) {
                mediaRecorder.stop();

                if (videoStream) {
                    videoStream.getTracks().forEach(track => {
                        track.stop();
                    });
                }

                sendResponse();
            }
        }
    //})();

    //return true;
});

(async () => {

    initUI();

    if (command === 'grabScreenFromWindow') {

        let chooseDesktopMediaParams;
        if (params.grabTab) {
            await setGrabMethod("tab");
            chooseDesktopMediaParams = ["tab"];
        } else {
            await setGrabMethod("screen");
            chooseDesktopMediaParams = ["screen", "window"];
        }
        
        chrome.runtime.sendMessage({
            command: "closePopupWindow"
        });
        let streamId;
        try {
            streamId = await chooseDesktopMedia(chooseDesktopMediaParams);
        } catch (error) {
            if (error.name == "cancelledDesktopCapture") {
                chrome.windows.remove(await storage.get(WINDOW_IDS.RecordScreen));
                return;
            }
        }
    
        chrome.windows.update(await storage.get(WINDOW_IDS.RecordScreen), {
            state: "minimized"
        });
    
        await possibleDelay(params);
        const stream = await getScreenMedia(streamId);
    
        /*
        stream.getVideoTracks()[0].addEventListener("ended", async (e) => {
    
        });
        */
    
        let canPlayDetected;
        const video = document.createElement('video');
        video.addEventListener('loadeddata', function (e) {
            console.log("loadeddata", arguments)
        });
        video.addEventListener('loadedmetadata', function (e) {
            console.log("loadedmetadata", arguments)
        });
        video.addEventListener('playing', function () {
            console.log("playing", arguments)
        });
        video.addEventListener('error', function () {
            console.log("error", arguments)
        });
        video.addEventListener('abort', function () {
            console.log("abort", arguments);
        });
        video.addEventListener('canplay', async function () {
            console.log("canplay");
            if (!canPlayDetected) {
                canPlayDetected = true;
                video.play();
    
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
    
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
    
                await sleep(200);
    
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.pause();
                video.src = '';
                stream.getTracks()[0].stop();
                video.remove();
                canvas.remove();
    
                globalThis.screenShotTab = null;
                globalThis.screenShotData = canvas.toDataURL();
    
                await setScreenshotVars({
                    screenShotTab: null,
                    screenShotData: screenShotData
                });
    
                openTabInGroup(params.urlToGoAfter ?? "editor.html");
    
                chrome.windows.remove(await storage.get(WINDOW_IDS.RecordScreen));
            }
        }, false);
        video.srcObject = stream;
        console.log("video", video);
    } else if (command === 'recordScreenFromWindow') {
        await setGrabMethod("recordScreen");
    
        let audioStream;
        try {
            // patch: could not get both video and audio when using screencapture "chromeMediaSource" so we first the audio then the video and merge then with .addTrack below
            audioStream = await maybeStartAudioRecorder(params);
        } catch (error) {
            console.error("error", error);
            // v2 was getting this new error "Failed due to shutdown" so decided to uncomment them all
            // v1 permission not granted to audio AND could not be prompted to either (probably inside popup window)
            //if (error.name == "MediaDeviceFailedDueToShutdown" || error.name == "PermissionDeniedError" || error.name == "PermissionDismissedError") {
                //chrome.tabs.create({ url: 'promptForMic.html?error=' + error.name });
            //}
    
            if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError" || (error.includes && error.includes("denied"))) {
                const response = await openGenericDialog({
                    title: "You must grant access to use this feature",
                    content: "Click Allow to grant access."
                });
    
                if (response != "ok") {
                    window.close();
                }
            } else if (error.name == "PermissionDismissedError") {
                const response = await openGenericDialog({
                    content: "You must grant access to use this feature.",
                    okLabel: getMessage("grantAccess"),
                    showCancel: true
                });
            
                if (response != "ok") {
                    window.close();
                }
            } else if (error.name == "NotFoundError") {
                await niceAlert("Input device not found - try changing it or restart the browser");
                window.close();
            } else {
                await niceAlert(error.name);
                window.close();
            }
    
            getAudioMedia().then(audioStream => {
                console.log("audioStream", audioStream);
                audioStream.getTracks()[0].stop();
            });
        }
    
        try {
            chrome.runtime.sendMessage({
                command: "closePopupWindow"
            });
            const streamId = await chooseDesktopMedia(["screen", "window", "tab"]);
            
            videoStream = await getScreenMedia(streamId);

            await chrome.windows.update(await storage.get(WINDOW_IDS.RecordScreen), {
                state: "minimized"
            });

            // wait for window to minimize
            await sleep(1);

            await new Promise((resolve, reject) => {
                const video = document.createElement('video');
                video.hidden = true;
                document.body.appendChild(video);
    
                const chunks = [];
                const options = { mimeType: VIDEO_CONTENT_TYPE }
    
                if (audioStream) {
                    videoStream.addTrack(audioStream.getAudioTracks()[0]);
                }
    
                // somebody clicked on "Stop sharing"
                videoStream.getVideoTracks()[0].onended = function () {
                    console.log("video track onended");
                    if (mediaRecorder.state != "inactive") {
                        mediaRecorder.stop();
                    }
                };
    
                video.srcObject = videoStream;
                video.muted = true;
                // using autoplay instead of .play because in Brave getting user gesture error
                video.autoplay = true;
    
                mediaRecorder = new MediaRecorder(videoStream, options);
                mediaRecorder.start();
                mediaRecorder.onstart = function (e) {
                    chrome.action.setPopup({ popup: "" });
                    recordingScreen = true;
                    show("#do-not-close-warning");
                }
                mediaRecorder.ondataavailable = function (e) {
                    console.log("dataavailable", e);
                    chunks.push(e.data);
                }
                mediaRecorder.onwarning = function (e) {
                    console.warn('mediarecord warning: ' + e);
                };
                mediaRecorder.onerror = function (e) {
                    console.error('mediarecord error: ' + e);
                    recordingScreen = false;
                    throw e;
                };
                mediaRecorder.onstop = async function (e) {
                    console.log("onstop");
                    recordingScreen = false;
                    initPopup();
    
                    videoStream.getTracks()[0].stop();
    
                    const blob = new Blob(chunks, { 'type': VIDEO_CONTENT_TYPE });
    
                    if (blob.size) {
                        video.src = URL.createObjectURL(blob);
                        video.controls = true;
    
                        await setScreenshotVars({
                            screenShotTab: null,
                            screenShotData: video.src,
                        });
    
                        await openTabInGroup("editor.html");
                        resolve();
    
                        //await sleep(1);
                        //chrome.windows.remove(await storage.get(WINDOW_IDS.RecordScreen));
                        //window.close();
                    } else {
                        await niceAlert("Video size is 0", "This might require a computer restart.");
                        window.close();
                    }
                }
            });
        } catch (error) {
            (async function() {
                console.error(error);
                if (audioStream) {
                    audioStream.getTracks()[0].stop();
                }
                let errorMsg;
                if (error.message) {
                    errorMsg = error.message;
                } else {
                    errorMsg = error;
                }
                if (error.name == "cancelledDesktopCapture") {
                    chrome.windows.remove(await storage.get(WINDOW_IDS.RecordScreen));
                } else if (DetectClient.isMac() && error.toString().includes("Permission denied by system")) {
                    await niceAlert(errorMsg + ". " + "Mac uses might have to enabled screen recording for Chrome. Go to System Preferences > Security & Privacy > Privacy > Screen Recording. Make sure Chrome is listed and has a checkbox.")
                } else {
                    await niceAlert(errorMsg);
                }
                window.close();
            })();
        }
    }
})();