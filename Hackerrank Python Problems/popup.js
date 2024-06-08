document.addEventListener('DOMContentLoaded', function() {
    const hackerrankPythonLink = document.getElementById('hackerrank-python-link');
    hackerrankPythonLink.addEventListener('click', function() {
      chrome.tabs.create({ url: hackerrankPythonLink.href });
    });
  });