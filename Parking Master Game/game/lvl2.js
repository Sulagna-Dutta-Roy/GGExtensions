(function(){
  window.parent.document.title = "Parking Master LVL. 2";
})();
/*
function getCanvasUrl() {
  const canvas = document.getElementById('canvas');
  var canvasUrl = canvas.toDataURL();
  document.getElementById('newImgVid1f').src = canvasUrl;
}
setInterval(getCanvasUrl, 10);*/
    function carAudio() {
          document.getElementById('car_move').play();
    }
    function carAudioStop() {
        document.getElementById('car_move').pause();
        document.getElementById('car_move').currentTime = 0;
    }
if ( screen.width <= 1600 && screen.width >= 1000 ) {
// laptop
} else if ( screen.width <= 2000 && screen.width >= 1601 ) {
// monitor
}
//if( /Android|webOS|iPhone|iPad|Mahc|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { location.replace("https://parkingmaster.w3spaces.com/E5error404.html?bypass-cache=1625839281"); }
      var car_base_image = new Image();
      var car_left_image = new Image();
var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d');
function parkinglot(draw) {
ctx.fillStyle = '#fad201';
ctx.fillRect(590, 0, 10, canvas.height);
ctx.fillRect(450, 0, 140, 10);
ctx.fillRect(450, 90, 140, 10);
ctx.fillRect(450, 180, 140, 10);
// outline
ctx.fillStyle = '#00FF00';
ctx.fillRect(450, 270, 20, 10);
ctx.fillRect(480, 270, 20, 10);
ctx.fillRect(510, 270, 20, 10);
ctx.fillRect(540, 270, 20, 10);
ctx.fillRect(570, 270, 20, 10);

ctx.fillStyle = '#00FF00';
ctx.fillRect(450, 360, 20, 10);
ctx.fillRect(480, 360, 20, 10);
ctx.fillRect(510, 360, 20, 10);
ctx.fillRect(540, 360, 20, 10);
ctx.fillRect(570, 360, 20, 10);
}
var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');
function cars(draw) {
ctx.fillStyle = '#000000';
ctx.fillRect(0, 20, 110, 65);
ctx.fillRect(5, 78, 30, 10);
ctx.fillRect(75, 78, 30, 10);
ctx.fillRect(5, 17, 30, 10);
ctx.fillRect(75, 17, 30, 10);
}
      var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');
(function(){
  ctx.beginPath();
  car_base_image.src = 'car.png';
  onloadfunctioned_cardraw = true;
car_base_image.onload = function(){
  if (onloadfunctioned_cardraw === true) {
  ctx.drawImage(car_base_image, 10, 10, car_base_image.width - 120, car_base_image.height - 120);
  onloadfunctioned_cardraw = false;
  } else {
  return;
  }
}
  ctx.fill();
})();
      var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      last = performance.now(),
      animate,
      x = 10,
      y = 10;
      var newX2 = x + 50,
      newY2 = y + 40;
function draw() {
      if (document.title.includes('1')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_base_image.src = 'car.png';
      ctx.drawImage(car_base_image, x, y, car_base_image.width - 120, car_base_image.height - 120);
      ctx.fill();
      x += 5;
      parkinglot(draw);
if (x >= canvas.width - car_base_image.width + 120 || y >= canvas.height || x <= 0 || y <= 0) {
GameOver();
}
document.getElementById("speedbar").innerHTML = '5';
      } else if (document.title.includes('2')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_base_image.src = 'car_drive_image.png';
      ctx.drawImage(car_base_image, newX2, newY2, car_base_image.width - 110, car_base_image.height - 135);
      ctx.fill();
      y += -1;
      parkinglot(draw);
if (x >= canvas.width - car_base_image.width + 120 || y >= canvas.height - car_base_image.height + 135 || x <= 0 || y <= 0) {
GameOver();
}
document.getElementById("speedbar").innerHTML = '5';
      }
      animate = requestAnimationFrame(draw);
}

var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      last = performance.now(),
      x = 10,
      y = 10,
      animate;
 function mouseRightDown(draw) {
      if (document.title.includes('1')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_base_image.src = 'car.png';
      ctx.drawImage(car_base_image, x, y, car_base_image.width - 120, car_base_image.height - 120);
      ctx.fill();
      y += 1.5;
      x += 0.3;
      parkinglot(draw);
if (x >= canvas.width || y >= canvas.height || x <= 0 || y <= 0) {
GameOver();
}
animate2 = requestAnimationFrame(mouseRightDown);
      }
}
var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      last = performance.now(),
      x = 10,
      y = 10,
      animate;
 function mouseLeftDown(draw) {
      if (document.title.includes('1')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_base_image.src = 'car.png';
      ctx.drawImage(car_base_image, x, y, car_base_image.width - 120, car_base_image.height - 120);
      ctx.fill();
      y += -1.5;
      x += 0.3;
      parkinglot(draw);
if (x >= canvas.width || y >= canvas.height || x <= 0 || y <= 0) {
GameOver();
}
      } else if (document.title.includes('2')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_left_image.src = 'carleft.png';
      ctx.drawImage(car_left_image, x, y, car_left_image.width - 120, car_left_image.height - 120);
      ctx.fill();
      x += -3;
      parkinglot(draw);
if (x >= canvas.width || y >= canvas.height || x <= 0 || y <= 0) {
GameOver();
}
      }
animate3 = requestAnimationFrame(mouseLeftDown);
}
var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      last = performance.now(),
      animate;
function mouseReverseDown(draw) {
      if (document.title.includes('1')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      car_base_image.src = 'car.png';
      ctx.drawImage(car_base_image, x, y, car_base_image.width - 120, car_base_image.height - 120);
      ctx.fill();
      x += -4;
      animate4 = requestAnimationFrame(mouseReverseDown);
      parkinglot(draw);
if (x >= canvas.width || y >= canvas.height || x <= 0 || y <= 0) {
GameOver();
}
document.getElementById("speedbar").innerHTML = '4';
      }
}
function GameOver() {
const wrapper = document.createElement('div');
wrapper.innerHTML = '<hr><br><p style="font-family: \'Sansation\', Arial;">Your score: <span id="score">0 Points</span></p>';

swal({
  title: 'Game over',
  text: 'You crashed!',
  button: "Close",
  closeOnOutsideClick: false,
  closeOnEsc: false,
  content: wrapper
}).then(function(){
location.replace('index.html');
});
document.getElementsByClassName('swal-button--confirm')[0].style.backgroundColor = "#333";
}
function parkDetector() {
 if (y > 280 && y < 300 && x > 460) {
 carIsParked();
 } else {
 carIsNotParked();
 }
 function carIsParked() {
 swal({
   title: "Good job!",
   text: "You parked",
   icon: "success"
 }).then(function(){
  // document.write(/* Please replace the document to "LVL.2" */);
 });
 document.getElementsByClassName('swal-button--confirm')[0].style.backgroundColor = '#6cc22e';
 }
 function carIsNotParked() {
       const youdidntparkwrapper = document.createElement('div');
       youdidntparkwrapper.innerHTML = '<p>You didn\'t park. Try <a style="color: #b31b1b; text-decoration: none; border-bottom: 1px solid #b31b1b;" id="parking_again" href="#p1">parking again</a> or <a style="color: #b31b1b; text-decoration: none; border-bottom: 1px solid #b31b1b;" id="get_closer" href="#p2">get closer</a> to the spot.</p>';
 swal({
       title: "You didn't park",
       content: youdidntparkwrapper,
       icon: "error"
 });
 document.getElementsByClassName('swal-button--confirm')[0].style.backgroundColor = "#b31b1b";
        document.getElementById('parking_again').addEventListener('mousedown', function(){
         document.querySelector('#parking_again').style.textDecoration = "underline";
         document.querySelector('#parking_again').style.borderBottom = "none";
        document.getElementById('parking_again').addEventListener('mouseup', function(){
         document.querySelector('#parking_again').style.textDecoration = "none";
         document.querySelector('#parking_again').style.borderBottom = "1px solid #b31b1b";
       });
       });
        document.getElementById('get_closer').addEventListener('mousedown', function(){
         document.querySelector('#get_closer').style.textDecoration = "underline";
         document.querySelector('#get_closer').style.borderBottom = "none";
        document.getElementById('get_closer').addEventListener('mouseup', function(){
         document.querySelector('#get_closer').style.textDecoration = "none";
         document.querySelector('#get_closer').style.borderBottom = "1px solid #b31b1b";
       });
       });
       document.getElementById('parking_again').addEventListener('click', function(){
         swal.close();
         document.querySelector('.buttonPark').style.border = "2px solid transparent";
         document.querySelector('.buttonPark').style.outline = "2px solid red";
         document.querySelector('.buttonPark').addEventListener('mouseenter', function(){
         document.querySelector('.buttonPark').style.border = "none";
         document.querySelector('.buttonPark').style.outline = "none";
         });
       });
       document.getElementById('get_closer').addEventListener('click', function(){
             swal.close();
         document.getElementById('drive_pedal').style.outline = "2px solid red";
         document.querySelector('#drive_pedal').addEventListener('mouseenter', function(){
         document.querySelector('#drive_pedal').style.outline = "none";
         });
       });
 }
}
parkinglot(draw);

function mouseUp() {
    cancelAnimationFrame(animate); 
    document.getElementById("speedbar").innerHTML = '0';
}
function mouseDown() {
    requestAnimationFrame(draw);
}
function mouseRightUp() {
   cancelAnimationFrame(animate2); 
   document.getElementById("speedbar").innerHTML = '0';
}
function mouseLeftUp() {
   cancelAnimationFrame(animate3); 
   document.getElementById("speedbar").innerHTML = '0';
}
function mouseReverseUp() {
   cancelAnimationFrame(animate4); 
   document.getElementById("speedbar").innerHTML = '0';
}
