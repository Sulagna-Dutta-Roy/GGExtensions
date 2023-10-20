"use strict";

// CanvasPaint r1
// by Christopher Clay <canvas@c3o.org>
//
// The code in this file is dedicated to the Public Domain
// http://creativecommons.org/licenses/publicdomain/
//

var canvas, ctx, canvastemp, ctxTemp, canvassel, csel, wsp, co, check, m;
var prefs = { pretty:false, controlpoints:false }
var dashed = new Image();
dashed.src = 'images/dashed.gif';
var FILL_STYLE = 'white';
var drawingColor; // must be HEX for color-picker to work! NOT rgba(...)
var undos = [];
var undosIndex = 0;

var INPUT_OFFSET_X;
var INPUT_OFFSET_Y;
var INPUT_OFFSET_X_PAINTED;
var INPUT_OFFSET_Y_PAINTED;
var INPUT_BG_OFFSET_Y;
var INPUT_BG_OFFSET_HEIGHT;

function setDrawingColor(ctx, color) {
	drawingColor = ctx.strokeStyle = ctx.fillStyle = color;
}

function initPaint() {
	//set up defaults
	ctx.tool = new tool.arrow(); 
	ctx.fillStyle = FILL_STYLE;
	
	setDrawingColor(ctx, drawingColor);
	ctx.strokeFill = 1; //outline shapes

	//set up events
	window.onmouseup = bodyUp;
	window.onmousemove = bodyMove;
	canvas.onmousedown = canvastemp.onmousedown = c_down;
	canvas.onmousemove = canvastemp.onmousemove = c_move;
	canvas.onmouseout = canvastemp.onmouseout = c_out;
	canvas.onmouseup = canvastemp.onmouseup = c_up;
	
    addEventListeners([canvas, canvastemp], "touchstart", event => {
        c_down(event);
        event.preventDefault();
        event.stopPropagation();
    });

    addEventListeners([canvas, canvastemp], "touchmove", event => {
        c_move(event);
        event.preventDefault();
        event.stopPropagation();
    });

    addEventListeners([canvas, canvastemp], "touchend", event => {
        c_up(event);
        event.preventDefault();
        event.stopPropagation();
    });
}

function moveDrawing(u) {
    if (undosIndex >= 1 && u.action) {
        undo();

        if (u.action == "drawArrow") { 
            drawArrow(u.x, u.y, u.x2, u.y2, u.shiftKey, u.ctx);
        } else if (u.action == "drawLine") {
            drawLine(u.x, u.y, u.x2, u.y2, u.shiftKey, u.ctx);
        } else if (u.action == "drawEllipse") {
            drawEllipse(u.x, u.y, u.x2, u.y2, u.shiftKey, u.ctx);
        } else if (u.action == "drawRectangle") {
            drawRectangle(u.x, u.y, u.x2, u.y2, u.shiftKey, u.ctx);
        } else {
            alert("No match: " + u.action)
        }
        
        undoSave({
            action: u.action,
            x: u.x,
            y: u.y,
            x2: u.x2,
            y2: u.y2,
            shiftKey: u.shiftKey,
            ctx: u.ctx
        });
    }
}

function sel_cancel() {
	if (ctx.tool.status == 2) {
		if (ctxTemp && ctxTemp.start) {
			ctx.drawImage(canvassel, Math.floor(ctxTemp.start.x), Math.floor(ctxTemp.start.y));
		}
	}
	if (ctx.tool.status != 4) {
		canvastemp.style.display='none';
	}
}

function copy() {
  if(ctx.tool.name == 'select' && ctx.tool.status > 0) {  //copy selection
		ctx.tool.copy();
	}
}

function cut() {
	if(ctx.tool.name == 'select' && ctx.tool.status > 0) {  //cut selection
		ctx.tool.copy();
		ctx.tool.del();
	}
}

function paste() {
	if (ctx.tool.paste) {
		ctx.tool.paste();
	}
}

async function maybeAutoCopyAfterAnnotating() {
    if (await storage.get("autoCopyAfterAnnotating")) {
        await copyToClipboard();
    }
}

function undoSave(params = {}) {
	console.log("undosave");
	
	// remove all redos
	console.log("index: " + undosIndex + " " + undos.length);
	if (undosIndex < undos.length-1) {
		console.log("splice");
		undos.splice(undosIndex+1, 999);
	}

    params.canvas = cloneCanvas(canvas);
    undos.push(params);
	
	if (!params.firstTime) {
        undosIndex++;
        maybeAutoCopyAfterAnnotating();
	}
	
	byId("undo").disabled = false;
	byId("redo").disabled = true;
}

function undo() {
	if (undosIndex != 0) {
		// i haven't been able to restore canvas size on crop undo - so let's just restart 
        if (undosIndex == 1 && ctx.tool.name == "select" && clickedTool != "blur") {
			byId("refresh").click();
		} else {
			// patch seems we need to reset globalAlpha or else the undo didn't work
			ctx.globalAlpha = 1;
			
			undosIndex--;
			
			console.log("undo() " + undosIndex);
			
			if (ctx.tool.name == 'select') {	//reset all info about current selection
				activateTempCanvas(); 
				canvastemp.style.display='none';
                ctx.tool.status = 0;
			}

			ctx.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
			ctx.drawImage(undos[undosIndex].canvas, 0, 0);
			ctx.scale(devicePixelRatio, devicePixelRatio);
			
			if (undosIndex == 0) {
				byId("undo").disabled = true;
			}
			if (undosIndex < undos.length) {
				byId("redo").disabled = false;
			}
			byId("redo").style.visibility = "visible";

			if (numberCount >= 2) {
				numberCount--;
            }
            
            maybeAutoCopyAfterAnnotating();
		}
	}
}

function redo() {
    if (undosIndex < undos.length-1) {
        undosIndex++;
        console.log("redo: " + undosIndex);
        
        ctx.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
        ctx.drawImage(undos[undosIndex].canvas, 0, 0);
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        byId("undo").disabled = false;
        if (undosIndex >= undos.length-1) {
            byId("redo").disabled = true;
        }
    }
}

function getxy(e, o) {
	//gets mouse position relative to object o
	if (ctx) {
		var bo = getpos(o);
		var clientX = e.targetTouches && e.targetTouches.length ? e.targetTouches[0].clientX : e.clientX;
		var clientY = e.targetTouches && e.targetTouches.length ? e.targetTouches[0].clientY : e.clientY;
		var x = clientX - bo.x + wsp.scrollLeft;	//correct for canvas position, workspace scroll offset
		var y = clientY - bo.y + wsp.scrollTop;									
		x += document.documentElement.scrollLeft;	//correct for window scroll offset
		y += document.documentElement.scrollTop;									
		return { x: x-.5, y: y-.5 }; //-.5 prevents antialiasing of stroke lines
	}
}

function getpos(o) {
//gets position of object o
	var bo, x, y, b; x = y = 0;
	if(document.getBoxObjectFor) {	//moz
		bo = document.getBoxObjectFor(o);
		x = bo.x; y = bo.y;
	} else if (o.getBoundingClientRect) { //ie (??)
		bo = o.getBoundingClientRect();
		x = bo.left; y = bo.top;
	} else { //opera, safari etc
		while(o && o.nodeName != 'BODY') {
			x += o.offsetLeft;
			y += o.offsetTop;
			b = parseInt(document.defaultView.getComputedStyle(o,null).getPropertyValue('border-width'));
			if(b > 0) { x += b; y +=b; }
			o = o.offsetParent;
		}
	}
	return { x:x, y:y }
}

var tool = {

	_shapes: function() {

		this.down = this._down = function() {
			activateTempCanvas();
			this.start = { x:m.x, y:m.y } 
			this.status = 1;
			ctx.beginPath();
		}
		this._move = function() {
			ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
		}
		this._up = function() {
			canvastemp.style.display='none';
			this.status = 0;
		}

	},

	_brushes: function() {

		this.down = this._down = function() {
			this.last = null;
			this.cp = null;
			this.lastcp = null;
			this.disconnected = null;
			ctx.beginPath();

			this.sstart = this.last = { x:m.x, y:m.y } //extra s in sstart to not affect status bar display
			this.status = 1;
		}
		this.move = function(e) { 

			if(this.disconnected) {	//re-entering canvas: dont draw a line
				this.disconnected = null;
				this.last = { x:m.x, y:m.y }
			} else {				//draw connecting line
				this.draw();
			}
			ctx.moveTo(m.x, m.y);

		}
		this.up = function() {
			if(this.sstart && this.sstart.x == m.x && this.sstart.y == m.y) {
				drawDot(m.x, m.y, ctx.lineWidth, ctx.strokeStyle);
			}
			this.sstart = null;
			this.status = 0;
			
			undoSave();
		}
		this.draw = function() {
			if(prefs.pretty) { 
				//calculate control point
				this.cp = { x:m.x, y:m.y } //default: no bezier	
				var deltax = Math.abs(m.x-this.last.x);
				var deltay = Math.abs(m.y-this.last.y);
				if(this.last && (deltax+deltay > 10)) { //long line

					//had no control point last time: use last vertex
					var lx = (this.lastcp) ? this.lastcp.x : this.last.x;	//should be last2x?
					var ly = (this.lastcp) ? this.lastcp.y : this.last.y;
					var delta2x = this.last.x-lx;	var delta2y = this.last.y-ly;
 					this.cp = { x:lx+delta2x*1.4, y:ly+delta2y*1.4 }

				}
				this.lastcp = { x:this.cp.x, y:this.cp.y }

				ctx.bezierCurveTo(this.cp.x, this.cp.y, m.x, m.y, m.x, m.y);  //make pretty curve, first two params =control pt
				ctx.stroke();	
				ctx.beginPath();
				if(prefs.controlpoints) { 
					if(!(this.cp.x==m.x && this.cp.y==m.y)) { drawDot(this.cp.x, this.cp.y, 3, 'blue'); }
					drawDot(this.last.x, this.last.y, 3, 'red');
				}

			} else { //unpretty

                // draws a straight line
                /*
                const x1 = this.last.x;
                const y1 = this.last.y;

                let x2 = m.x;
                let y2 = m.y;

                y2 = y1;

                m.x = x2;
                m.y = y2;
                */

                if (this.name == "highlight") {
                    ctx.globalCompositeOperation = "multiply";
                }

				ctx.lineTo(m.x, m.y);
				ctx.stroke();	
				ctx.beginPath();
				if(prefs.controlpoints) { 
					drawDot(m.x, m.y, 3, 'red');
				}

                if (this.name == "highlight") {
                    // reset to default
                    ctx.globalCompositeOperation = "source-over";
                }
			}
				
			this.last = { x:m.x, y:m.y }
		}

	},

	pencil: function() {
		this.name = 'pencil';
		this.status = 0;
		this.inherit = tool._brushes; this.inherit();
		ctx.lineCap = 'round';
		ctx.strokeStyle = ctx.fillStyle = drawingColor;
	},

	brush: function() {
		this.name = 'brush';
		this.status = 0;
		this.inherit = tool._brushes; this.inherit();
	},

	text: function() {
		this.name = 'text';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		ctx.strokeStyle = ctx.fillStyle = drawingColor;

		this.down = function(e) {
			console.log("down", e);
			
			this._down();
            console.log("isvisible: ", isVisible("#text"))
			if (isVisible("#text")) {
				byId("text").dispatchEvent(new Event("blur"));
			} else {
                const left = canvas.getBoundingClientRect().left + m.x + INPUT_OFFSET_X;
                const top = m.y + INPUT_OFFSET_Y;

                const defaultWidth = 180;
                const widthToEdge = canvas.width - m.x;
                const height = Math.min(25, canvas.height - m.y + 13);

                const textOutlineStyle = byId("text-outline").style;

                if (widthToEdge < defaultWidth) {
                    textOutlineStyle["min-width"] = `${widthToEdge}px`;
                    textOutlineStyle["width"] = `${widthToEdge}px`;
                } else {
                    textOutlineStyle["min-width"] = `${defaultWidth}px`;
                    textOutlineStyle["width"] = `auto`;
                }

                textOutlineStyle["left"] = left;
                textOutlineStyle["top"] = top;

                show("#text-outline");
                emptyNode(byId("text"));
                byId("text").focus();
			}
		}
		this.up = function(e) {
            this._up();
		}
	},

	numbers: function () {
		this.name = 'numbers';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		ctx.strokeStyle = ctx.fillStyle = drawingColor;

        byId("numbersCount").value = numberCount;

		this.down = function (e) {
			console.log("down", e);

            numberCount = byId("numbersCount").value;

			this._down();

			//c.beginPath();
			ctx.arc(m.x, m.y, 15, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "white";
			let numberWidth = ctx.measureText(numberCount).width;
			ctx.textBaseline = 'alphabetic';
			ctx.fillText(numberCount, m.x - (numberWidth * 0.5), m.y + (lineHeight * 0.3));
			ctx.strokeStyle = ctx.fillStyle = drawingColor;
			numberCount++;

            byId("numbersCount").value = numberCount;

			ctx.tool = new tool.text();
			m.x += 25;
			m.y -= (lineHeight * 0.1);
			ctx.tool.down();
			console.log("numbers.down");
		}
		this.up = function (e) {
			this._up();
			//undoSave();
		}
	},

	line: function() {

		this.name = 'line';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		ctx.lineCap = 'round';
        ctx.strokeStyle = ctx.fillStyle = drawingColor;
        
		this.move = function(e) {
			this._move();
			drawLine(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
		}
		this.up = function(e) {
			this._up();
			drawLine(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
            undoSave({
                action: "drawLine",
                x: this.start.x,
                y: this.start.y,
                x2: m.x,
                y2: m.y,
                shiftKey: e.shiftKey,
                ctx: ctx
            });
		}

	},

	highlight: function() {
		this.name = 'highlight';
		this.status = 0;
		this.inherit = tool._brushes; this.inherit();

		ctx.globalAlpha = 0.20;
		ctx.strokeStyle = "yellow";

		ctx.lineCap = 'square';
		ctx.lineWidth = 30;
		ctx.lastStrokeStyle = ctx.strokeStyle;
		ctx.shadowColor = null;
	},

	eraser: function() {
		this.name = 'eraser';
		this.status = 0;
		this.inherit = tool._brushes; this.inherit();
		
		ctx.lineWidth = 1;

		this.down = function(e) {
			this._down();
			this.move(e);
		}
		
		this.move = function(e) {
		    boxBlurCanvasRGBA("canvas", m.x-12, m.y-12, 24, 24, 2, 0);
		}

	},

	arrow: function() {

		this.name = 'arrow';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		ctx.lineCap = 'round';
		//c.lineWidth = 3;
        ctx.strokeStyle = ctx.fillStyle = drawingColor;

		this.move = function(e) {
			this._move();
			drawArrow(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
		}
		this.up = function(e) {
			this._up();
			if (this.start) {
				drawArrow(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
				undoSave({
                    action: "drawArrow",
                    x: this.start.x,
                    y: this.start.y,
                    x2: m.x,
                    y2: m.y,
                    shiftKey: e.shiftKey,
                    ctx: ctx
                });
                this.start = null;
			} else {
				showMessage("Start drawing inside frame.");
			}
		}

	},

	rectangle: function() {

		this.name = 'rectangle';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		//c.lineWidth = 3;
		ctx.strokeStyle = drawingColor;

		this.move = function(e) {
			this._move();
			drawRectangle(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
		}
		this.up = function(e) {
			this._up();
			drawRectangle(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
            undoSave({
                action: "drawRectangle",
                x: this.start.x,
                y: this.start.y,
                x2: m.x,
                y2: m.y,
                shiftKey: e.shiftKey,
                ctx: ctx
            });
		}

	},

	ellipse: function() {

		this.name = 'ellipse';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		//c.lineWidth = 3;
		ctx.strokeStyle = drawingColor;

		this.down = function(e) {
			this._down();
			this.lastLineWidth = ctx.lineWidth;
			if(ctx.strokeFill == 3) { ctx.lineWidth+=1.1; ctxTemp.lineWidth+=1.1; } //hm
		}
		this.move = function(e) {
			this._move();
			drawEllipse(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
		}
		this.up = function(e) {
			this._up();
			drawEllipse(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
			if (ctx.strokeFill == 3) {
				ctx.lineWidth = this.lastLineWidth;
				ctxTemp.lineWidth = this.lastLineWidth;
			}
            undoSave({
                action: "drawEllipse",
                x: this.start.x,
                y: this.start.y,
                x2: m.x,
                y2: m.y,
                shiftKey: e.shiftKey,
                ctx: ctx
            });
		}

	},

	spotlightCircle: function() {

		this.name = 'ellipse';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();

		//c.lineWidth = 3;
		ctx.strokeStyle = ctx.fillStyle = drawingColor;

		let firstTime = true;

		this.down = function(e) {
			this._down();
			this.lastLineWidth = ctx.lineWidth;
			if(ctx.strokeFill == 3) { ctx.lineWidth+=1.1; ctxTemp.lineWidth+=1.1; } //hm
		}
		this.up = function(e) {
			this._up();
			if (!firstTime) {
				undo();
			}
			firstTime = false;
			drawSpotlightCircle(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
			if (ctx.strokeFill == 3) {
				ctx.lineWidth = this.lastLineWidth;
				ctxTemp.lineWidth = this.lastLineWidth;
			}
			undoSave();
		}

	},

	rounded: function() {

		this.name = 'rounded';
		this.status = 0;
		this.inherit = tool._shapes; this.inherit();
		
		this.move = function(e) {
			this._move();
			drawRounded(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
		}
		this.up = function(e) {
			this._up();
			drawRounded(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctx);
		}

	},

	curve: function() {

		this.name = 'curve';
		this.status = 0;

		ctx.lineCap = 'round';
		ctx.lineWidth = 1;

		this.down = function() {
			if(this.status==0) { //starting
				activateTempCanvas();
				this.start = { x:m.x, y:m.y } 
				this.end = null;
				this.bezier1 = null;
				this.status = 5;
				ctx.beginPath();
			} else if(this.status==4 || this.status==2) { //continuing
				this.status--;
			}
		}
		this.move = function(e) { 
			if(this.status==5) {

				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				drawLine(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
				ctxTemp.stroke();

			} else if(this.status == 3 || this.status == 1) {

				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);

				ctxTemp.moveTo(this.start.x, this.start.y);
				var b1x = (this.bezier1) ? this.bezier1.x : m.x;
				var b1y = (this.bezier1) ? this.bezier1.y : m.y;
				var b2x = (this.bezier1) ? m.x : this.end.x;
				var b2y = (this.bezier1) ? m.y : this.end.y;

				ctxTemp.bezierCurveTo(b1x, b1y, b2x, b2y, this.end.x, this.end.y);
				ctxTemp.stroke();
			}
		}
		this.up = function() {
			if(this.status==5) { //setting endpoint     // && source.id != 'body'
				this.end = { x:m.x, y:m.y }
				this.status = 4;
			} else if(this.status==3) { //setting bezier1  && source.id != 'body'
				this.bezier1 = { x:m.x, y:m.y }
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				ctxTemp.moveTo(this.start.x, this.start.y);
				ctxTemp.bezierCurveTo(m.x, m.y, this.end.x, this.end.y, this.end.x, this.end.y);
				ctxTemp.stroke();
				this.status = 2;
			} else if(this.status==1) { //setting bezier2  && source.id != 'body'
				canvastemp.style.display='none';
				ctx.moveTo(this.start.x, this.start.y);
				ctx.bezierCurveTo(this.bezier1.x, this.bezier1.y,  m.x, m.y, this.end.x, this.end.y);
				ctx.stroke();
				this.status = 0;
			}
		}
	
	},

	polygon: function() {

		this.name = 'polygon';
		this.status = 0;
		this.points = new Array();

		this.down = function() {
			if(this.status==0) { //starting poly
				activateTempCanvas();
				this.start = { x:m.x, y:m.y } 
				this.last = null;
				this.status = 3;
				this.points = new Array();
				ctx.beginPath();
			} else if(this.status==1) { //adding points
				this.status = 2;
			}	
		}
		this.move = function(e) { 
			if(this.status == 3) { //first polyline
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				drawLine(this.start.x, this.start.y, m.x, m.y, e.shiftKey, ctxTemp);
			} else if(this.status == 2) { // next polyline
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				drawLine(this.last.x, this.last.y, m.x, m.y, e.shiftKey, ctxTemp);
			}
		}
		this.up = function(e) {
			if(Math.abs(m.x-this.start.x) < 4 && Math.abs(m.y-this.start.y) < 4) { //closing
				this.close();
			} else {
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				var fromx = (this.status==2) ? this.last.x : this.start.x;
				var fromy = (this.status==2) ? this.last.y : this.start.y;
				var end = drawLine(fromx, fromy, m.x, m.y, e.shiftKey, ctx); //TODO cant drawline on c yet...3rd canvas??
				this.last = { x:m.x, y:m.y };
				this.points[this.points.length] = { x:m.x, y:m.y };
				this.status = 1;
			}
			trg.stroke();

			undoSave();
		}
		this.close = function() {
			if(this.last.x) { // not just started			
				ctx.beginPath();
				ctx.moveTo(this.start.x, this.start.y);
				for(var i=0; i<this.points.length; i++) {
					ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				ctx.lineTo(this.last.x, this.last.y);
				ctx.lineTo(this.start.x, this.start.y);
				if(ctx.strokeFill == 2 || ctx.strokeFill == 3) { ctx.fill(); }
				if(ctx.strokeFill == 1 || ctx.strokeFill == 3) { ctx.stroke(); }

				ctx.fill();
			}
			canvastemp.style.display='none';
			this.status = 0;
		}

    },
    
    colorPicker: function() {
		this.name = 'colorPicker';

        if (window.EyeDropper) {
            const eyeDropper = new EyeDropper();
            eyeDropper.open().then(result => {
                console.log("eyedroppper", result);
                setColors(result.sRGBHex);
            }).catch(e => {
                console.error(e);
            });

            selectPreviousTool();
        } else {
            this.status = 0;
            this.inherit = tool._shapes; this.inherit();
    
            this.down = function(e) {
                //this._down();
                
                const imageData = ctx.getImageData(e.offsetX * devicePixelRatio, e.offsetY * devicePixelRatio, 1, 1).data;
                console.log("imagedata", imageData);
                //const color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
                // must be hex for color picker to work
                const color = RGBToHex(imageData[0], imageData[1], imageData[2]);
                console.log("color", color);
                setColors(color);
            }

            this.up = function(e) {
                this._up();
            }
        }
	},

	airbrush: function() {
	
		this.name = 'airbrush';
		this.status = 0;

		ctx.lineCap = 'square';

		this.down = function() {
			this.drawing = setInterval(ctx.tool.draw, 50);
			this.last = { x:m.x, y:m.y }
			this.lineCap = 'square';
			this.status = 1;
		}
		this.move = function(e) { 
			this.last = { x:m.x, y:m.y }
		}
		this.up = function(e) {
			clearInterval(this.drawing);
			this.status = 0;
			undoSave();
		}
		
		this.draw = function() {
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.last.x, this.last.y, ctx.lineWidth*4, 0, Math.PI*2, true);
			ctx.clip();
			for(var i=ctx.lineWidth*15; i>0; i--) {
				var rndx = ctx.tool.last.x + Math.round(Math.random()*(ctx.lineWidth*8)-(ctx.lineWidth*4));
				var rndy = ctx.tool.last.y + Math.round(Math.random()*(ctx.lineWidth*8)-(ctx.lineWidth*4));
				drawDot(rndx, rndy, 1, ctx.strokeStyle);
			}
			ctx.restore();
		}


	},

	floodfill: function() {
	  
		this.name = 'floodfill';
		this.status = 0;
		
		this.down = function(e) {
	        var x = Math.round(m.x);
	        var y = Math.round(m.y);
	
	        var oldColor = getPixel(x, y);
	        if(!oldColor) { alert('Sorry, your browser doesn\'t support flood fill.'); return false; } 
	        if(oldColor == ctx.strokeStyle) { return; }
	        
	        var stack = [{x:x, y:y}];
	                       
	        //var n = 0;
	        while(popped = stack.pop()) {
	            //n++;
	            var x = popped.x;   
	            var y1 = popped.y;
	            while(getPixel(x, y1) == oldColor && y1 >= 0) { y1--; }
	            y1++;
	            var spanLeft = false;
	            var spanRight = false;
	            while(getPixel(x, y1) == oldColor && y1 < canvas.height) {
	                if(window.opera) { 
	                  co.setPixel(x, y1, ctx.strokeStyle);
	                } else {
	                  //c.beginPath();
	                  ctx.fillStyle = ctx.strokeStyle;
	                  ctx.fillRect(x, y1, 1, 1);
	                  //drawDot(x, y1, 1, c.strokeStyle, c);
	                  //document.getElementById('info').innerHTML += '<br />'+x+'/'+y1;
	                }
	                if(!spanLeft && x > 0 && getPixel(x-1, y1) == oldColor) {
	                  //break;
	                   stack.push({x:x-1, y:y1});        
	                    spanLeft = true;
	                } else if(spanLeft && x > 0 && getPixel(x-1, y1) != oldColor) {
	                    spanRight = false;
	                } else if(spanRight && x <= 0) { spanRight = false; }
	                if(!spanRight && x < canvas.width-1 && getPixel(x+1, y1) == oldColor) {
	                  //break;
	                  stack.push({x:x+1, y:y1});
	                    spanRight = true;
	                } else if(spanRight && x < canvas.width-1 && getPixel(x+1, y1) != oldColor) {
	                    spanRight = false;
	                } else if(spanRight && x >= canvas.width) { spanRight = false; }
	                y1++;                   
	            }
	        }        
	        
	        
	        if(window.opera) {
	          co.lockCanvasUpdates(false);
	          co.updateCanvas();
	        }
	        //document.getElementById('info').innerHTML = check;
        
		}
		
    this.move = function() { }
		this.up = function() { }
	  
	},

	select: function() {

		this.name = 'select';
		this.status = 0;

		ctx.lastTool = ctx.tool.name;
		ctx.lineWidth = 1;
		ctx.lastStrokeStyle = ctx.strokeStyle;
		ctx.strokeStyle = ctx.createPattern(dashed, 'repeat');
		//c.strokeFill = 1;
		ctx.beginPath();

		this.down = function(e) { 
			console.log("selectdown", this.status);
			if (this.status==0) { //starting select
				ctx.strokeStyle = ctx.createPattern(dashed, 'repeat');
				activateTempCanvas();
				this.start = { x:m.x, y:m.y } 
				this.status = 4;
			} else if (this.status==2 || this.status==3) { //moving selection
				if (intersects(m, this.start, this.dimension)) {
					this.offset = { x:m.x-this.start.x, y:m.y-this.start.y } 
					if (this.status == 3 && !e.ctrlKey && !e.shiftKey) { //when first moving (and not in stamp mode), clear original pos and paint on tempcanvas
						var pos = { x:m.x-this.offset.x, y:m.y-this.offset.y }						
						drawRectangle(pos.x-1, pos.y-1, pos.x+this.dimension.x, pos.y+this.dimension.y, null, ctxTemp, "select");
						
						ctxTemp.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
						ctxTemp.drawImage(canvassel, Math.floor(pos.x) * devicePixelRatio, Math.floor(pos.y) * devicePixelRatio);
						//ctemp.scale(devicePixelRatio, devicePixelRatio);
						
						ctx.fillStyle = FILL_STYLE;
						ctx.fillRect(this.start.x-.5, this.start.y-.5, this.dimension.x, this.dimension.y);
					}
					this.status = 1;
				} else {  //starting new selection
					if (this.status < 3) { //actually draw last moved selection to canvas TODO also do this when switching tools
						console.log("last drawn")
						ctx.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
						ctx.drawImage(canvassel, Math.floor(this.start.x * devicePixelRatio), Math.floor(this.start.y * devicePixelRatio));
						ctx.scale(devicePixelRatio, devicePixelRatio);
						
						ctxTemp.scale(devicePixelRatio, devicePixelRatio);
					}
					activateTempCanvas();
					this.start = { x:m.x, y:m.y } 
					this.status = 4;
				}
			}
		}
		this.move = function(e) {
			console.log("selectmove", this.status);
			if (this.status==4) { //selecting
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				ctxTemp.strokeStyle = ctx.createPattern(dashed, 'repeat');
				var constrained = { x:constrain(m.x, 0, canvas.width), y:constrain(m.y, 0, canvas.height-5) }
				drawRectangle(this.start.x-1, this.start.y-1, constrained.x, constrained.y, null, ctxTemp, "select");

                if (clickedTool == "crop") {
                    byId("drag-dimensions").textContent = `${Math.abs(constrained.x - this.start.x-1)}px ${Math.abs(constrained.y - this.start.y-1)}px`;
                    css("#drag-dimensions", {
                        left: canvas.getBoundingClientRect().left + m.x + 20,
                        top: canvas.getBoundingClientRect().top + m.y + 20,
                    });
                    show("#drag-dimensions");
                 }
			} else if (this.status==1) { //moving selection
				ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
				var pos = { x:m.x-this.offset.x, y:m.y-this.offset.y }
				drawRectangle((pos.x* devicePixelRatio)-1 , (pos.y* devicePixelRatio)-1, (pos.x+this.dimension.x) * devicePixelRatio, (pos.y+this.dimension.y) * devicePixelRatio, null, ctxTemp, "select");
				
				//ctemp.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
				ctxTemp.drawImage(canvassel, Math.floor(pos.x) * devicePixelRatio, Math.floor(pos.y) * devicePixelRatio);
				//ctemp.scale(devicePixelRatio, devicePixelRatio);
				
				if (e.shiftKey) { //dupli mode
					ctx.drawImage(canvassel, Math.floor(pos.x), Math.floor(pos.y));
				}
			} else if (this.start) {
				if (ctx.tool.status == 1 || (ctx.tool.dimension && intersects(m, ctx.tool.start, ctx.tool.dimension))) {
					canvastemp.style.cursor = 'move';
				} else {
					canvastemp.style.cursor = '';		
				}
			}
		}
		this.up = function(e) {
            
            if (this.status == 2) {
                console.warn("force down: patch when user clicks out of bounds and selection disappears");
                this.down();
            }

			console.log("selectup", this.status);
            hide("#drag-dimensions");
			if (this.status == 4) { //finished selecting

				this.status = 3;
				this.dimension = { x:constrain(m.x, 0, canvas.width)-this.start.x,
								   y:constrain(m.y, 0, canvas.height)-this.start.y }
				if (this.dimension.x == 0 && this.dimension.y == 0) { //nothing selected, abort
					this.status = 0;
					canvastemp.style.display='none';
					csel.clearRect(0, 0, canvassel.width, canvassel.height);
				} else { //save on selection canvas
					csel.clearRect(0, 0, canvassel.width, canvassel.height);
					if (this.dimension.x < 0) { this.start.x = this.start.x + this.dimension.x; this.dimension.x *= -1; } //correct for selections not drawn from top left
					if (this.dimension.y < 0) { this.start.y = this.start.y + this.dimension.y; this.dimension.y *= -1; }
					//todo check for >max
					
					console.log("selectupthis", this)
                    csel.scale(devicePixelRatio, devicePixelRatio);
                    csel.drawImage(canvas,
                        Math.floor(this.start.x) * devicePixelRatio,
                        Math.floor(this.start.y) * devicePixelRatio,
                        
                        this.dimension.x * devicePixelRatio,
                        this.dimension.y * devicePixelRatio,
                        
                        0, 0,
                        
                        this.dimension.x,
                        this.dimension.y
                    );
					//csel.drawImage(canvas, Math.floor(this.start.x) * devicePixelRatio, Math.floor(this.start.y) * devicePixelRatio, this.dimension.x * devicePixelRatio, this.dimension.y * devicePixelRatio, 0, 0, this.dimension.x, this.dimension.y);
					csel.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
					
					csel.dimension = this.dimension;
					
					if (clickedTool == "crop") {
						canvas.width = this.dimension.x * devicePixelRatio;
						canvas.height = this.dimension.y * devicePixelRatio;
						
						canvastemp.width = canvas.width;
						canvastemp.height = canvas.height;
						
						canvas.style.width = canvastemp.style.width = (canvas.width / devicePixelRatio) + 'px';
						canvas.style.height = canvastemp.style.height = (canvas.height / devicePixelRatio) + 'px';
						
						ctx.drawImage(canvassel, 0, 0);

						ctx.scale(devicePixelRatio, devicePixelRatio);
						ctxTemp.scale(devicePixelRatio, devicePixelRatio);

						canvasLeft = canvas.getBoundingClientRect().left;
						byId("canvastemp").style.left = canvasLeft;

						this.status = 0;
						canvastemp.style.display='none';
						csel.clearRect(0, 0, canvassel.width, canvassel.height);
					} else if (clickedTool == "blur") {
                        boxBlurCanvasRGBA("canvas",
                            this.start.x,
                            this.start.y,
                            this.dimension.x,
                            this.dimension.y,
                            3,
                            10
                        );

                        this.status = 0;
                        canvastemp.style.display='none';
                        csel.clearRect(0, 0, canvassel.width, canvassel.height);
                    }
				}
			} else if (this.status == 1) { //finished moving selection
				this.status = 2;
				this.start = { x:m.x-this.offset.x, y:m.y-this.offset.y }
				if (e.ctrlKey) { //stamp mode
					ctx.drawImage(canvassel, Math.floor(this.start.x), Math.floor(this.start.y));
				}
			}

			undoSave();
		}

		this.del = function() { 
			ctx.fillStyle = FILL_STYLE;
			ctx.fillRect(this.start.x-.5, this.start.y-.5, this.dimension.x, this.dimension.y);
			activateTempCanvas(); 
			canvastemp.style.display = 'none';
			this.status = 0;
			undoSave();
		}
		this.all = function() { 
			csel.clearRect(0, 0, canvassel.width, canvassel.height);
			csel.drawImage(canvas, 0, 0);
			activateTempCanvas();
			this.start = { x:0.5, y:0.5 }
			this.dimension = { x:canvas.width, y:canvas.height }		
			ctxTemp.strokeRect(0.5, 0.5, canvas.width-1, canvas.height-1);
			this.status = 3;
		}
		this.copy = function() {
			csel.drawImage(canvas, Math.floor(this.start.x), Math.floor(this.start.y), this.dimension.x, this.dimension.y, 0, 0, this.dimension.x, this.dimension.y);
			csel.dimension = this.dimension;
		}
		this.paste = function() {
			activateTempCanvas();
			ctxTemp.drawImage(canvassel, 0, 0);
			this.status = 3;
			this.start = { x:.5, y:.5 }
			this.dimension = csel.dimension;
			ctxTemp.strokeRect(this.start.x-.5, this.start.y-.5, this.dimension.x+.5, this.dimension.y+.5);

		}

	}

}

function getPixel(x, y) {
  if(ctx.getImageData) {
      return false;
  } else if (window.opera) {
    if(!co) { co = canvas.getContext('opera-2dgame');	}
    col = co.getPixel(x, y);
    //check += '<br />'+x+'/'+y+': '+col;
    return col;
  } else {
    return false; 
  }
}  

function c_down(e) {
	console.log("c_down", e);
	
	// when touchevent button is undefined
	if (e.button == undefined || e.button == 0) {
		//handles mousedown on the canvas depending on tool selected
		var source = e.currentTarget;
		m = getxy(e, canvas);

		if(ctx.tool.name != 'select' && ctx.tool.name != 'eraser') { //no color switching for these
			if (e.ctrlKey) {
				//ctx.strokeStyle = "#ddd";
			}
		}

		ctx.tool.down(e);
		ctx.moveTo(m.x, m.y); //?
    }

    if (ctx.tool.name == "arrow" ||
        ctx.tool.name == "line" ||
        ctx.tool.name == "rectangle" ||
        (ctx.tool.name == "ellipse" && clickedTool != "spotlight-circle")
        ) {
        setShadow(true);
    } else {
        setShadow(false);
    }
    
	return false;
}

function initUndoButtons() {
    css("#refresh, #undo", {
        visibility: "visible"
    });
}

function c_up(e) {
    console.log("c_up");
    
	if (e.button == undefined || e.button == 0) {
		// handles mouseup on the canvas depending on tool selected
		initUndoButtons();
		
		e.stopPropagation();
		if(ctx.resizing) { bodyUp(e); } //but not if dragging

		ctx.tool.up(e);
		if(ctx.tool.name != 'select' && ctx.tool.name != 'eraser') { //no color switching for these
			if(e.button == 2 && ctx.tool.name != 'eraser') { //right: switch stroke & fill back
				var temp = ctx.fillStyle;
				ctx.fillStyle = ctx.strokeStyle;
				ctx.strokeStyle = temp;
			}
			if(e.ctrlKey) { 
				var temp = ctx.strokeStyle;
				ctx.strokeStyle = ctx.tertStyle;
				ctx.tertStyle = temp;
			}
		}
		//c.strokeStyle = c.fillStyle;		
	}
	return false;
}

function c_move(e) {
	m = getxy(e, canvas);
	e.stopPropagation();
	if (ctx.resizing) { bodyMove(e); } //don't stop propagation if dragging

	if (ctx.tool.status > 0 && ctx.tool.move) {
		ctx.tool.move(e);
	}

	return false;
}

function c_out(e) {
	if(ctx && (ctx.tool.name=='pencil' || ctx.tool.name=='brush') && ctx.tool.status==1) { 
		ctx.tool.disconnected = 1;
		m = getxy(e, canvas);
		ctx.tool.draw();
	}

}

function activateTempCanvas() {
	//resets and shows overlay canvas
	if(m) { ctxTemp.moveTo(m.x, m.y); }							//copy context from main
	ctxTemp.lineCap = ctx.lineCap;								
	ctxTemp.lineWidth = ctx.lineWidth;
	ctxTemp.strokeStyle = ctx.strokeStyle;
	ctxTemp.fillStyle = ctx.fillStyle;
	ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);	//clear
	canvastemp.style.display='block';							//show
}

function canvasResize(e) {
	ctx.resizing = true;
	document.body.style.cursor = 'nw-resize';
	canvastemp.lastCursor = canvastemp.style.cursor;
	canvastemp.style.cursor = 'nw-resize';
	activateTempCanvas();
	var dotted = new Image(); dotted.src = 'icons/dotted.gif';
	ctxTemp.strokeStyle = ctxTemp.createPattern(dotted, 'repeat');
}


function clipResize(w, h) { 
	//resizes all the canvases by clipping/extending, moves resize handle
	canvas.width = canvastemp.width = canvassel.width = w;
	canvas.height = canvastemp.height = canvassel.height = h;
	canvas.style.width = canvastemp.style.width = w+'px';
	canvas.style.height = canvastemp.style.height = h+'px';
	var cresizer = document.getElementById('canvasresize');
	if (cresizer) {
		cresizer.style.left = w+cresizer.offsetWidth+'px'; cresizer.style.top = h+cresizer.offsetHeight+'px';
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height); //so that if expanding it's filled with bg col
	undoSave();
}


function bodyMove(e) {
	//lets the user move outside the canvas while drawing shapes and lines

	if(ctx.tool.status > 0) { c_move(e); }	

	if(ctx.resizing) {	
		m = getxy(e, document.body);
		var win = wsp.parentNode.parentNode.parentNode;
		ctxTemp.clearRect(0, 0, canvastemp.width, canvastemp.height);
		ctxTemp.strokeRect(0, 0, m.x, m.y); //dotted line
	}

}


function bodyUp(e) {
	//stops drawing even if mouseup happened outside canvas
	//closes menus if clicking somewhere else
	if (ctx.resizing) {
		ctx.resizing = false; document.body.style.cursor = 'auto'; canvastemp.style.cursor = canvastemp.lastCursor;
		m = getxy(e, wsp);
		clipResize(m.x-3, m.y-3);
	}

	if(ctx.tool.name == 'select') { //cancel selection or finalize selection move
	    sel_cancel();
	}

	if(ctx && ctx.tool.name != 'polygon' && ctx.tool.status > 0) {
		c_up(e);
	}
	/*
	if(document.getElementById('menubar').className=='open') {
		document.getElementById('menubar').className='';
		e.stopPropagation();
	}
	*/
}

function drawDot(x, y, size, col, trg) {
	x = Math.floor(x)+1; //prevent antialiasing of 1px dots
	y = Math.floor(y)+1;

	if(x>0 && y>0) {

		if(!trg) { trg = ctx; }
		if(col || size) { var lastcol = trg.fillStyle; var lastsize = trg.lineWidth; }
		if(col)  { trg.fillStyle = col;  }
		if(size) { trg.lineWidth = size; }	
		if(trg.lineCap == 'round') {
			trg.arc(x, y, trg.lineWidth/2, 0, (Math.PI/180)*360, false);
			trg.fill();
		} else {
			var dotoffset = (trg.lineWidth > 1) ? trg.lineWidth/2 : trg.lineWidth;
			trg.fillRect((x-dotoffset), (y-dotoffset), trg.lineWidth, trg.lineWidth);
		}
		if(col || size) { trg.fillStyle = lastcol; trg.lineWidth = lastsize; }

	}
}

function drawLine(x1, y1, x2, y2, mod, trg) { 

	if(trg.lineWidth % 2 == 0) { x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2); } //no antialiasing

	trg.beginPath();
	trg.moveTo(x1, y1);
	if(mod) {
		var dx = Math.abs(x2-x1);
		var dy = Math.abs(y2-y1);	
		var dd = Math.abs(dx-dy);
		if(dx > 0 && dy > 0 && dx != dy) {
			if(dd < dx && dd < dy) { //diagonal
				if(dx < dy) {
					y2 = y1+(((y2-y1)/dy)*dx);
				} else {
					x2 = x1+(((x2-x1)/dx)*dy);
				}
			} else if(dx < dy) {
				x2 = x1;
			} else if(dy < dx) {
				y2 = y1;
			}
		}
	}
	trg.lineTo(x2, y2);
	trg.stroke();
	trg.beginPath();
	return { x:x2, y:y2 }
}

function drawArrow(x1, y1, x2, y2, mod, trg) { 

	if(trg.lineWidth % 2 == 0) { x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2); } //no antialiasing

	trg.beginPath();
	trg.moveTo(x1, y1);

	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);	
	var dd = Math.abs(dx-dy);
	
	if (mod) { // not free hand angles
		if(dx > 0 && dy > 0 && dx != dy) {
			if(dd < dx && dd < dy) { //diagonal
				if(dx < dy) {
					y2 = y1+(((y2-y1)/dy)*dx);
				} else {
					x2 = x1+(((x2-x1)/dx)*dy);
				}
			} else if(dx < dy) {
				x2 = x1;
			} else if(dy < dx) {
				y2 = y1;
			}
		}
	}

	var ArrowHeadLength = 16;
	
	var LineAngle = Math.atan((y2-y1)/(x2-x1));
	var EndAngle1 = LineAngle + 35 * Math.PI/180;
	var EndAngle2 = LineAngle - 35 * Math.PI/180;

	
	var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	
	//console.log(angle);
	//console.log(x2-x1, y2-y1);
	//console.log(LineAngle, EndAngle1, EndAngle2)
	
	// jason correced the arrow just a bit
	if (-90 <= angle && angle <= 0) {
		trg.lineTo(x2, y2+1);
	} else if (90 < angle && angle <= 180) {
		trg.lineTo(x2, y2-1);
	} else {
		trg.lineTo(x2, y2);
	}
	
	let dir=1;
	if (x2<x1) {
		dir=-1;
	}
	var x3 = x2 - ArrowHeadLength * Math.cos(EndAngle1) * dir;
	var y3 = y2 - ArrowHeadLength * Math.sin(EndAngle1) * dir;
	
	var x4 = x2 - ArrowHeadLength * Math.cos(EndAngle2) * dir;
	var y4 = y2 - ArrowHeadLength * Math.sin(EndAngle2) * dir;



	trg.moveTo(x2+dir, y2+dir);
	trg.lineTo(x3, y3);
	trg.moveTo(x2+dir, y2+dir);
	trg.lineTo(x4, y4);

	trg.stroke();
	trg.beginPath();
	return { x:x2, y:y2 }
}

function drawEllipse(x1, y1, x2, y2, mod, trg) {
	//bounding box. this maybe isn't the best idea?
	 
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);
	
	if(mod && !(dx==dy)) { 	//shift held down: constrain
		if(dx < dy) {
			x2 = x1+(((x2-x1)/dx)*dy);
		} else {
  		y2 = y1+(((y2-y1)/dy)*dx);
		} 
	}

    var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);
	var rx = (x2-x1)/2;
	var ry = (y2-y1)/2;	
    var cx = x1+rx;
    var cy = y1+ry;

	trg.beginPath();
    trg.moveTo(cx, cy - ry);
    trg.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);  
    trg.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry); 
    trg.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy); 
    trg.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry); 

    if (ctx.strokeFill == "fill") {
        trg.fill();
    } else {
        trg.stroke()
    }
}

function drawSpotlightCircle(x1, y1, x2, y2, mod, trg) {
	// I'll use a skyblue background that covers everything
	// Just to demonstrate

	trg.beginPath();
	
	ctx = trg;

	//ctx.fillStyle = "skyblue";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Create a canvas that we will use as a mask
	var maskCanvas = canvastemp;
	// Ensure same dimensions
	//maskCanvas.width = canvas.width;
	//maskCanvas.height = canvas.height;
	var maskCtx = maskCanvas.getContext('2d');

	// This color is the one of the filled shape
	maskCtx.fillStyle = "black"; //"rgba(0,0,0,0.88)";
	// Fill the mask
	maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

	// Set xor operation
	maskCtx.globalCompositeOperation = 'xor';
	// Draw the shape you want to take out
	maskCtx.arc(x1 / devicePixelRatio, y1 / devicePixelRatio, ctx.lineWidth * 20, 0, 2 * Math.PI);
	maskCtx.fill();
	ctx.drawImage(maskCanvas, 0, 0);
}

function drawRounded(x1, y1, x2, y2, mod, trg) {
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);

	if(mod && dx != dy) {	//shift held down: constrain
		if(dx < dy) {
			y2 = y1+(((y2-y1)/dy)*dx);
			dy = dx;
		} else {
			x2 = x1+(((x2-x1)/dx)*dy);
			dx = dy;
		}
	}
	var dmin = (dx < dy) ? dx : dy;
	var cornersize = (dmin/2 >= 5) ? 5 : dmin/2;
	
	var xdir = (x2 > x1) ? cornersize : -1*cornersize;
	var ydir = (y2 > y1) ? cornersize : -1*cornersize;

	drawRounded2(trg, x1, x2, y1, y2, xdir, ydir);
	if(ctx.strokeFill == 2 || ctx.strokeFill == 3) { trg.fill(); }
	if(ctx.strokeFill == 1 || ctx.strokeFill == 3) { trg.stroke(); }

}

function drawRounded2(trg, x1, x2, y1, y2, xdir, ydir) {
	trg.beginPath();
	trg.moveTo(x1, y1+ydir);
	trg.quadraticCurveTo(x1, y1, x1+xdir, y1);
	trg.lineTo(x2-xdir, y1);
	trg.quadraticCurveTo(x2, y1, x2, y1+ydir);
	trg.lineTo(x2, y2-ydir);
	trg.quadraticCurveTo(x2, y2, x2-xdir, y2);
	trg.lineTo(x1+xdir, y2);
	trg.quadraticCurveTo(x1, y2, x1, y2-ydir);
	trg.closePath();
}

function constrain(n, min, max) {
	if(n > max) return max;
	if(n < min) return min;
	return n;
}

function intersects(m, start, dim) {
//checks if m(x,y) is between start(x,y) and start+dim(x,y)
	if(	m.x >= start.x && m.y >= start.y &&
		m.x <= (start.x+dim.x) && m.y <= (start.y+dim.y)) {
		return true;
	} else {
		return false;
	}
}