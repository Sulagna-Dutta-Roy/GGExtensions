document.getElementById('setProxyButton').addEventListener('click', () => {
    const scheme = document.getElementById('scheme').value;
    const host = document.getElementById('host').value;
    const port = document.getElementById('port').value;
    const bypassList = document.getElementById('bypassList').value;
  
    const config = { scheme, host, port, bypassList };
  
    chrome.runtime.sendMessage({ action: "setProxy", config: config }, response => {
      console.log(response.status);
    });
  });
  