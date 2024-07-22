chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('reminder', { periodInMinutes: 1440 }); // 24 hours
  });
  
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'reminder') {
      chrome.storage.sync.get({ invoices: [] }, function(data) {
        const invoices = data.invoices;
        const pendingInvoices = invoices.filter(invoice => new Date(invoice.date) <= new Date(new Date().setDate(new Date().getDate() + 7)));
        if (pendingInvoices.length > 0) {
          chrome.notifications.create({
            type: 'basic',
            title: 'Pending Invoice Reminder',
            message: 'You have pending invoices. Please follow up.'
          });
        }
      });
    }
  });
  