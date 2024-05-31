const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');


//Displaying thumbBar Images
var images = ['assets/pic1.jpg',
              'assets/pic2.jpg',
              'assets/pic3.jpg',
              'assets/pic4.jpg',
              'assets/pic5.jpg'];
              
function createImageNode() {
    var imgs = document.createElement('img');
    imgs.setAttribute('src',images[i]);
    return imgs;
  }          
  for(var i = 0; i < images.length; i++){
    thumbBar.appendChild(createImageNode());
  };
  
   //Displaying thumbBar images in displayedImages
  thumbBar.addEventListener('click', (e) => {
    if(e.target.nodeName == "IMG") { //Write nodename in capital letters only
      displayedImage.src = e.target.src;//Assingning the values of target.src to displayedImage.src
  }
  });
 // Changing the modes on button click
  btn.addEventListener('click', (e) => {
    if (e.target.className == 'dark') {
      btn.setAttribute('class', 'light');
      btn.textContent = 'Lighten';
      overlay.style.backgroundColor = 'rgba(2,1,1,0.5)';
  }
  
   else {
      btn.setAttribute('class', 'dark');
      btn.textContent = 'Darken';
      overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
  });





