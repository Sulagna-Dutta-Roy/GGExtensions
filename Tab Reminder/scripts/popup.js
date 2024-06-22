let Reminds=[]
function getTimeInMinutes(time, unit) {
    return unit === 'hours' ? time * 60 : time;
}
document.getElementById('setReminder').addEventListener('click', () => {
    const time = parseInt(document.getElementById('time').value);
    const timeUnit = document.getElementById('timeUnit').value;
    const message = document.getElementById('message').value || 'Reminder!';

    if (isNaN(time) || time < 1) {
        alert('Please enter a valid time.');
        return;
    }

    const minutes = getTimeInMinutes(time, timeUnit);
    try{
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        const alarmName = `reminder-${tab.id}-${Date.now()}`;
        const reminder = {
            tabId: tab.id,
            title: tab.title,
            message,
            time: Date.now() + minutes * 60000
        };

        chrome.storage.local.set({ [alarmName]: reminder }, () => {
            chrome.alarms.create(alarmName, { delayInMinutes: minutes });
            alert(`Reminder set for ${tab.title} in ${time} ${timeUnit}.`);
            updateReminders();
        });
    });
    }catch(err){   
        let data={id:Reminds.length,time:`${minutes}${timeUnit}`,message:message,now:Date.now(),remindTime:Date.now()+minutes*6000}
        Reminds.push(data)
        updateReminders()
        setTimeout(()=>{
            Reminds.map(item=>{
                if(item.remindTime<Date.now()){ 
                    let li=document.getElementById(`reminder${item.remindTime}`)
                    const reminderList = document.getElementById('reminderList');
                    reminderList.removeChild(li) 
                    alert(`Reminder set for ${item.message} in ${item.time}.`);
                } 
            }) 
            Reminds=data
        },minutes*60000)
    }
});

function updateReminders() {
    try{
    chrome.storage.local.get(null, data => {
        const reminderList = document.getElementById('reminderList');
        reminderList.innerHTML = '';
        for (let key in data) {
            if (key.startsWith('reminder-')) {
                const reminder = data[key];
                const listItem = document.createElement('li');
                listItem.textContent = `${reminder.title}: ${reminder.message}`;
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.addEventListener('click', () => {
                    chrome.alarms.clear(key);
                    chrome.storage.local.remove(key, updateReminders);
                });
                listItem.appendChild(cancelButton);
                reminderList.appendChild(listItem);
            }
        }
    });
}
catch(err){
    if(Reminds.length>0){
     const reminderList = document.getElementById('reminderList');
     Reminds.map(item=>{
        let li=document.createElement('li')
        li.textContent=`Time:${item.time}  Mess:${item.message}`
        li.setAttribute('id',`reminder${item.remindTime}`)
        reminderList.appendChild(li)
     }) 
    }       
}
}

updateReminders();