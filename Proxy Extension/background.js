chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
  });
  
  function setProxy(config) {
    const proxyConfig = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: config.scheme,
          host: config.host,
          port: parseInt(config.port)
        },
        bypassList: config.bypassList ? config.bypassList.split(",") : []
      }
    };
    chrome.proxy.settings.set(
      { value: proxyConfig, scope: 'regular' },
      () => {
        console.log("Proxy settings applied:", proxyConfig);
      }
    );
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setProxy") {
      setProxy(request.config);
      sendResponse({status: "Proxy set"});
    }
  });
  