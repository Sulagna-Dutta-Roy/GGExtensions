document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('resize-800-600').addEventListener('click', function () {
      resizeWindow(800, 600);
    });
  
    document.getElementById('resize-1024-768').addEventListener('click', function () {
      resizeWindow(1024, 768);
    });
  
    document.getElementById('resize-1280-800').addEventListener('click', function () {
      resizeWindow(1280, 800);
    });
  
    document.getElementById('resize-1440-900').addEventListener('click', function () {
      resizeWindow(1440, 900);
    });
  
    function resizeWindow(width, height) {
      chrome.windows.getCurrent(function (window) {
        chrome.windows.update(window.id, {
          width: width,
          height: height
        });
      });
    }
  });
  