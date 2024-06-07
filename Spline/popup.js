document.addEventListener('DOMContentLoaded', function() {
    const splineLink = document.getElementById('spline-link');
    splineLink.addEventListener('click', function() {
      chrome.tabs.create({ url: "https://app.spline.design/home" });
    });
  });
  