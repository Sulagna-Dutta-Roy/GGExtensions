document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const prioritySelect = document.getElementById('priority');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('tasks');

    const loadTasks = () => {
        chrome.storage.sync.get(['tasks'], (result) => {
            const tasks = result.tasks || [];
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                addTaskToDOM(task);
            });
        });
    };

    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                priority: li.dataset.priority
            });
        });
        chrome.storage.sync.set({ tasks });
    };

    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.dataset.priority = task.priority;
        li.classList.add(task.priority);
        if (task.completed) {
            li.classList.add('completed');
        }
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });
        li.appendChild(taskText);
        li.appendChild(deleteButton
