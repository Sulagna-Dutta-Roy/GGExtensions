"use strict";

var donationClickedFlagForPreventDefaults;
var screenShotTab;

var DEBUG_PICT_DOWN = false;
var DEBUG_IMM_DOWN = false;

var clickedTool;
var previousClickedTool;
var canvasLeft;
var aborted = false;
var fontSize;
var lineHeight;
var fontBackground;
var numberCount = 1;

if (!window.BlobBuilder && window.WebKitBlobBuilder) {
	window.BlobBuilder = window.WebKitBlobBuilder;
}

const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
};

window.addEventListener('resize', function(e) {
    console.log("window resize");
    initCanvasPosition();

    if (document.body.scrollHeight > document.body.clientHeight) {
        //alert('has scroll')
    } else {
        //alert('no scroll')
    }
});

function writeText(str, context, x, y, backgroundColor, backgroundWidth) {
	if (backgroundColor) {
		context.fillStyle = backgroundColor;
	    var width = backgroundWidth ? backgroundWidth : context.measureText(str).width;
	    context.fillRect(x - 1, y - 4 /* depends on font */, width+4, parseInt(fontSize, 10)+4);
	    context.fillStyle = drawingColor;
	}
	
	if (context.fillText) {
		context.fillText(str, x + 1, y);
	} else if (context.strokeText) {
		context.strokeText(str, x + 1, y);
	}
}

function watermarkImage() {
	if (typeof canvas != "undefined" && canvas.width > 400 && screenShotTab) {

        ctx.save();
		
		setShadow(true);
		
		ctx.font = 'normal 11px sans-serif';
		ctx.strokeStyle = ctx.fillStyle = "white";
        
        const canvasHeight = canvas.style.height.replace(/px/, '')
		writeText(getMessage("name"), ctx, 10, canvasHeight - 30);
		try {
            writeText(screenShotTab.url, ctx, 10, canvasHeight - 15);
		} catch (e) {
            console.error("problem with watermark: " + e);
        }
        
        ctx.restore();
		
		show("#removeWatermarkWrapper");
	}
}

function setShadow(flag, offset = 1) {
	if (flag) {
		ctx.shadowOffsetX = ctxTemp.shadowOffsetX = offset;
		ctx.shadowOffsetY = ctxTemp.shadowOffsetY = offset;
		ctx.shadowColor = ctxTemp.shadowColor = "gray";
	} else {
		ctx.shadowColor = ctxTemp.shadowColor = "transparent";
	}
}

async function uploadImage() {
    try {
        const RAPID_API_CLIENT_ID = "c26e99413670dbc";
        const RAPID_API_KEY = "GIwSVEegkCmshTWehOzGWpxZJKcfp1zpdM1jsnCDkfLlgZu6n7";

        // v2 added client_id param cause of this bug: https://rapidapi.com/imgur/api/imgur-9/discussions/25519
        const response = await fetchJSON(`https://imgur-apiv3.p.rapidapi.com/3/image?client_id=${RAPID_API_CLIENT_ID}`, {
                type: "base64",
                // note: imgurl does not accept jpg
                image: canvas.toDataURL(await storage.get("imageFormat")).replace(/^data:image\/(png|jpe?g);base64,/, "")
            },
            {
                method: "post",
                headers: {
                    "X-Mashape-Key": RAPID_API_KEY,
                    "Authorization": `Client-ID ${RAPID_API_CLIENT_ID}`,
                    "x-rapidapi-host": "imgur-apiv3.p.rapidapi.com", // added just in case
		            "x-rapidapi-key": RAPID_API_KEY // added just in case
                }
            }
        );

        if (response.success) {
            const fileObj = {
                imageUrl: response.data.link,
                deleteUrl: `https://imgur.com/delete/${response.data.deletehash}`
            }
            const uploadedImgurFiles = await storage.get("uploadedImgurFiles");
            
            // unshift adds to beginning of array
            uploadedImgurFiles.unshift(fileObj);

            // max items to have is 20
            if (uploadedImgurFiles.length > 20) {
                uploadedImgurFiles.pop();
            }
            await storage.set("uploadedImgurFiles", uploadedImgurFiles);
            
            return fileObj;
        } else {
            throw response.data.error;
        }
    } catch (error) {
        console.error(error);
        
        if (error.message) { // obj thrown from fetchjson when invalid: X-Mashape-Key
            error = error.message;
        } else if (error.data) { // obj thrown from fetchjson when invalid: Authorization
            if (error.data.error.message) { // thrown if eror with image url data
                error = error.data.error.message;
            } else {
                error = error.data.error;
            }
        }

        niceAlert(`There was a problem. Download the image or try again later. Error: ${error}`);

		throw error;
    }
}

function showLoading() {
	selector("#progress").style.opacity = "1";
	selector("app-header").style.opacity = "0.4";
}

function hideLoading() {
	selector("#progress").style.opacity = "0";
	selector("app-header").style.opacity = "1";
}

async function getFontBackground() {
    const fontBackground = await storage.get("fontBackground");
	var backgroundColor;
	if (fontBackground == "semi-transparent") {
		backgroundColor = "rgba(255, 255, 255, 0.6)";
	} else if (fontBackground == "none") {
		backgroundColor = "transparent";
	} else {
		backgroundColor = fontBackground;
	}
	return backgroundColor;
}

function initCanvasPosition() {
    // do this check because when downloading Chrome would trigger a resize because the downloaded file would appear at the bottom of the chrome window
    if (isVisible(canvas)) {
        canvasLeft = canvas.getBoundingClientRect().left;
        byId("canvastemp").style.left = canvasLeft;
    }
}

async function getFilename() {
	var title;
	if (await storage.get("grabMethod") == "recordScreen") {
		if (screenShotTab?.title) {
			title = "Screen recording of " + screenShotTab.title;
		} else {
			title = "Screen recording";
		}
		title += ".webm";
	} else {
		if (screenShotTab?.title) {
			title = "Screenshot of " + screenShotTab.title;
		} else {
			title = "Screenshot";
        }
        
        title = ellipsis(title, 150);
		title += getImageFormatExtension(await storage.get("imageFormat"));
	}
	return title;
}

async function downloadVideoFile() {
	await downloadFile(await getFilename(), byId("video").src, VIDEO_CONTENT_TYPE);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.command == "featuresProcessed") {
		location.reload();
	}
});

async function initFonts() {
    const storageFontSize = await storage.get("fontSize");
	if (storageFontSize.match(/small/i)) {
        fontSize = 12;
        lineHeight = 16;
        INPUT_OFFSET_X = -6;
        INPUT_OFFSET_Y = -13;
        INPUT_OFFSET_X_PAINTED = 7;
        INPUT_OFFSET_Y_PAINTED = 11;
        INPUT_BG_OFFSET_Y = -3;
        INPUT_BG_OFFSET_HEIGHT = -2;
	} else if (storageFontSize.match(/normal/i)) {
        fontSize = 18;
        lineHeight = 22;
        INPUT_OFFSET_X = -6;
        INPUT_OFFSET_Y = -16;
        INPUT_OFFSET_X_PAINTED = 7;
        INPUT_OFFSET_Y_PAINTED = 11;
        INPUT_BG_OFFSET_Y = -6;
        INPUT_BG_OFFSET_HEIGHT = 0;
	} else if (storageFontSize == "large") {
        fontSize = 30;
        lineHeight = 38;
        INPUT_OFFSET_X = -6;
        INPUT_OFFSET_Y = -28;
        INPUT_OFFSET_X_PAINTED = 7;
        INPUT_OFFSET_Y_PAINTED = 15;
        INPUT_BG_OFFSET_Y = -6;
        INPUT_BG_OFFSET_HEIGHT = -4;
	} else {
        fontSize = 38;
        lineHeight = 38;
        INPUT_OFFSET_X = -6;
        INPUT_OFFSET_Y = -28;
        INPUT_OFFSET_X_PAINTED = 7;
        INPUT_OFFSET_Y_PAINTED = 11;
        INPUT_BG_OFFSET_Y = -6;
        INPUT_BG_OFFSET_HEIGHT = 0;
    }
    
    //lineHeight = fontSize + 4;
    
    // commented because different between laptop and desktop
	//fontSize *= devicePixelRatio;
	//lineHeight *= devicePixelRatio;
	
	ctx.font = ctxTemp.font = `normal ${fontSize}px ${await storage.get("fontFamily")}`;
    
    byId("text-inner-outline").style["background-color"] = await getFontBackground();

    css("#text", {
		"font": ctx.font,
		"line-height": `${lineHeight}px`
    });
	
	if (DetectClient.isChromium()) {
		byId("text").classList.add("chromeOnlyMultilinePatch");
	}
}

async function initLineOptions() {
	ctx.lineWidth = await storage.get("lineWeight");
    
    const fillStyle = await storage.get("fillStyle");
    
    if (fillStyle == "semi-transparent") {
        ctx.strokeFill = "fill";
        ctx.fillStyle = drawingColor + "44"; // add hex opacity
    } else {
        ctx.strokeFill = fillStyle;
        ctx.fillStyle = drawingColor;
    }
}

async function initBlurTool() {
    if (await storage.get("blurShape") == "selectArea") {
        await initTool({
            toolName:	"select",
            options:	byId("blurOptions")
        });
    } else {
        await initTool({
            toolName:	"eraser",
            options:	byId("blurOptions"),
            className:	"blur"
        });
    }
}

async function initTool(params) {
	await initFonts();
	await initLineOptions();
	if (params.options) {
		document.body.classList.add("toolbarOptionsVisible");
        if (params.toolName == "ellipse" || params.toolName == "rectangle") {
            show("#fill-style");
        } else {
            hide("#fill-style");
        }
		fadeIn(params.options);
	}
	ctx.tool = new tool[params.toolName]();
	let className;
	if (params.className) {
		className = params.className;
	} else {
		className = "line";
	}
	byId("canvas").className = className;
}

function wasUsedJustBefore(actionDate) {
    return actionDate && Math.abs(actionDate.diffInMillis()) < 100;
}

async function setColors(color) {
    setDrawingColor(ctx, color);

    initLineOptions();

    byId("text").style.color = color;
    if (await storage.get("drawingColor") != color) {
        console.log("color saved", color);
        await storage.set("drawingColor", color);
    }

    let backgroundColor;
    if (await storage.get("darkMode")) {
        backgroundColor = "none";
    } else {
        backgroundColor = isColorTooLight(color) ? "#999" : "none"
    }

    css("#color-list-button", {
        "color": color,
        "background": backgroundColor,
    });


    // initialize inputs
    console.log("color", color);
    if (color && !color.includes("rgb")) {
        byId("hex").value = color;

        const rgb = hexToRgb(color);
        if (rgb) {
            byId("rgb-red").value = rgb[0];
            byId("rgb-green").value = rgb[1];
            byId("rgb-blue").value = rgb[2];
        }
    }
}

(async () => {
    await initUI();

    donationClickedFlagForPreventDefaults = await storage.get("donationClicked");

    wsp = byId('workspace');
    canvas = byId('canvas');
    ctx = canvas.getContext("2d");

    //set up overlay canvas (for preview when drawing lines, rects etc)
    canvastemp = byId("canvastemp");
    ctxTemp = canvastemp.getContext("2d");	

    //set up selection canvas (invisible, used for selections)
    const SEL_WIDTH = 3000;
    const SEL_HEIGHT = 3000;
    if (typeof OffscreenCanvas != "undefined") {
        canvassel = new OffscreenCanvas(SEL_WIDTH, SEL_HEIGHT);
    } else if (typeof document != "undefined") {
        canvassel = document.createElement("canvas");
        canvassel.width = SEL_WIDTH;
        canvassel.height = SEL_HEIGHT;
    }
    csel = canvassel.getContext("2d");

    if (await storage.get("alwaysUpload")) {
        hide("#gmailIssue");
        hide(".makeDefault");
    } else {
        hide("#removeDefault");
    }

    if (await storage.get("removeSocialMedia")) {
        hide("#contribute");
    }
    
    if (await storage.get("_shareClicks") >= 2) {
        hide("#share");
    }
    
    const bg = await getScreenshotVars();
    // save this now because bg might disappear after going idle because it's an event page
    screenShotTab = bg.screenShotTab;
    
    if (!bg.screenShotData) {
        document.body.classList.remove("postPolymerLoading");
        alert("You must recapture the image!");
        window.close();
        return;
    }
    
    if (await storage.get("grabMethod") == "recordScreen") {
        hide("#toolsButtons");
        hide("#back, #upload, #editInPixlr, #share, #pdf, #copyToClipboard, #searchImage");
        hide("#canvas");
        show("#imageOptions");

        const video = byId("video");

        const videoWrapper = byId("videoWrapper");
        videoWrapper.href = bg.screenShotData;
        videoWrapper.download = await getFilename();
        onClick(videoWrapper, event => {
            if (video.paused == false) {
                video.pause();
            } else {
                video.play();
            }
            event.preventDefault();
        });

        video.src = bg.screenShotData;
        show(video);
    } else {
        hide("#uploadToYouTube");

        await Promise.all([polymerPromise, polymerPromise2]);
        const image = new Image();
        image.src = bg.screenShotData;
        image.onload = async function () {

            console.log("width of image: " + image.width);
            
            let width;
            let height;
            let selectElement;
            let dpr = devicePixelRatio;

            console.log("screenShotParams", bg.screenShotParams);
            try {
                if (bg.screenShotParams?.source == "afterSelectElement") {
                    selectElement = true;
                    dpr = bg.screenShotParams.devicePixelRatio;
                    width = bg.screenShotParams.width * dpr;
                    height = bg.screenShotParams.height * dpr;
                }
            } catch (error) {
                console.warn("Possible firefox dead object error", error);
            }

            if (!selectElement) {
                width = image.width;
                height = image.height;
            }

            var rightMargin = 0;
            if (await storage.get("grabMethod") == "entirePage") {
                rightMargin = SCROLLBAR_WIDTH;
            }
            // note: changing dimensions of canvas resets drawing color on canvas
            canvas.width = canvastemp.width = width - rightMargin;
            canvas.height = canvastemp.height = height;

            // set canvas.STYLE.width for hidpi blurry issues, refer to https://www.html5rocks.com/en/tutorials/canvas/hidpi/
            canvas.style.width = canvastemp.style.width = canvas.width / dpr + 'px';
            canvas.style.height = canvastemp.style.height = canvas.height / dpr + 'px';

            if (selectElement) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(image,
                    bg.screenShotParams.left * dpr,
                    bg.screenShotParams.top * dpr,
                    bg.screenShotParams.width * dpr,
                    bg.screenShotParams.height * dpr,
                    0, 0,
                    bg.screenShotParams.width * dpr,
                    bg.screenShotParams.height * dpr
                );
            } else {
                ctx.drawImage(image, 0, 0);
            }

            ctx.scale(dpr, dpr);
            ctxTemp.scale(dpr, dpr);

            console.log("image top: " + canvas.getBoundingClientRect().top);
            // patch for intermittent image being clipped at top on edit page
            if (canvas.getBoundingClientRect().top <= 44) {
                selector("app-header-layout").resetLayout();
                //$("body").css("background", "red");
            }

            // if image is small then lower the top of the image editing box to show a space between header and image
            if (canvas.width < 600) {
                byId("workspace").style["margin-top"] = "40px";
            }

            // patch for offset issue: must call this afer margin-top is set above because it creates a vertical scrollbar appears
            initCanvasPosition();

            canvas.classList.add("loaded");

            await initPaint();

            const defaultTool = await storage.get("defaultTool");

            if (defaultTool == "arrow") {
                await initTool({
                    toolName:	"arrow"
                });
                byId("arrow").classList.add("selected");
            } else if (defaultTool == "line") {
                await initTool({
                    toolName:	"line"
                });
                byId("line").classList.add("selected");
            } else if (defaultTool == "freeHand") {
                await initTool({
                    toolName:	"pencil"
                });
                byId("freeHand").classList.add("selected");
            } else if (defaultTool == "writeText") {
                await initTool({
                    toolName:	"text",
                    className:	"text"
                });
                byId("writeText").classList.add("selected");
            } else if (defaultTool == "numbers") {
                await initTool({
                    toolName:	"numbers",
                    className:	"numbers"
                });
                byId("numbers").classList.add("selected");
            } else if (defaultTool == "highlight") {
                await initTool({
                    toolName:	"highlight",
                    className:	"highlight"
                });
                byId("highlight").classList.add("selected");
            } else if (defaultTool == "blur") {
                //initBlurTool();
                //byId("blur").classList.add("selected");
                setTimeout(() => {
                    byId("blur").click();
                }, 100);
            } else if (defaultTool == "rectangle") {
                await initTool({
                    toolName:	"rectangle",
                });
                byId("rectangle").classList.add("selected");
            } else if (defaultTool == "circle") {
                await initTool({
                    toolName:	"ellipse",
                });
                byId("circle").classList.add("selected");
            }

            await initFonts();
            await initLineOptions();

            undoSave({
                firstTime: true
            });
            
            copyToClipboard().catch(error => {
                console.warn(error);
                // ignore
            });
            
            document.body.classList.remove("postPolymerLoading");
        }
    }
    
    onClick("#toolsButtons > *", event => {
        previousClickedTool = clickedTool;
        clickedTool = event.target.getAttribute("id");
        sendGA("actionButtons", clickedTool);

        if (clickedTool == "undo" || clickedTool == "color" || clickedTool == "my-filter" || clickedTool == "done") {
            clickedTool = previousClickedTool;
        } else {
            setShadow(false);
            ctx.globalAlpha = 1;
            selectorAll("#toolsButtons > *").forEach(el => el.classList.remove("selected"));
            event.target.classList.add("selected");
            
            hide(".subOptions");
        }
    })
    
    onClick("#refresh", () => {
        window.location.reload();
    });
    
    onClick("#undo", () => {
        undo();
    });
    
    onClick("#redo", () => {
        redo();
    });

    onClick("#rectangle", () => {
        initTool({
            toolName:	"rectangle",
            options:	byId("lineOptions")
        });
    })

    onClick("#spotlight-circle", () => {
        initTool({
            toolName:	"spotlightCircle",
            options:	byId("lineOptions")
        });
    })

    onClick("#circle", () => {
        initTool({
            toolName:	"ellipse",
            options:	byId("lineOptions")
        });
    })

    onClick("#crop", () => {
        initTool({
            toolName:	"select",
            options:	byId("cropOptions")
        });
    })
    
    onClick("#select", () => {
        initTool({
            toolName:	"select",
            options:	byId("selectOptions")
        });
    });
    
    function crop(x, y, x2, y2) {
        m = {
            x: x,
            y: y,
        }
        ctx.tool.down({});
        m = {
            x: x2,
            y: y2,
        }
        ctx.tool.move({});
        ctx.tool.up({});

        byId("refresh").classList.remove("hidden");
    }

    function cropSelect(button, xRatio, yRatio) {
        selector("#cropOptions .selected")?.classList.remove("selected");
        button.classList.add("selected");

        const width = canvas.height * xRatio / yRatio;
        const offsetFromEdge = (canvas.width - width) / 2;

        if (offsetFromEdge < 0) { // canvas.width <= canvas.height
            const height = canvas.width * yRatio / xRatio;
            const offsetFromEdge = (canvas.height - height) / 2;
            crop(0, offsetFromEdge, canvas.width, canvas.height - offsetFromEdge);
        } else {
            crop(offsetFromEdge, 0, canvas.width - offsetFromEdge, canvas.height);
        }
    }

    onClick("#crop-square", () => {
        if (canvas.width < canvas.height) {
            const offsetFromEdge = (canvas.height - canvas.width) / 2;
            crop(0, offsetFromEdge, canvas.width, canvas.height - offsetFromEdge);
        } else {
            const offsetFromEdge = (canvas.width - canvas.height) / 2;
            crop(offsetFromEdge, 0, canvas.width - offsetFromEdge, canvas.height);
        }
    });

    onClick(".crop-ratio", function() {
        cropSelect(this, this.getAttribute("x"), this.getAttribute("y"));
    });

    onClick("#delete", () => {
        ctx.tool.del();
    });
    
    onClick("#arrow", () => {
        initTool({
            toolName:	"arrow",
            options:	byId("lineOptions")
        });
    });

    onClick("#line", () => {
        initTool({
            toolName:	"line",
            options:	byId("lineOptions")
        });
    });

    onClick("#freeHand", () => {
        initTool({
            toolName:	"pencil",
            options:	byId("lineOptions")
        });
    });

    onClick("#writeText", () => {
        initTool({
            toolName:	"text",
            options:	byId("textOptions"),
            className:	"text"
        });
    });

    onClick("#numbers", () => {
        initTool({
            toolName:	"numbers",
            options:	byId("numbersOptions"),
            className:	"numbers"
        });
    });

    onClick("#highlight", () => {
        initTool({
            toolName:	"highlight",
            className:	"highlight"
        });
    });

    onClick("#blur", () => {
        initBlurTool();
    });

    function onColorClick(colorNode) {
        window.colorMouseDownDate = new Date();
        const hex = colorNode.getAttribute("color");
        setColors(hex);
        byId("color-listbox").closest("paper-menu-button").close();
    }

    requestIdleCallback(() => {
        console.time("colors")
        const colors = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92', '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723', '#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121']
        const colorListbox = byId("color-listbox-items");
    
        const fragment = document.createDocumentFragment();
        colors.forEach(color => {
            const $listItem = document.createElement("paper-item");
            $listItem.setAttribute("class", "color");
            $listItem.setAttribute("color", color);
            $listItem.setAttribute("style", `background-color: ${color}`);
            onClick($listItem, function() {
                onColorClick(this);
            });
            fragment.appendChild($listItem);
        });
        colorListbox.appendChild(fragment);
    
        console.timeEnd("colors")
    }, {
        timeout: 2000
    });

    onClick("#precise-color-wrapper", e => {
        e.stopPropagation();
    });

    onClick(".rgb", function() {
        this.select();
    });

    addEventListeners(".rgb", "keyup", function() {
        const color = `rgb(${byId("rgb-red").value}, ${byId("rgb-green").value}, ${byId("rgb-blue").value})`;
        byId("precise-color-rgb-hex").style["background-color"] = color;
        byId("precise-color-rgb-hex").setAttribute("color", color);
        setColors(color);
    });

    addEventListeners("#hex", "keyup", function() {
        const hex = `#${this.value.replace("#", "")}`;
        byId("precise-color-rgb-hex").style["background-color"] = hex;
        byId("precise-color-rgb-hex").setAttribute("color", hex);
        setColors(hex);
    });

    onClick("#precise-color-done", () => {
        byId("color-listbox").closest("paper-menu-button").close();
    });

    const drawingColor = await storage.get("drawingColor");

    onClick(".color, .precise-color-sample", function() {
        onColorClick(this);
    });

    setColors(drawingColor);

    onClick("#color-picker", () => {
        initTool({
            toolName:	"colorPicker",
            //className:  "colorPicker"
        });
    });
    
    function changeZoom(factor, resetScale) {
        const oldCanvas = canvas.toDataURL();
        
        document.body.classList.add("zoomed");

        const oldW = canvas.width;
        const oldH = canvas.height;
        
        const newCSSWidth = canvas.width * factor;
        const newCSSHeight = canvas.height * factor;
        
        selectorAll("#canvas, #canvastemp", el => {
            el.width = newCSSWidth;
            el.height = newCSSHeight;
        });
        canvas.width = canvastemp.width = canvas.width * factor;
        canvas.height = canvastemp.height = canvas.height * factor;

        // to remove blur
        canvas.style.width = canvastemp.style.width = canvas.width + 'px';
        canvas.style.height = canvastemp.style.height = canvas.height + 'px';

        if (!resetScale) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctxTemp.fillStyle = "white";
            ctxTemp.fillRect(0, 0, canvastemp.width, canvastemp.height);
        }
        
        initCanvasPosition();
        
        const img = new Image();
        img.src = oldCanvas;
        img.onload = function () {

            let xOffset, yOffset;

            // ctx
            if (resetScale) {
                ctx.scale(factor, factor);
                ctx.drawImage(img, 0, 0);
            } else {
                xOffset = (newCSSWidth - oldW) / 2;
                yOffset = (newCSSHeight - oldH) / 2;
                ctx.drawImage(img, xOffset, yOffset);
            }
            
            if (resetScale) {
                ctx.scale(devicePixelRatio * resetScale, devicePixelRatio * resetScale);
            }

            // ctxtemp
            if (resetScale) {
                ctxTemp.scale(factor, factor);
                ctxTemp.drawImage(img, 0, 0);
            } else {
                ctxTemp.drawImage(img, xOffset, yOffset);
            }
            
            if (resetScale) {
                ctxTemp.scale(devicePixelRatio * resetScale, devicePixelRatio * resetScale);
            }

            selectPreviousTool();

            if (!resetScale) {
                canvas.style.border = "1px solid #dadada";
            }
        }
        
        byId("refresh").classList.remove("hidden");
    }

    let originalCanvas;

    function setFilter(name, value) {
        if (name != window.previousFilter) {
            originalCanvas = cloneCanvas(canvas);
            window.previousFilter = name;
        }

        ctx.save();
        ctx.filter = `${name}(${value})`;
        ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width / devicePixelRatio, originalCanvas.height / devicePixelRatio);
        ctx.restore();
    }
    
    onClick("#my-filter", function() {
        window.previousFilter = null;

        const $template = initTemplate("filterDialogTemplate");

        function hookFilterEvents(selector, filterName, filterFn) {
            ["input", "change"].forEach(type => {
                $template.querySelector(selector).addEventListener(type, function() {
                    setFilter(filterName, filterFn(this));
                });
            });
        }

        hookFilterEvents("#grayscale", "grayscale", function(el) {
            return el.value/100;
        });

        hookFilterEvents("#brightness", "brightness", function(el) {
            return el.value;
        });

        hookFilterEvents("#sepia", "sepia", function(el) {
            return el.value/100;
        });

        hookFilterEvents("#saturation", "saturate", function(el) {
            return el.value;
        });

        hookFilterEvents("#invert", "invert", function(el) {
            return el.value;
        });

        hookFilterEvents("#hue-rotation", "hue-rotate", function(el) {
            return `${el.value}deg`;
        });

        onClick($template.querySelector(".okDialog"), async function() {
            undoSave();
            initUndoButtons();
            byId("refresh").classList.remove("hidden");

            if (!await donationClicked("filters")) {
                undo();
            }
            $template.close();
        });
        openDialog($template);
    });

    onClick("#resize", () => {
        changeZoom(1.5);
    });
    
    onClick("#zoomIn", () => {
        changeZoom(1.5, 0.66666666);
    });
    
    onClick("#zoomOut", () => {
        changeZoom(0.66666666, 1.5);
    });
    
    byId("textOptions").addEventListener("mousedown", () => {
        window.textOptionsMousedownDate = new Date();
    });

    onClick("#textOptions paper-listbox[storage] paper-item", function() {
        setTimeout(() => {
            initFonts();
        }, 100);
    })
    
    onClick("#fill-style paper-listbox[storage] paper-item", function() {
        setTimeout(() => {
            initLineOptions();
        }, 100);
    });

    function setPaperSliderHeight(height) {
        byId("line-weight").value = height;

        const root = document.documentElement;
        root.style.setProperty("--paper-slider-height", `${height}px`);
    }    
    
    setPaperSliderHeight(await storage.get("lineWeight"));

    ["change", "immediate-value-change"].forEach(type => {
        byId("line-weight").addEventListener(type, async function(e) {
            if (await donationClicked("lineWeight")) {
                const $lineWeight = byId("line-weight");
                const value = $lineWeight.immediateValue;
        
                await storage.set("lineWeight", value);
                initLineOptions()
        
                setPaperSliderHeight(value);
            }
        });
    });

    onClick("#blurOptions paper-item", function() {
        setTimeout(() => {
            initBlurTool();
        }, 100);
    });
    
    let mouseState;
    const textOutlineOffset = {};

    byId("text-outline").addEventListener("mousedown", function(e) {
        mouseState = "down";
        document.body.classList.add("moving");
        textOutlineOffset.x = e.offsetX;
        textOutlineOffset.y = e.offsetY;
    });

    byId("canvas").addEventListener("mousemove", function(e) {
        if (mouseState == "down") {
            const textOutline = byId("text-outline");
            textOutline.style.left = e.pageX - textOutlineOffset.x;
            textOutline.style.top = e.pageY - canvas.getBoundingClientRect().top - textOutlineOffset.y;
        }
    });

    byId("canvas").addEventListener("mouseup", function() {
        mouseState = "up";
        document.body.classList.remove("moving");
    });

    byId("text").addEventListener('paste', function (e) {
        // Prevent the default action
        e.preventDefault();
    
        // Get the copied text from the clipboard
        const text = e.clipboardData.getData('text/plain');
    
        // Insert text at the current position of caret
        const range = document.getSelection().getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });

    byId("text").addEventListener("blur", async function() {
        console.log("text blur")
        if (document.body.classList.contains("moving")
            || wasUsedJustBefore(window.colorMouseDownDate)
            || wasUsedJustBefore(window.textOptionsMousedownDate) ) {
            // we are probably just dragging
            console.log("we are probably just dragging");
        } else if (!isVisible(this)) {
            // when you write text and click somewhere else in canvas then the blur event will hide the element and this "hide" element triggers another blur event - so ignore it.
        } else {
            const $text = this;
            const $textOutline = $text.closest("#text-outline");
            // patch for double new line when only 1 enter key pressed on an empty line
            $text.innerHTML = $text.innerHTML.replaceAll("<div><br></div>", "<div>&nbsp;</div>");
            const text = $text.innerText;

            if (text) {
                ctx.textBaseline = 'top';
                ctx.fillStyle = ctx.strokeStyle;

                let x = (($textOutline.offsetLeft - canvasLeft)) + INPUT_OFFSET_X_PAINTED;
                let y = ($textOutline.offsetTop) + INPUT_OFFSET_Y_PAINTED;

                // note: in firefox there was always a \n at the end
                const lines = text.split("\n");
                let lineCount = 0;

                let largestWidth = 0;
                lines.forEach(line => {
                    //if (line) {
                        lineCount++;
                    //}
                    const width = ctx.measureText(line).width;
                    if (width > largestWidth) {
                        largestWidth = width;
                    }
                });

                const lineHeight = parseInt($text.style["line-height"].replace("px", ""));

                const previousStrokeFill = ctx.strokeFill;
                ctx.strokeFill = 2;
                ctx.fillStyle = await getFontBackground();
                drawRounded(
                    x - 1,
                    y + INPUT_BG_OFFSET_Y,
                    x + largestWidth + 4,
                    y + (lineHeight * lineCount) + INPUT_BG_OFFSET_HEIGHT,
                    false,
                    ctx
                );
                ctx.strokeFill = previousStrokeFill;

                let offsetY = y;
                lines.forEach(line => {
                    writeText(line, ctx, x, offsetY, "transparent", largestWidth);
                    offsetY += lineHeight;
                });

                byId("workspace").className = "text";
                undoSave();
            } else {
                if (clickedTool == "numbers") {
                    undoSave();
                }
            }
            hide($textOutline);

            if (clickedTool == "numbers") {
                byId("numbers").click();
            }
        }
    });

    canvas.addEventListener("mousedown", event => {
        // patch: when using Mac right click to save image it would paste as blank in Gmail - so execute the done action to save the canvas to image and voila it works 
        if (event.button == 2) {
            byId("done").click();
        } else {
            byId("refresh").classList.remove("hidden");
        }
    });
    
    onClick("#done", async function() {
        if (isVisible("#text")) {
            byId("text").dispatchEvent(new Event("blur"));
        }

        if (await isEligibleForReducedDonation()) {
            document.body.classList.add("toolbarOptionsVisible");
            fadeIn("#reducedDonation");
        } else {
            selector("app-toolbar").classList.add("removeTransition");
            document.body.classList.remove("toolbarOptionsVisible");
            if (!await storage.get("removeSocialMedia")) {
                show("#socialMedia");
            }
        }
        
        hide("#toolsButtons");
        hide(".subOptions");
        show("#imageOptions");
        
        byId("workspace").classList.add("done");
        
        if (await daysElapsedSinceFirstInstalled() < 3) {
            selectorAll("#canvas, #finalImage").forEach(el => el.title = getMessage("rightClickImage"));
        }
        
        // commented: not sure if used when migrating to v3
        //sendMessageToBG("clearCommand");

        if (!await storage.get("removeHeaderFooter")) {
            watermarkImage();
            fadeIn("#removeWatermark");
        }

        // because the right click on a canvas only saves as .png, we must transfer to finalimage (img) node if user selected jpeg image format
        // commented because it seems Search Google for Image on right click was not showing up for png unless i saved it (like i was doing only fo jpg before) 
        //if (await storage.get("imageFormat") == "image/jpeg") {
            const finalImage = byId("finalImage");
            finalImage.style.width = canvas.style.width;
            finalImage.style.height = canvas.style.height;
            finalImage.src = canvas.toDataURL(await storage.get("imageFormat"));
            show(finalImage);

            hide(canvas);
        //}
    
    });
    
    onClick("#back", function() {
        document.body.classList.remove("toolbarOptionsVisible");
        hide("#reducedDonation");
        hide("#socialMedia");
        show("#toolsButtons");
        hide("#imageOptions");
        byId("workspace").classList.remove("done");
        hide("#removeWatermark");
        hide("#finalImage");
        show("#canvas");
        
        selectorAll("#canvas, #finalImage").forEach(el => el.removeAttribute("title"));
    });

    if (await storage.get("grabMethod") == "recordScreen") {
        addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }
    
    onClick("#imageOptions > paper-button", function() {
        removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
        sendGA("afterEditingAction", this.id);
    });

    async function loadFonts() {
        polymerPromise2.then(async () => {
            const paperElement = selector("#font-family paper-listbox");

            if ('queryLocalFonts' in window) {
                try {
                    const pickedFonts = await window.queryLocalFonts();
                    console.log("pickedFonts", pickedFonts);

                    console.time("loadFonts");
                    if (pickedFonts.length) {
                        emptyNode(paperElement);

                        for (const fontData of pickedFonts) {
                            if (fontData.style == "Regular") {
                                const item = document.createElement("paper-item");
                                item.setAttribute("value", fontData.family.toLowerCase());
                                item.style.fontFamily = fontData.family;
                                item.textContent = fontData.fullName;
                
                                console.log(fontData);
                
                                paperElement.append(item);
                            }
                            //console.log(fontData.postscriptName);
                            //console.log(fontData.fullName);
                            //console.log(fontData.family);
                            //console.log(fontData.style);
                        }
                    }
                    console.timeEnd("loadFonts")
                } catch (error) {
                    console.error(error);
                }
            }

            paperElement.selected = await storage.get("fontFamily");
        });
    }

    loadFonts();

    onClick("#font-family", async function(e) {
        const value = e.target.getAttribute("value");

        if (e.target.id == "more-fonts") {
            if ('queryLocalFonts' in window) {
                // do nothing
            } else {
                niceAlert("More fonts are not supported on this browser.");
                return;
            }

            if (await donationClicked("fonts")) {
                // Ask for permission to use the API
                try {
                    const status = await navigator.permissions.request({
                        name: 'local-fonts',
                    });

                    console.log("status", status);
                    
                    if (status.state !== 'granted') {
                        throw new Error('No Permission.');
                    }
                } catch (err) {
                    console.error(err);
                    if (err.name !== 'TypeError') {
                        throw err;
                    }
                }

                loadFonts();
            }
        } else if (value) {
            if (await donationClicked("fonts")) {
                await storage.set("fontFamily", value);
                initFonts();
            }
        }
    });

    onClick("#download", async function() {
        if (await storage.get("grabMethod") == "recordScreen") {
            downloadVideoFile();
        } else {
            const blob = await canvasToBlob(canvas);
            const url = URL.createObjectURL(blob);
            
            await downloadFile(await getFilename(), url, blob.type);
        }
    });
    
    onClick("#open", async function() {
        if (await storage.get("grabMethod") == "recordScreen") {
            location.href = byId("video").src;
        } else {
            saveToLocalFile(await getFilename()).then(fileUrl => {
                // can't open filesystem urls directly so had to inform user to open with right click instructions
                const $template = initTemplate("openImageDialogTemplate");
                onClick($template.querySelector(".okDialog"), function() {
                    $template.close();
                });
                $template.addEventListener("iron-overlay-opened", () => {
                    byId("openImageIframe").src = fileUrl;
                });
                openDialog($template);
            });
        }
    });

    onClick("#pdf", () => {
        const content = document.createElement("ol");

        let $li1 = document.createElement("li");

        const $openIcon = document.createElement("iron-icon");
        $openIcon.setAttribute("icon", "open-in-new");

        const $openBold = document.createElement("b");
        $openBold.textContent = "OPEN";

        $li1.append("Click the ", $openIcon, " ", $openBold, " button");


        const $li2 = document.createElement("li");
        const $li2Bold = document.createElement("b");
        $li2Bold.textContent = "Chrome menu";

        const $li2Icon = document.createElement("iron-icon");
        $li2Icon.setAttribute("icon", "menu");

        $li2.append("Click the ", $li2Bold, " ", $li2Icon);


        const $li3 = document.createElement("li");
        
        const $li3bold = document.createElement("b");
        $li3bold.textContent = "Print...";

        $li3.append("Click ", $li3bold);

        
        const $li4 = document.createElement("li");

        const $li4bold2 = document.createElement("b");
        $li4bold2.textContent = "Save as PDF";

        $li4.append("Set Destination to ", $li4bold2);


        const $li5 = document.createElement("li");
        const $li5bold = document.createElement("b");
        $li5bold.textContent = getMessage("save");

        $li5.append("Click ", $li5bold);

        content.append($li1, $li2, $li3, $li4, $li5);

        openGenericDialog({
            content: content
        });
    });

    onClick("#searchImage", () => {
        const content = new DocumentFragment();
        const $bold = document.createElement("b");
        $bold.textContent = "Search Google for image";

        content.append(getMessage("copyToClipboardDesc"), " ", $bold);

        openGenericDialog({
            content: content
        });
    });

    onClick("#upload", async () => {
        const key = "displayUploadToImgurWarning";
        const value = true;
        
        if (!await storage.get(key)) {
            const response = await openDialog("shareImageDialogTemplate");
            if (response == "ok") {
                await storage.set(key, value);
            } else {
                return;
            }
        }

        showLoading();
        try {
            const response = await uploadImage();
            if (await storage.get("afterGrabAction") == "upload") {
                byId("hiddenLink").setAttribute("value", response.imageUrl);
                byId("hiddenLink").select();
                document.execCommand('Copy');
                showMessage(getMessage("linkCopied"));
            } else {
                const $template = initTemplate("shareLinkDialogTemplate");
                $template.querySelector(".otherDialog").addEventListener("click", function() {
                    showMessage("Go into the Options > View Uploaded Files");
                });
                $template.querySelector(".okDialog").addEventListener("click", function() {
                    $template.querySelector("#shareLink").inputElement.inputElement.select();
                    document.execCommand('Copy');
                    showMessage(getMessage("linkCopied"));
                    $template.close();
                });
                $template.addEventListener("iron-overlay-opened", () => {
                    $template.querySelector("#shareLink").setAttribute("value", response.imageUrl);
                    $template.querySelector("#shareLink").inputElement.inputElement.select();
                });
                openDialog($template);
            }
        } catch (error) {
            // nothing
            console.error(error);
        } finally {
            hideLoading();
        }
    });
    
    onClick("#saveToDrive", async () => {
        var targetExtensionId;
        if (chrome.runtime.id == ExtensionId.LocalScreenshot) {
            targetExtensionId = ExtensionId.LocalDrive;
        } else {
            targetExtensionId = ExtensionId.Drive;
        }
        
        showLoading();

        const sendMessageParams = {
            action: "upload",
            name: await getFilename()
        }

        let data;
        if (await storage.get("grabMethod") == "recordScreen") {
            //data = await sendMessageToBG("getVideoData");

            const blob = await fetch(byId("video").src).then(r => r.blob());
            data = await blobToBase64(blob);
            data = data.split(",")[1];

            sendMessageParams.type = VIDEO_CONTENT_TYPE;
        } else {
            data = canvas.toDataURL(await storage.get("imageFormat")).split(",")[1];
            sendMessageParams.type = await storage.get("imageFormat");
        }

        sendMessageParams.data = data;

        const start = new Date();

        chrome.runtime.sendMessage(targetExtensionId, sendMessageParams, async driveResponse => {
            hideLoading();

            if (chrome.runtime.lastError) { // might not be installed
                openGenericDialog({
                    title: "Extension required",
                    content: "This function requires my other extension Checker Plus for Google Drive",
                    okLabel: "Get extension",
                    showCancel: true
                }).then((response) => {
                    if (response == "ok") {
                        window.open("https://jasonsavard.com/Checker-Plus-for-Google-Drive?ref=screenshotExtension");
                    }
                });
            } else {
                if (driveResponse.error) {
                    console.error("error", driveResponse.error);

                    const content = new DocumentFragment();

                    const $img = document.createElement("img");
                    $img.setAttribute("style", "height: 22px;vertical-align: middle;");
                    $img.src = "https://jasonsavard.com/images/checkerPlusForGoogleDrive.png";

                    content.append("Problem uploading to Google Drive: " + driveResponse.error);
                    content.append(createBR(), createBR());
                    content.append("Open the Drive extension ", $img, " and grant access, then try uploading again.");

                    niceAlert(content);
                } else {

                    const driveUrl = `https://drive.google.com/drive/blank?action=locate&id=${driveResponse.data.id}`;

                    if (await storage.get("afterGrabAction") == "saveToGoogleDrive") {
                        location.href = driveUrl;
                    } else {
                        const $template = initTemplate("driveDialogTemplate");
                        $template.querySelector("#driveTitle").setAttribute("value", driveResponse.data.title);
                        $template.querySelector("#driveLink").setAttribute("value", driveResponse.data.alternateLink);
                        //$template.find("#driveLink")[0].inputElement.inputElement.select();

                        onClickReplace($template.querySelectorAll("#driveLink, .copyLink"), function () {
                            $template.querySelector("#driveLink").inputElement.inputElement.select();
                            document.execCommand('Copy');
                            showMessage(getMessage("linkCopied"));
                        });

                        onClickReplace($template.querySelector(".shareableLink"), async function () {
                            showLoading();

                            const enableShareableLinkResponse = await chrome.runtime.sendMessage(targetExtensionId, {
                                action: "enableShareableLink",
                                fileId: driveResponse.data.id
                            });
                            console.log("response", enableShareableLinkResponse);
                            hideLoading();

                            if (enableShareableLinkResponse.error) {
                                niceAlert("There was a problem: " + enableShareableLinkResponse.error);
                            } else {
                                $template.querySelector(".copyLink").click();
                            }
                        });

                        $template.addEventListener("iron-overlay-opened", () => {
                            $template.querySelector("#driveLink").inputElement.inputElement.select();
                        });

                        openDialog($template).then(response => {
                            if (response == "ok") {
                                //location.href = driveResponse.data.alternateLink;

                                // https://drive.google.com/folderview?id=0B42c3pO5_y67X0Fhcmg5XzhoR0U&usp=sharing
                                // https://drive.google.com/drive/u/0/blank?action=locate&id=0B3UllN_9zvOYWDg3Tjc4aGNaMHc&parent=0AHUllN_9zvOYUk9PVA
                                location.href = driveUrl;
                            }
                        });
                    }

                    if (Math.abs(start.diffInMillis()) > seconds(30)) {
                        showMessageNotification("File saved to drive", "");
                    }
                }
            }
        });
    });

    onClick("#uploadToYouTube", function () {
        openUrl("https://www.youtube.com/upload");
        downloadVideoFile();

        setTimeout(() => {
            const options = {
                type: "basic",
                title: "Drag the downloaded file onto the YouTube page.",
                iconUrl: NOTIFICATION_ICON_URL,
                message: ""
            }
            chrome.notifications.create("uploadToYouTube", options, function (notificationId) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    setTimeout(() => {
                        chrome.notifications.clear(notificationId);
                    }, seconds(5));
                }
            });
        }, seconds(3));
    });

    onClick("#editInPixlr", async function(event) {
        if (!await storage.get("pixlrWarningDisplayed")) {
            if (confirm("This will upload your image to Imgur.com to enable editing in Pixlr. Do you wish to continue?")) {
                await storage.enable("pixlrWarningDisplayed");
            } else {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
        
        showLoading();
        uploadImage().then(response => {
            location.href = "https://pixlr.com/x/?image=" + response.imageUrl + "&title=Captured by 'Explain and Send Screenshots'";
            hideLoading();
        }).catch(error => {
            hideLoading();
        });
    });
    
    onClick("#contribute", function() {
        chrome.tabs.create({url: 'contribute.html?fromEditor'});
    });
    
    function sendMultipart(url, fileParams, dataParams, callback) {
        var BOUNDARY = "---------------------------1966284435497298061834782736";
        var rn = "\r\n";
        var data = new Blob()
        var append = function(dataParam) {
            data.append(dataParam)
        }
        /*
        var data = "", append = function(dataParam){
            data += dataParam;
        }
        */
        append("--" + BOUNDARY);
        for (var i in dataParams) {
            append(rn + "Content-Disposition: form-data; name=\"" + i + "\"");
            append(rn + rn + dataParams[i] + rn + "--" + BOUNDARY);
        }
        append(rn + "Content-Disposition: form-data; name=\"" + fileParams.name + "\"");
        append("; filename=\"" + fileParams.filename + "\"" + rn + "Content-type: " + fileParams.contentType);
        append(rn + rn);
        var bin = atob(canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")); //file.data
        var arr = new Uint8Array(bin.length);
        for(var i = 0, l = bin.length; i < l; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        append(arr.buffer)
        //append(bin)

        append(rn + "--" + BOUNDARY);
        append("--");
            
        $.ajax({
            url: url,
            type: "POST",
            contentType: "multipart/form-data",
            timeout: 45000,
            processData: false, // Useful for not getting error when using blob in data
            data: data.getBlob(), // refer to processData flag just above
            beforeSend: function(request) {
                request.setRequestHeader("Content-type", "multipart/form-data; boundary=" + BOUNDARY);
            },
            complete: function(request, textStatus) {
                callback({request:request, textStatus:textStatus});
            }
        });
    };
    
    if (await storage.get("donationClicked")) {
        selectorAll("[mustDonate]").forEach(el => el.removeAttribute("mustDonate"));
    }
    
    async function showBrowserSaveImageAsDialog() {
        var videoSrc = byId("video").src;
        if (videoSrc) {
            url = videoSrc;
        } else {
            url = canvas.toDataURL(await storage.get("imageFormat"));
        }
        chrome.downloads.download({
            url: url,
            filename: await getFilename(),
            saveAs: true
        }, function (downloadId) {
            // nothing
        });
    }
    
    onClick("#saveAs", async function() {
        const result = await chrome.permissions.contains({ permissions: ['downloads'] });
        if (result) {
            setTimeout(() => {
                showBrowserSaveImageAsDialog();
            }, 1);
        } else {
            const $template = initTemplate("saveImageAsDialogTemplate");

            onClick($template.querySelector(".otherDialog"), async function () {
                const granted = await chrome.permissions.request({ permissions: ['downloads'] });
                if (granted) {
                    showBrowserSaveImageAsDialog();
                    $template.close();
                }
            });

            openDialog($template);
        }
    });

    onClick("#copyToClipboard", async function() {
        try {
            await copyToClipboard();
            const $body = document.body;
            // transitionend must be on specific node with transition
            byId("workspace").addEventListener("transitionend", () => {
                $body.classList.toggle("copyToClipboard");
            }, {once: true});
            $body.classList.toggle("copyToClipboard");
        } catch (error) {
            console.error(error);
            niceAlert(getMessage("rightClickImage"));
        }
    });
    
    onClick("#share", async function() {
        const $template = initTemplate("copyToClipboardDialogTemplate");
        if (DetectClient.isMac()) {
            $template.querySelector("#copyMac").removeAttribute("hidden");
            $template.querySelector("#pasteMac").removeAttribute("hidden");
        } else {
            $template.querySelector("#copyPC").removeAttribute("hidden");
            $template.querySelector("#pastePC").removeAttribute("hidden");
        }
        openDialog($template).then(response => {
            if (response == "cancel") {
                const content = document.createElement("span");
                content.innerHTML = getMessage("useUploadButton", getMessage("upload"));

                openGenericDialog({
                    content: content
                });					
            }
        });
        
        let shareClicks = await storage.get("_shareClicks");
        if (!shareClicks) {
            shareClicks = 1;
        } else {
            shareClicks++;
        }
        await storage.set("_shareClicks", shareClicks);
    });

    onClick("#options", function() {
        location.href = "options.html";
    });

    onClick("#help", function() {
        chrome.tabs.create({url: "https://jasonsavard.com/wiki/Explain_and_Send_Screenshots"});
    });

    onClick("#removeWatermark", async function() {
        if (await donationClicked("removeWatermark")) {
            await storage.set("removeHeaderFooter", true);
            location.reload();
        }
    });
    
    async function initButton(name) {
        if (!await storage.get(name + "Button")) {
            hide("#" + name);
        }
    }
    
    initButton("download");
    initButton("saveAs");
    initButton("upload");
    initButton("saveToDrive");
    initButton("copyToClipboard");
    initButton("editInPixlr");
    initButton("share");
    initButton("open");
    initButton("pdf");
    initButton("searchImage");
    
    document.body.addEventListener("keydown", function(e) {
        const u = undos.at(undosIndex);
        const MOVE_STEP = 2;

        if (isCtrlPressed(e) && e.key == "c") {
            if (clickedTool != "select" && !isFocusOnInputElement()) {
                byId("copyToClipboard").click();
            }
        } else if (e.key == "a" && !isFocusOnInputElement()) {
            byId("arrow").click();
        } else if (e.key == "t" && !isFocusOnInputElement()) {
            byId("writeText").click();
        } else if (e.key == "Escape") {
            if (isVisible("#back")) {
                byId("back").click();
            } else if (clickedTool == "writeText" || clickedTool == "numbers") {
                emptyNode("#text");
                byId("text").dispatchEvent(new Event("blur"));
            }
        } else if (e.key == "Delete") { //delete
            if(ctx.tool.name == 'select' && ctx.tool.status > 0) { //del selection
                ctx.tool.del();
            }
        } else if (e.ctrlKey || e.metaKey) {
            if (e.key == "c") {
                copy();
            } else if (e.key == "v") {
                paste();
            } else if (e.key == "x") {
                cut();
            } else if (e.key == "z") {
                undo();
            } else if (e.key == "y") {
                redo();
            }
        } else if (e.key == "ArrowDown" && !isFocusOnInputElement()) {
            u.y += MOVE_STEP;
            u.y2 += MOVE_STEP;
            moveDrawing(u);
        } else if (e.key == "ArrowUp" && !isFocusOnInputElement()) {
            u.y -= MOVE_STEP;
            u.y2 -= MOVE_STEP;
            moveDrawing(u);
        } else if (e.key == "ArrowLeft" && !isFocusOnInputElement()) {
            u.x -= MOVE_STEP;
            u.x2 -= MOVE_STEP;
            moveDrawing(u);
        } else if (e.key == "ArrowRight" && !isFocusOnInputElement()) {
            u.x += MOVE_STEP;
            u.x2 += MOVE_STEP;
            moveDrawing(u);
        } else if (e.key == "?" && !isFocusOnInputElement()) {
            const node = document.createElement("div");

            const div1 = document.createElement("div");
            div1.style.cssText = "display:inline-block;text-align:right;margin-right: 15px";

            const div2 = document.createElement("div");
            div2.style.cssText = "display:inline-block";

            function shortcutLine(key, value) {
                div1.append(key);
                div1.append(document.createElement("br"));
                div2.append(value);
                div2.append(document.createElement("br"));
            }

            shortcutLine("a", getMessage("drawArrow"));
            shortcutLine("t", getMessage("writeText"));

            div1.append("Arrow keys ↑↓⇄");
            div1.append(document.createElement("br"));
            div2.append("Move drawing");
            div2.append(document.createElement("br"));

            div1.append("Ctrl+Z");
            div1.append(document.createElement("br"));
            div2.append(getMessage("undo"));
            div2.append(document.createElement("br"));

            div1.append("Ctrl+Y");
            div1.append(document.createElement("br"));
            div2.append(getMessage("redo"));
            div2.append(document.createElement("br"));

            div1.append(getMessage("delete"));
            div1.append(document.createElement("br"));
            div2.append(getMessage("deleteSelection"));
            div2.append(document.createElement("br"));

            div1.append("Ctrl+C");
            div1.append(document.createElement("br"));
            div2.append(getMessage("copyToClipboard"));
            div2.append(document.createElement("br"));

            div1.append("Ctrl+V");
            div1.append(document.createElement("br"));
            div2.append(getMessage("paste"));
            div2.append(document.createElement("br"));

            div1.append("?");
            div1.append(document.createElement("br"));
            div2.append("Shortcut keys");
            div2.append(document.createElement("br"));

            node.append(div1, div2);

            niceAlert(node);
        }
    });

    polymerPromise2.then(() => {
        initOptions();

        chrome.tabs.getZoom(null, zoomFactor => {
            chrome.tabs.getZoomSettings(null, zoomSettings => {
                if (zoomFactor != 1 && zoomFactor != zoomSettings.defaultZoomFactor) {
                    niceAlert("The extension page zoomed! You must reset it and restart.").then(() => {
                        chrome.tabs.setZoom(null, 1, () => {
                            window.close();
                        });
                    });
                }
            });
        });
        
        setTimeout(async () => {
            const afterGrabAction = await storage.get("afterGrabAction");
            if (afterGrabAction == "upload") {
                byId("upload").click();
            } else if (afterGrabAction == "saveToGoogleDrive") {
                byId("saveToDrive").click();
            } else if (afterGrabAction == "copyToClipboard" && await storage.get("grabMethod") != "recordScreen") {
                await copyToClipboard();
                setTimeout(() => {
                    window.close();
                }, 1)
            }
        }, 1);
        
    });
})();

/*
function canvasToBlob(canvas, imageFormat = await storage.get("imageFormat")) {
    // dataURI can be too big, let's blob instead https://code.google.com/p/chromium/issues/detail?id=69227#c27
    var dataURI = canvas.toDataURL(imageFormat);

    // convert base64 to raw binary data held in a string doesn't handle URLEncoded DataURIs
    var byteString = atob(dataURI.split(',')[1]);
    
    var type = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // create a blob for writing to a file
    var blob = new Blob([ab], {type: type});
    return blob;
}
*/

async function canvasToBlob(canvas, imageFormat) {
    imageFormat ||= await storage.get("imageFormat")
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => {
                resolve(blob);
            },
            imageFormat
        );
    });
}

async function downloadFile(filename, url, type) {
    filename ||= `file${getImageFormatExtension(await storage.get("imageFormat"))}`;

    const a = document.createElement('a');
    a.download = filename;
    a.href = url
    a.dataset.downloadurl = [type, a.download, a.href].join(':');

    //const e = document.createEvent('MouseEvents');
    //e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.click();
}
	    
function saveToLocalFile(filename) {
	return new Promise(async function(resolve, reject) {
		const blob = await canvasToBlob(canvas);
		
	    // file-system size with a little buffer
	    var size = blob.size + (1024/2);
	
        filename = filename
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9.]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
	
	    // filesystem:chrome-extension://fpgjambkpmbhdocbdjocmmoggfpmgkdc/temporary/screencapture-test-png-1442851914126.png
	    function onwriteend() {
	    	resolve('filesystem:chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/temporary/' + filename);
	    }
	
	    function errorHandler() {
	        reject();
	    }
	
	    window.webkitRequestFileSystem(window.TEMPORARY, size, function(fs){
	        fs.root.getFile(filename, {create: true}, function(fileEntry) {
	            fileEntry.createWriter(function(fileWriter) {
	                fileWriter.onwriteend = onwriteend;
	                fileWriter.write(blob);
	            }, errorHandler);
	        }, errorHandler);
	    }, errorHandler);
	});
}