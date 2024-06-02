chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const username = request.username;
    fetch(`https://api.github.com/users/${username}/events`)
      .then(response => response.json())
      .then(events => {
        let realContributions = 0;
        let fakeContributions = 0;
  
        events.forEach(event => {
          if (event.type === 'PushEvent') {
            realContributions++;
          } else {
            fakeContributions++;
          }
        });
  
        sendResponse({
          message: `User ${username} has ${realContributions} real contributions and ${fakeContributions} fake contributions today.`
        });
      })
      .catch(error => {
        sendResponse({ message: 'Error fetching activity: ' + error.message });
      });
  
    return true;  // Keep the message channel open for sendResponse
  });
  