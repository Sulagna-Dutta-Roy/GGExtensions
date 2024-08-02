var steerFrame = document.createElement('iframe');
steerFrame.style = 'border: 0; margin: 0; width: 6.510416666666667vw; height:  6.510416666666667vw;';
steerFrame.src = 'steering.html#steering';
steerFrame.className = 'steering-wheel';
steerFrame.scrolling = 'no';
document.body.appendChild(steerFrame);
window.addEventListener('message', function(e) {
    const data = e.data;
    if (data === 'mouseLeftDown()') {
        //mouseLeftDown();
    } else if (data === 'mouseRightDown()') {
        //mouseRightDown();
    }
});
