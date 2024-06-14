document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;

    const task = {
        name: taskName,
        date: taskDate,
        time: taskTime
    };

    chrome.storage.sync.get({ tasks: [] }, function (result) {
        const tasks = result.tasks;
        tasks.push(task);
        chrome.storage.sync.set({ tasks: tasks }, function () {
            displayTasks();
            scheduleNotification(task);
        });
    });

    document.getElementById('task-form').reset();
});

function displayTasks() {
    chrome.storage.sync.get({ tasks: [] }, function (result) {
        const tasks = result.tasks;
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = '';

        tasks.forEach(function (task, index) {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.textContent = `${task.name} - ${task.date} ${task.time}`;
            tasksContainer.appendChild(taskDiv);
        });
    });
}

function scheduleNotification(task) {
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const now = new Date();

    const delay = taskDateTime.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(function () {
            chrome.notifications.create('', {
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Task Reminder',
                message: task.name,
                priority: 1
            });
        }, delay);
    }
}

displayTasks();