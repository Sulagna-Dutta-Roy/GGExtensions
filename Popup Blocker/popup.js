document.getElementById('toggle').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "toggleBlocking", blocking: !blocking }, function(response) {
      updateStatus(response.blocking);
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: "getBlockingStatus" }, function(response) {
      updateStatus(response.blocking);
    });
  });
  
  function updateStatus(blocking) {
    document.getElementById('status').textContent = blocking ? 'Active' : 'Inactive';
    document.getElementById('status').style.color = blocking ? 'green' : 'red';
  }
  