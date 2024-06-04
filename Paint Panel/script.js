var arr_touches = [];
var canvas;
var ctx;
var down = false; //mouse is pressed
var color = 'black'; //default drawing color
var width = 5; // drawing width

// Function to handle color change on click or touchstart
function handleColorChange(event) {
    var color = event.target.id;
    changeColor(color);
}

// Attach event listeners to all buttons
var colorButtons = document.querySelectorAll('#colors button');
colorButtons.forEach(function(button) {
    button.addEventListener('click', handleColorChange);
    button.addEventListener('touchstart', handleColorChange);
});

document.getElementById('clearButton').addEventListener('click', clearCanvas);

//calling window.onload to make sure the HTML is loaded
window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); 
    ctx.lineWidth = width;
    
    //handling mouse click and move events
    canvas.addEventListener('mousemove', handleMove); 
    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mouseup', handleUp);
    
    //handling mobile touch events
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchleave", handleEnd, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
};
function handleMove(e)
{
	xPos = e.clientX-canvas.offsetLeft;
	yPos = e.clientY-canvas.offsetTop;
	if(down == true)
	{
		ctx.lineTo(xPos,yPos); //create a line from old point to new one
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}
function handleDown() 
{
    down = true;
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);
}
function handleUp() 
{
    down = false;
}
function handleStart(evt) 
{
    var touches = evt.changedTouches;
    for(var i = 0; i < touches.length; i++) 
    {
	    if(isValidTouch(touches[i])) 
	    {
	        evt.preventDefault();
	        arr_touches.push(copyTouch(touches[i]));
	        ctx.beginPath();
	        ctx.fillStyle = color;
	        ctx.fill();
        }
    }
}
function handleTouchMove(evt) 
{
    var touches = evt.changedTouches;
    var offset = findPos(canvas);
    for (var i = 0; i < touches.length; i++) 
    {
		if(isValidTouch(touches[i])) 
		{
	        evt.preventDefault();
	        var idx = ongoingTouchIndexById(touches[i].identifier);
    	    if (idx >= 0) 
    	    {
    	        ctx.beginPath();
    	        ctx.moveTo(arr_touches[idx].clientX-offset.x, arr_touches[idx].clientY-offset.y);
    	        ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
    	        ctx.strokeStyle = color;
    	        ctx.stroke();
    	        
    	        arr_touches.splice(idx, 1, copyTouch(touches[i]));
    	    }   
	    }
    }
}
function handleEnd(evt) 
{
    var touches = evt.changedTouches;
    var offset = findPos(canvas);
    for (var i = 0; i < touches.length; i++) 
    {
		if(isValidTouch(touches[i])) 
		{
		    evt.preventDefault();
	        var idx = ongoingTouchIndexById(touches[i].identifier);
	        if (idx >= 0) 
	        {
	            ctx.lineWidth = 4;
	            ctx.fillStyle = color;
	            ctx.beginPath();
	            ctx.moveTo(arr_touches[idx].clientX-offset.x, arr_touches[idx].clientY-offset.y);
	            ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
	           arr_touches.splice(i, 1);
	        } 
        }
	}
}
function handleCancel(evt) 
{
    evt.preventDefault();
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
	    arr_touches.splice(i, 1);
    }
}
function copyTouch(touch) 
{
    return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
}
function ongoingTouchIndexById(idToFind) 
{
    for (var i = 0; i < arr_touches.length; i++) {
	    var id = arr_touches[i].identifier;
	    if (id == idToFind) {
	        return i;
	    }
    }
    return -1;
}
function changeColor(new_color) 
{
    color = new_color;
}
function clearCanvas() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function isValidTouch(touch) 
{
    var curleft = 0, curtop = 0;
    var offset = 0;
    
	if (canvas.offsetParent) {
		do {
			curleft += canvas.offsetLeft;
			curtop += canvas.offsetTop;
		} while (touch == canvas.offsetParent);
	    
	    offset = { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
	}
    
    if(touch.clientX-offset.x > 0 &&
	        touch.clientX-offset.x < parseFloat(canvas.width) &&
	            touch.clientY-offset.y >0 &&
	                touch.clientY-offset.y < parseFloat(canvas.height)) {
        return true;
    }
	else 
	{
	    return false;
	}
}
function findPos(obj) 
{
	var curleft = 0, curtop = 0;
	if (obj.offsetParent) 
	{
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj == obj.offsetParent);

		return { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
	}
}