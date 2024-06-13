export async function monitorCI() {
    const response = await fetch('https://ci.example.com/api/status');
    const data = await response.json();
    
    if (data.status !== 'success') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'CI Monitor Alert',
        message: `CI Pipeline failed: ${data.error}`
      });
    }
  }
  