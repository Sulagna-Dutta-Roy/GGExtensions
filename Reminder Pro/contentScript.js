(()=>{
    let formMode = 'add';
    let updateObject = null;
    console.log('modal opened--->');

    window.addEventListener('DOMContentLoaded',async  () => {
        console.log('dom content loaded-->');
       await chrome.runtime.sendMessage({ action: 'getReminders' });
        
      });
    const form = document.getElementById('reminder-form');


    const reminderList = document.getElementById('reminder_list');
    const main_div_list = document.getElementById('main_list_div');
    console.log('form--->',form);
    form.addEventListener('submit',async function(event){

        event.preventDefault();
        const date_time_input = document.getElementById('datetime').value;
        const reminder_name = document.getElementById('reminder_name').value;
        //validate the input
        // if(!moment(date_time_input).isValid()){
        //     alert('invalid time input');
        //     return
        // }

        const contentScriptLoaded = new Promise((resolve) => {
        resolve();
        });

        // (async () => {
            setTimeout(async () => {
  
                try{
                    //const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                    console.log(formMode,'<----mode');
                    if(formMode==='add'){
                        await  chrome.runtime.sendMessage({
                            action:'addReminder',
                            reminder_name,
                            date_time_input
    
                        });

                    }else if(formMode==='update'){
                        //update
                        await  chrome.runtime.sendMessage({
                            action:'updateReminder',
                            id:updateObject.id,
                            reminder_name,
                            date_time_input
                        });
                        
                    }
                    form.reset();
                    if(formMode!=='add'){
                        formMode = 'add';
                        updateObject = null;
                        document.getElementById('btn_submit_reminder_pro_input_form').innerText = "Add Reminder";
                    }
                }
                catch(error){
                    console.log(error);
                }
            }, 100);
            
       
        

    })

    chrome.runtime.onMessage.addListener((message,sender,response)=>{
        console.log('--->message received',message);
        if(message.action==='remindersFetched'){
            main_div_list.innerHTML ='';
            if(message.reminders.length === 0){
                console.log('empty',message.reminders.length);
                document.getElementById('reminder_pro_no_reminder').style.display="flex";
            }else if(message.reminders.length > 0){
                console.log('here',message.reminders.length);
                document.getElementById('reminder_pro_no_reminder').style.display="none";
                message.reminders.forEach((reminderll) => {
                    addReminder(reminderll)
                   
                });
            }
           

        }
        else if(message.action==='reminderToUpdate'){
             document.getElementById('datetime').value =message.reminder_search.date_time_input;
             document.getElementById('reminder_name').value =message.reminder_search.reminder_name;
             formMode='update';
             updateObject = message.reminder_search;
             document.getElementById('btn_submit_reminder_pro_input_form').innerText = "Update Reminder";
             //update the button

        }
            
    })

    function addReminder(data){
        console.log('data lisitng-->',data);
            //add reminder
            const reminderItem = document.createElement('div');
            reminderItem.style.padding="10px 20px";
            reminderItem.style.border ="1px solid white";
            reminderItem.style.borderRadius="12px";
            reminderItem.style.display="flex";
            reminderItem.style.flexDirection="column";
            reminderItem.style.minWidth="80%";
            reminderItem.style.marginBottom="10px";
            reminderItem.style.alignSelf="center";
            
            reminderItem.innerHTML = `
            <div style="width: 100%;margin-bottom: 10px;">Reminder Name: ${data.reminder_name}</div>
            <div style="width: 100%;margin-bottom: 10px;">Reminder Time: ${data.date_time_input}</div>
            <div style="display: flex;justify-content: center;align-items: center;">
            <button style="min-width: 50px;padding: 5px 8px;border-radius: 10px;cursor: pointer;">Edit</button>
            <button id="${data.id}" style="min-width: 50px;padding: 5px 8px;border-radius: 10px;cursor: pointer;" >Delete</button>
            </div>
        `;
        main_div_list.appendChild(reminderItem);

        //handle edit
        const editButton = reminderItem.querySelector('button:nth-child(1)');
        editButton.addEventListener('click', async()=>{
            await chrome.runtime.sendMessage({action:'getReminder', id:data.id});
        })

        const deleteButton = reminderItem.querySelector('button:nth-child(2)');
        console.log(deleteButton,'<deletebtn>',editButton,'<editbutton>');
        deleteButton.addEventListener('click',async()=>{
            await chrome.runtime.sendMessage({action:'deleteReminder', id:data.id});
        })
    }



})();