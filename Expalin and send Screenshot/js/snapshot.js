"use strict";

var screenShotTab;
var screenShotData;
var startX, startY;

var canvas;

const dashed = new Image();
dashed.src = 'images/dashed.gif';

function constrain(n, min, max) {
	if(n > max) return max;
	if(n < min) return min;
	return n;
}

function setShade(startX, endX, startY, endY) {
    css("#left-shade", {
        width: `${Math.min(startX, endX)}px`,
    });

    css("#top-shade", {
        left: `${Math.min(startX, endX)}px`,
        width: `${Math.abs(endX - startX)}px`,
        height: `${Math.min(startY, endY)}px`,
    });

    css("#right-shade", {
        left: `${Math.max(startX, endX)}px`,
        width: `${window.innerWidth - Math.max(startX, endX)}px`,
    });

    css("#bottom-shade", {
        left: `${Math.min(startX, endX)}px`,
        top: `${Math.max(startY, endY)}px`,
        width: `${Math.abs(endX - startX)}px`,
        height: `${window.innerHeight - Math.max(startY, endY)}px`,
    });
}

function init() {
    const $image = byId("image");

    $image.src = screenShotData;

    $image.addEventListener("load", function() {

        setShade(0, 0, 0, 0);

		setTimeout(async function() {
			show("#imageWrapper");

			if (await getGrabMethod() == "openFromClipboardAndCrop") {
				byId("imageWrapper").classList.add("patchForOpenFromClipboardAndCrop");
			}
			
            // set canvas.STYLE.width for hidpi blurry issues, refer to http://www.html5rocks.com/en/tutorials/canvas/hidpi/
            // note this technique must also be used in the editor.html
            canvas = byId("canvas");
            canvas.width = image.width * devicePixelRatio;
            canvas.height = image.height * devicePixelRatio;
    
            context = canvas.getContext('2d');
        
            context.scale(devicePixelRatio, devicePixelRatio);

            // Crop and resize the image: sx, sy, sw, sh, dx, dy, dw, dh.
            //context.drawImage(image, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h); // this worked for grab and crop
            //context.drawImage(image, c.x * devicePixelRatio, c.y * devicePixelRatio, c.w * devicePixelRatio, c.h * devicePixelRatio, 0, 0, c.w, c.h);
        
            ["mousedown", "touchstart"].forEach(type => {
                window.addEventListener(type, event => {
                    console.log("event", type, event);

                    hide("#clickAndDrag");

                    const obj = event.type === 'touchstart' ? event.touches[0] : event;

                    startX = obj.clientX;
                    startY = obj.clientY;

                    context.lineWidth = 1;
                    context.strokeStyle = context.createPattern(dashed, 'repeat');
                    context.beginPath();

                    event.preventDefault();
                    event.stopPropagation();
                })
            });

            ["mousemove", "touchmove"].forEach(type => {
                window.addEventListener(type, event => {
                    console.log("event", type, event);

                    const obj = event.type === 'touchmove' ? event.changedTouches[0] : event;

                    css("#clickAndDrag", {
                        top: (obj.pageY - 50) + "px",
                        left: (obj.pageX + 15) + "px"
                    });

                    if (startX != null) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.strokeStyle = context.createPattern(dashed, 'repeat');

                        const endX = constrain(obj.clientX, 0, canvas.width);
                        const endY = constrain(obj.clientY, 0, canvas.height);

                        drawRectangle(startX, startY, endX, endY, null, context);

                        setShade(startX, endX, startY, endY);
                    }

                    event.preventDefault();
                    event.stopPropagation();
                })
            });

            ["mouseup", "touchend"].forEach(type => {
                window.addEventListener(type, event => {
                    hide(".shade");

                    console.log("event", type, event);
                    canvas.hidden = true;

                    const obj = event.type === 'touchend' ? event.changedTouches[0] : event;

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    const w = Math.abs(obj.clientX - startX);
                    const h = Math.abs(obj.clientY - startY);
                    
                    canvas.width = w * devicePixelRatio;
                    canvas.height = h * devicePixelRatio;

                    context.drawImage(image, Math.min(startX, obj.clientX) * devicePixelRatio, Math.min(startY, obj.clientY) * devicePixelRatio, w * devicePixelRatio, h * devicePixelRatio, 0, 0, w * devicePixelRatio, h * devicePixelRatio);

                    console.log("event", obj);

                    (async () => {
                        try {
                            await setScreenshotVars({
                                screenShotTab: screenShotTab,
                                screenShotData: await getDataUrl(canvas)
                            });

                            location.href = "editor.html";
                        } catch (error) {
                            alert(error);
                        }
                    })();

                    event.preventDefault();
                    event.stopPropagation();
                })
            });

			//show("#clickAndDrag");
			
		}, 1);
	});
}

(async () => {
    initUI();

    const obj = await getScreenshotVars();
    screenShotTab = obj.screenShotTab;
    screenShotData = obj.screenShotData;
    
    init();
})();