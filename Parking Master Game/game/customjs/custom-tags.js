document.createElement('url');
var customT_styles = document.createElement('link');
customT_styles.rel = 'stylesheet';
customT_styles.type = 'text/css';
customT_styles.href = 'https://cdn.jsdelivr.net/gh/Parking-Master/Parking-Master/game/customjs/custom-tags.css';
document.head.appendChild(customT_styles);
check_text$$ = setTimeout(function(){
document.getElementsByTagName('url')[0].innerText = document.getElementsByTagName('url')[0].getAttribute('text');
document.getElementsByTagName('url')[0].addEventListener('click', function(){
  var url_loc = document.getElementsByTagName('url')[0].getAttribute('to');
  window.location.href = url_loc;
});
if (document.getElementsByTagName('url')[0].innerText === document.getElementsByTagName('url')[0].getAttribute('text')) {
  window.clearInterval(check_text$$);
}
}, 1);
