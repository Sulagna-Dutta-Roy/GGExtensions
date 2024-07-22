function increaseTextSize() {
    document.body.style.fontSize = 'larger';
  }
  
  function decreaseTextSize() {
    document.body.style.fontSize = 'smaller';
  }
  
  function changeBackgroundColor() {
    document.body.style.backgroundColor = document.body.style.backgroundColor === 'white' ? 'lightgrey' : 'white';
  }
  
  function increaseContrast() {
    document.body.style.filter = 'contrast(150%)';
  }
  
  function decreaseContrast() {
    document.body.style.filter = 'contrast(100%)';
  }
  