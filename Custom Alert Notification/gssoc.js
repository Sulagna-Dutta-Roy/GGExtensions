document.addEventListener('DOMContentLoaded', function () {
    const showAlertBtn = document.getElementById('showAlert');
    const alertBox = document.querySelector('.alert');
    const closeBtn = document.querySelector('.close-btn');
  
    showAlertBtn.addEventListener('click', function () {
      alertBox.classList.add('show');
      setTimeout(function () {
        alertBox.classList.remove('show');
      }, 5000);
    });
  
    closeBtn.addEventListener('click', function () {
      alertBox.classList.remove('show');
    });
  });
  