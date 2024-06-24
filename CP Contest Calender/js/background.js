chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log(alarm.name); 
    chrome.tabs.create({
            active: true,
            url:  alarm.name
          }, null);
});

chrome.notifications.onClicked.addListener(()=>{
    console.log("Happen");
});

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" called`);
});

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({url: 'https://webchrometools.netlify.app/#/cpcontestcalendar'});
      var genUserID = `NCPC${(new Date().getTime())}`;
      chrome.cookies.set({
            url: 'https://webchrometools.netlify.app',
            name: 'cpcUser',
            value: genUserID,
            path: '/',
            sameSite: 'strict'
          }, function(cookie) {
             console.log('Set uid');
       });
       chrome.storage.local.set({ 'NCPCID': genUserID }).then(() => {
            console.log("Your NCPC-id is: " + genUserID);
       });
      chrome.runtime.setUninstallURL(`https://webchrometools.netlify.app/#/review/cpcontestcalendar?u=${genUserID}`);
    }
});