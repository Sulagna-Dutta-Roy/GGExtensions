(function() {
    const libraries = [];
  
    // Check for jQuery
    if (window.jQuery) {
      libraries.push({name: 'jQuery', version: window.jQuery.fn.jquery});
    }
  
    // Check for React
    if (window.React) {
      libraries.push({name: 'React', version: window.React.version});
    }
  
    // Check for AngularJS
    if (window.angular) {
      libraries.push({name: 'AngularJS', version: window.angular.version.full});
    }
  
    // Check for Vue.js
    if (window.Vue) {
      libraries.push({name: 'Vue.js', version: window.Vue.version});
    }
  
    // You can add more checks for other libraries here
  
    // Send the result back to the popup
    chrome.runtime.sendMessage({libraries: libraries});
  })();
  