document.addEventListener('DOMContentLoaded',function (){
    //dom loaded 
    const form = document.getElementById('reminder-form');


    const reminderList = document.getElementById('reminder_list');
    form.addEventListener('submit',function(event){

        event.preventDefault();
        const date_time_input = document.getElementById('datetime').value;
        const reminder_name = document.getElementById('reminder_name').value;
        //validate the input
        // if(!moment(date_time_input).isValid()){
        //     alert('invalid time input');
        //     return
        // }

        (async () => {
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            const response = await chrome.tabs.sendMessage(tab.id, {
                action:'addReminder',
                reminder_name,
                date_time_input
    
            });
            // do something with response here, not outside the function
            console.log(response);
          })();
        // chrome.runtime.sendMessage({
        //     action:'addReminder',
        //     reminder_name,
        //     date_time_input

        // })
        
        //addReminder(date_time_input.value, reminder_name.value);
        form.reset();
    })

    chrome.runtime.onMessage.addListener((message)=>{
        if(message.action==='displayReminders'){
            reminderList.innerHTML ='';
            message.reminders.forEach((reminderll) => {
                message.reminders.forEach((reminder) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = reminder.name;
                    // Add snooze/dismiss buttons here (exercise)
                    reminderList.appendChild(listItem);
                  });
            });

        }
            
    })

    function addReminder(date_time_value, reminder_value){
        //add reminder
        const reminderItem = document.createElement('li');
        reminderItem.innerHTML = `<div class="w-100 d-flex flex-row div_item"><span class="mr-2">${reminder_value}</span><span>${date_time_value}</span></div>`;
        reminderList.appendChild(reminderItem);
    }

});

