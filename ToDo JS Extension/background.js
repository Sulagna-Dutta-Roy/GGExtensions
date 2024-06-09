chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.clearAll();
    chrome.storage.local.get("tasks", (result) => {
      if (result.tasks) {
        result.tasks.forEach((task, index) => {
          if (task.timeAllocated > 0 && !task.completed) {
            let alarmTime = (task.startTime + task.timeAllocated * 60000) - Date.now();
            if (alarmTime > 0) {
              chrome.alarms.create(`alarm_${index}`, { delayInMinutes: alarmTime / 60000 });
            }
          }
        });
      }
    });
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    let taskIndex = alarm.name.split("_")[1];
    chrome.storage.local.get("tasks", (result) => {
      if (result.tasks) {
        let tasks = result.tasks;
        if (tasks[taskIndex] && !tasks[taskIndex].completed) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "logo.png",
            title: "Time's up!",
            message: `Time's up for task: ${tasks[taskIndex].text}`,
            priority: 2
          });
          tasks[taskIndex].timeAllocated = 0;
          chrome.storage.local.set({ tasks: tasks });
        }
      }
    });
  });
  