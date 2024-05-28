chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    console.log('received-->',message);
    chrome.storage.sync.get('reminders', async(data)=>{
        let reminders = data.reminders || [];
        if(message.action === 'addReminder'){
            console.log('mes--->',message);

            const reminderTime = new Date(message.date_time_input);

            // Calculate the delay for the alarm in milliseconds
            const delayInMs = reminderTime.getTime() - Date.now();

            // Enforce minimum delay (30 seconds to avoid spamming)
            const minimumDelay = 30000;
            const actualDelay = Math.max(delayInMs, minimumDelay);
            console.log('actual delay--->', actualDelay/(1000 * 60));
            // Create the alarm with reminder data
            const alarmId = Math.random().toString(36).substring(2);
            chrome.alarms.create(alarmId, { delayInMinutes: actualDelay / (1000 * 60) });

             //update the list
            reminders.push({id: Math.random().toString(36).substring(2),alarmId:alarmId,...message});
            chrome.storage.sync.set({ reminders });
            
            //update on popup
            await chrome.runtime.sendMessage({action:'remindersFetched',reminders});

        }
        else if(message.action==='deleteReminder'){
            const reminder_index = reminders.findIndex(r=>r.id === message.id);
            if(reminder_index!== -1){
                //clear alarm 
                let alarm_id =reminders[reminder_index].alarmId;
                if(alarm_id){
                    chrome.alarms.clear(alarm_id);
                }
                
                
                reminders.splice(reminder_index,1);
                chrome.storage.sync.set({reminders});
                await chrome.runtime.sendMessage({action:'remindersFetched',reminders});
            }

        }
        else if(message.action === 'updateReminder'){

            const reminder_index = reminders.findIndex(r=>r.id === message.id);
            if(reminder_index!== -1){   
                reminders[reminder_index].date_time_input  = message.date_time_input
                reminders[reminder_index].reminder_name  = message.reminder_name

                //update alarm
                if(reminders[reminder_index].date_time_input !== message.date_time_input){
                    //change alarm period
                    let alarm_id =reminders[reminder_index].alarmId;
                    if(alarm_id){
                        chrome.alarms.clear(alarm_id);
                    }

                    const reminderTime = new Date(message.date_time_input);

                    // Calculate the delay for the alarm in milliseconds
                    const delayInMs = reminderTime.getTime() - Date.now();

                    // Enforce minimum delay (30 seconds to avoid spamming)
                    const minimumDelay = 30000;
                    const actualDelay = Math.max(delayInMs, minimumDelay);
                    console.log('actual delay--->', actualDelay/(1000 * 60));
                    // Create the alarm with reminder data
                    const alarmId = Math.random().toString(36).substring(2);
                    chrome.alarms.create(alarmId, { delayInMinutes: actualDelay / (1000 * 60) });

                }
                // = {...reminders[reminder_index],...message.data}
                chrome.storage.sync.set({reminders})
                await chrome.runtime.sendMessage({action:'remindersFetched',reminders});
            }

        }
        else if(message.action === 'getReminder'){
            let reminder_search = reminders.find(r=>r.id === message.id);
            if(reminder_search){
                await chrome.runtime.sendMessage({action:'reminderToUpdate',reminder_search});
            }
        }
        else if(message.action === 'getReminders' ){
            console.log('getreminders-->');
            await chrome.runtime.sendMessage({action:'remindersFetched',reminders});
            //sendResponse({ action: 'remindersFetched', reminders });
        }
        else if(message.action === 'snooze'){

        }

    sendResponse({farewell: "goodbye"});

    })
})

chrome.alarms.onAlarm.addListener((alarmData) => {
    console.log('reminder called-->', alarmData);
    chrome.storage.sync.get('reminders', async(data)=>{
        let reminders = data.reminders || [];

        const reminder = reminders.find(r => r.alarmId === alarmData.name);
        if (reminder) {
          const notificationOptions = {
            type: "basic",
            iconUrl: "./images/wedding-bells_32.png", // Replace with your notification icon path
            title: "Reminder Pro",
            message: reminder.reminder_name,
            buttons:[{title:"ok"},{title:"snooze"}] 
          };
          chrome.notifications.create(alarmData.name, notificationOptions);
        }else{
            console.log('not found--->');
        }

    })
   
  });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     chrome.storage.sync.get('reminders', (data)=>{

//     })
//     if (message.action === 'getReminders') {
//       sendResponse({ action: 'remindersFetched', reminders });
//     } else {
//       // Handle other message actions (addReminder, delete, etc.)
//       // ... (rest of your code)
//     }
//   });

    //add initial reminders to popup script
// setTimeout(() => {
//     chrome.storage.sync.get('reminders', (data)=>{
//         let reminders = data.reminders || [];
//         chrome.runtime.sendMessage({action:'displayReminders',reminders});
//     })
    
// }, 100);
   
