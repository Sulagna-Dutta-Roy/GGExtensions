window.requestAnimFrame = function () {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
          window.setTimeout(callback, 1000 / 60);
      };
}();

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  cw = window.innerWidth,
  ch = window.innerHeight,
  fireworks = [],
  particles = [],
  hue = 120,
  limiterTotal = 5,
  limiterTick = 0,
  timerTotal = 80,
  timerTick = 0,
  mousedown = false,
  mx,
  my;

canvas.width = cw;
canvas.height = ch;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
  var xDistance = p1x - p2x,
      yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {
  this.x = sx;
  this.y = sy;
  this.sx = sx;
  this.sy = sy;
  this.tx = tx;
  this.ty = ty;
  this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
  this.distanceTraveled = 0;
  this.coordinates = [];
  this.coordinateCount = 3;
  while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
  }
  this.angle = Math.atan2(ty - sy, tx - sx);
  this.speed = 2;
  this.acceleration = 1.05;
  this.brightness = random(50, 70);
  this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  if (this.targetRadius < 8) {
      this.targetRadius += 0.3;
  } else {
      this.targetRadius = 1;
  }
  this.speed *= this.acceleration;
  var vx = Math.cos(this.angle) * this.speed,
      vy = Math.sin(this.angle) * this.speed;
  this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
  if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
  } else {
      this.x += vx;
      this.y += vy;
  }
};

Firework.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
  ctx.stroke();
};

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.coordinates = [];
  this.coordinateCount = 5;
  while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
  }
  this.angle = random(0, Math.PI * 2);
  this.speed = random(1, 10);
  this.friction = 0.95;
  this.gravity = 1;
  this.hue = random(hue - 20, hue + 20);
  this.brightness = random(0, 80);
  this.alpha = 1;
  this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  this.speed *= this.friction;
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  this.alpha -= this.decay;
  if (this.alpha <= this.decay) {
      particles.splice(index, 1);
  }
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
  ctx.stroke();
};

function createParticles(x, y) {
  var particleCount = 30;
  while (particleCount--) {
      particles.push(new Particle(x, y));
  }
}

function loop() {
  requestAnimFrame(loop);
  hue += 0.5;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';
  var i = fireworks.length;
  while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
  }
  i = particles.length;
  while (i--) {
      particles[i].draw();
      particles[i].update(i);
  }
  if (timerTick >= timerTotal) {
      if (!mousedown) {
          fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
          timerTick = 0;
      }
  } else {
      timerTick++;
  }
  if (limiterTick >= limiterTotal) {
      if (mousedown) {
          fireworks.push(new Firework(cw / 2, ch, mx, my));
          limiterTick = 0;
      }
  } else {
      limiterTick++;
  }
}

window.onload = function () {
  var merrywrap = document.getElementById("merrywrap");
  var box = merrywrap.getElementsByClassName("giftbox")[0];
  var step = 1;
  var stepMinutes = [2000, 2000, 1000, 1000];
  function init() {
      box.addEventListener("click", openBox, false);
  }
  function stepClass(step) {
      merrywrap.className = 'merrywrap';
      merrywrap.className = 'merrywrap step-' + step;
  }
  function openBox() {
      if (step === 1) {
          box.removeEventListener("click", openBox, false);
      }
      stepClass(step);
      if (step === 3) {
      }
      if (step === 4) {
          reveal();
          return;
      }
      setTimeout(openBox, stepMinutes[step - 1]);
      step++;
  }
  init();
};

function reveal() {
  document.querySelector('.merrywrap').style.backgroundColor = 'transparent';

  loop();

  var w = 290; 
  var h =200;

  var sliderContainer = document.createElement("div");
  sliderContainer.setAttribute("id", "image-slider");
  sliderContainer.style.width = `${w}px`;
  sliderContainer.style.height = `${h}px`;
  sliderContainer.style.position = 'relative';
  sliderContainer.style.overflow = 'hidden';
  sliderContainer.style.borderRadius = '5px';

  var images = [
      "https://ideogram.ai/assets/progressive-image/balanced/response/-Shau3EjTAui5ZgcFkKE8A",
      "https://ideogram.ai/assets/progressive-image/balanced/response/9DqagjxEQCG8RcIC0Ce8OQ",
      "https://ideogram.ai/assets/progressive-image/balanced/response/EmI8mq33QNSgkmwEuA3KFQ",
      "https://ideogram.ai/assets/progressive-image/balanced/response/rnAv7Y1pTreJc5J243v_wA"

  ];

  for (let i = 0; i < images.length; i++) {
      let img = document.createElement("img");
      img.setAttribute("src", images[i]);
      img.style.width = `${w}px`;
      img.style.height = `${h}px`;
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.opacity = i === 0 ? '1' : '0';
      img.style.transition = 'opacity 1s ease-in-out';
      sliderContainer.appendChild(img);
  }

  let currentIndex = 0;

  function showNextImage() {
      let imgs = sliderContainer.getElementsByTagName("img");
      imgs[currentIndex].style.opacity = '0';
      currentIndex = (currentIndex + 1) % imgs.length;
      imgs[currentIndex].style.opacity = '1';
  }

  setInterval(showNextImage, 5000); 
    document.querySelector('#video').appendChild(sliderContainer);
    var audio = document.createElement("audio");
    audio.setAttribute("src", "HappyBirthday.mp3"); 
    audio.setAttribute("controls", "");
    audio.setAttribute("autoplay", "");
    audio.setAttribute("loop", "true");
    audio.style.display = "none"; 
    document.querySelector('#audio').appendChild(audio);
    setTimeout(showFeedbackForm, 15000);
}

function showFeedbackForm() {
    var formContainer = document.createElement("div");
    formContainer.setAttribute("id", "feedback-form");
    formContainer.style.position = "fixed";
    formContainer.style.top = "50%";
    formContainer.style.left = "50%";
    formContainer.style.transform = "translate(-50%, -50%)";
    formContainer.style.width = "500px";
    formContainer.style.padding = "30px";
    formContainer.style.backgroundColor = "rgb(35, 16, 81)";
    formContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    formContainer.style.borderRadius = "10px";
    formContainer.style.textAlign = "center";
    formContainer.style.zIndex = "1000";
    var image = document.createElement("img");


    image.setAttribute("src", "feedback.jpeg");
    image.style.width = "200px";
    image.style.marginBottom = "20px";
    image.style.borderRadius = "25px";
    formContainer.appendChild(image);
    var nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "Your Name");
    nameInput.setAttribute("id", "name");
    nameInput.style.marginBottom = "10px";
    nameInput.style.width = "100%";
    formContainer.style.padding = "30px";
    nameInput.style.borderRadius = "5px";
    nameInput.style.padding = "10px";
    nameInput.style.border = "1px solid #ccc";
    formContainer.appendChild(nameInput);

    var emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Your Email");
    emailInput.setAttribute("id", "email");
    emailInput.style.marginBottom = "10px";
    emailInput.style.width = "100%";
    emailInput.style.padding = "10px";
    emailInput.style.borderRadius = "5px";
    emailInput.style.border = "1px solid #ccc";
    formContainer.appendChild(emailInput);

    var phoneInput = document.createElement("input");
    phoneInput.setAttribute("type", "tel");
    phoneInput.setAttribute("placeholder", "Your Phone Number");
    phoneInput.setAttribute("id", "phone");
    phoneInput.style.marginBottom = "10px";
    phoneInput.style.width = "100%";
    phoneInput.style.padding = "10px";
    phoneInput.style.borderRadius = "5px";
    phoneInput.style.border = "1px solid #ccc";
    formContainer.appendChild(phoneInput);

    var feedbackInput = document.createElement("textarea");
    feedbackInput.setAttribute("placeholder", "Your Valuable Reply");
    feedbackInput.setAttribute("id", "feedback");
    feedbackInput.style.marginBottom = "20px";
    feedbackInput.style.width = "100%";
    feedbackInput.style.padding = "10px";
    feedbackInput.style.borderRadius = "5px";
    feedbackInput.style.border = "1px solid #ccc";
    formContainer.appendChild(feedbackInput);
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit Feedback";
    submitButton.style.padding = "10px 20px";
    submitButton.style.backgroundColor = "#28a745";
    submitButton.style.color = "white";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "5px";
    submitButton.style.cursor = "pointer";
    submitButton.onclick = sendFeedback;

    formContainer.appendChild(submitButton);

    document.body.appendChild(formContainer);
}
function sendFeedback() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var feedback = document.getElementById("feedback").value;

    if (!name || !email || !phone || !feedback) {
        alert("Please fill in all fields.");
        return;
    }
    window.location.href = `mailto:kumarankit11458@gmail.com?subject=Thank you&body=Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0APhone: ${encodeURIComponent(phone)}%0AFeedback: ${encodeURIComponent(feedback)}`;
    var formContainer = document.getElementById("feedback-form");
    formContainer.parentNode.removeChild(formContainer);
}