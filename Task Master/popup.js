document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('tasks');

    const loadTasks = () => {
        try{ 
        chrome.storage.sync.get(['tasks'], (result) => {
            const tasks = result.tasks || [];
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                addTaskToDOM(task);
            });
        });
    }catch(err){
        let data=JSON.parse(localStorage.getItem('tasks')) 
        if(data){
        data.forEach(task=>{
            addTaskToDOM(task) 
        })
    }
    }
    }; 
    const saveDetails=(taskInput,priority)=>{
        try{
            let data=JSON.parse(chrome.storage.sync.get(['tasks'])) || []
            let details={
                text:taskInput,
                completed: false,
                priority:priority
            }
            if(data){ 
                    data.push(details);  
            }
            else{ 
                    data.push(details);  
            } 
            chrome.storage.sync.set({ data });
        }catch(err){
        let data=JSON.parse(localStorage.getItem('tasks')) || []
        let details={
            text:taskInput,
            completed: false,
            priority:priority
        }
        if(data){ 
                data.push(details); 
                localStorage.setItem('tasks',JSON.stringify(data))
        }
        else{ 
                data.push(details); 
            localStorage.setItem('tasks',JSON.stringify(data))
        } 
        addTaskToDOM(details)
    }
    }
    const saveTasks = () => { 
        try{ 
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                priority: li.dataset.priority
            });
        });
        chrome.storage.sync.set({ tasks });
    }
    catch(err){
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                priority: li.dataset.priority
            });
        });
        localStorage.setItem('tasks',JSON.stringify(tasks)) 
    }
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
        li.appendChild(deleteButton);
        taskList.appendChild(li)
    }
    loadTasks()
    addTaskButton.addEventListener('click',()=>{
        const taskInput = document.getElementById('new-task').value;
       const prioritySelect = document.getElementById('priority').value;
        saveDetails(taskInput,prioritySelect)
    })
}
)
 
