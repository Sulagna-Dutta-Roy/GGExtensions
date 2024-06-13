const inputBox = document.querySelector(".inputField input[type='text']");
const timeInput = document.querySelector(".inputField input[type='number']");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button"),
      todos=localStorage.getItem('stored'),
      add_todo=document.getElementById('add_todo');
let editIndex = null;

function handleRemove(index){
const todoList_con = document.querySelector(".todoList"),
       todos=JSON.parse(localStorage.getItem('stored'));
let childer=todoList_con.children[index]
todoList_con.removeChild(childer)
let finder_val=todos[index]
let todo=todos.filter(item =>item!==finder_val)
localStorage.setItem('stored',JSON.stringify(todo))
}
function handle_todoList(datas){
const todoList_con = document.querySelector(".todoList");
  datas.map((item,index) =>{
   let div=document.createElement('div')
   let p=document.createElement('p')
   let p2=document.createElement('p')
   let img=document.createElement('img')
   img.setAttribute('src','https://cdn-icons-png.flaticon.com/128/2732/2732657.png')
   img.setAttribute('alt','close')
   img.style.height="15px"
   img.style.width="15px"
   img.setAttribute('onClick', `handleRemove(${index})`);
   p.textContent=`${item.todo}`
   p.style.width="75%"
   p2.textContent=`${item.time} M`
   div.appendChild(p)
   div.appendChild(p2)
   div.appendChild(img)
   div.style.display="flex"
   div.style.width="100%"
   div.style.justifyContent="space-between"
   div.style.alignItems="center"
   todoList_con.appendChild(div)
  })
}
if(todos){
  let datas=JSON.parse(todos)
  handle_todoList(datas)
}
add_todo.addEventListener('click',()=>{
  const inputBox = document.querySelector(".inputField input[type='text']").value,
        timeInput = document.querySelector(".inputField input[type='number']").value;
  let data=localStorage.getItem('stored')
  if(data){
  let datas=JSON.parse(data)
  let userInputs={todo:inputBox,time:timeInput,Time:new Date().toISOString()}
  datas.push(userInputs)
  handle_todoList([{todo:inputBox,time:timeInput}])
  localStorage.setItem('stored',JSON.stringify(datas))
  }
  else{
    let datas=[{todo:inputBox,time:timeInput,Time:new Date().toISOString()}]
    localStorage.setItem('stored',JSON.stringify(datas))
  }
})
inputBox.onkeyup = () => {
  let userEnteredValue = inputBox.value; //getting user entered value
  if (userEnteredValue.trim() != 0) { 
    addBtn.classList.add("active"); //active the add button
  } else {
    addBtn.classList.remove("active"); //unactive the add button
  }
}

showTasks();

addBtn.onclick = () => { //when user click on plus icon button
  let userEnteredValue = inputBox.value; //getting input field value
  let timeAllocated = parseInt(timeInput.value) || 0; //getting time allocated value
  chrome.storage.local.get("tasks", (result) => {
    let tasks = result.tasks || [];
    const task = { text: userEnteredValue, completed: false, timeAllocated: timeAllocated, startTime: Date.now() };
    if (editIndex !== null) {
      tasks[editIndex] = task;
      editIndex = null;
    } else {
      tasks.push(task);
    }
    chrome.storage.local.set({ tasks: tasks }, () => {
      setTaskAlarms(tasks);
      showTasks();
    });
  });
  addBtn.classList.remove("active"); //unactive the add button once the task added
}

function setTaskAlarms(tasks) {
  chrome.alarms.clearAll();
  tasks.forEach((task, index) => {
    if (task.timeAllocated > 0 && !task.completed) {
      let alarmTime = (task.startTime + task.timeAllocated * 60000) - Date.now();
      if (alarmTime > 0) {
        chrome.alarms.create(`alarm_${index}`, { delayInMinutes: alarmTime / 60000 });
      }
    }
  });
}

function showTasks() {
  chrome.storage.local.get("tasks", (result) => {
    let tasks = result.tasks || [];
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = tasks.filter(task => !task.completed).length; //passing the array length in pendingtask
    if (tasks.length > 0) { //if array length is greater than 0
      deleteAllBtn.classList.add("active"); //active the delete button
    } else {
      deleteAllBtn.classList.remove("active"); //unactive the delete button
    }
    let newLiTag = "";
    tasks.forEach((element, index) => {
      newLiTag += `<li data-index="${index}" class="${element.completed ? 'completed' : ''}">
        ${element.text} (${element.timeAllocated} min)
        <span class="icon delete-btn"><i class="fas fa-trash"></i></span>
        <span class="icon edit-btn"><i class="fas fa-edit"></i></span>
        <span class="icon check-btn"><i class="fas fa-check"></i></span>
      </li>`;
    });
    todoList.innerHTML = newLiTag; 
    inputBox.value = ""; 
    timeInput.value = ""; 
  });
}

todoList.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("fa-trash") || target.classList.contains("delete-btn")) {
    const index = target.closest("li").dataset.index;
    deleteTask(index);
  } else if (target.classList.contains("fa-edit") || target.classList.contains("edit-btn")) {
    const index = target.closest("li").dataset.index;
    editTask(index);
  } else if (target.classList.contains("fa-check") || target.classList.contains("check-btn")) {
    const index = target.closest("li").dataset.index;
    toggleCompleteTask(index);
  }
});

function deleteTask(index) {
  chrome.storage.local.get("tasks", (result) => {
    let tasks = result.tasks || [];
    tasks.splice(index, 1); 
    chrome.storage.local.set({ tasks: tasks }, () => {
      setTaskAlarms(tasks);
      showTasks();
    });
  });
}

function editTask(index) {
  chrome.storage.local.get("tasks", (result) => {
    let tasks = result.tasks || [];
    inputBox.value = tasks[index].text; // populate input field with the todo text
    timeInput.value = tasks[index].timeAllocated; // populate input field with the time allocated
    editIndex = index; 
    addBtn.classList.add("active"); // activate the add button
  });
}

function toggleCompleteTask(index) {
  chrome.storage.local.get("tasks", (result) => {
    let tasks = result.tasks || [];
    tasks[index].completed = !tasks[index].completed; // toggle the completed status
    chrome.storage.local.set({ tasks: tasks }, () => {
      setTaskAlarms(tasks);
      showTasks();
    });
  });
}

deleteAllBtn.onclick = () => {
  chrome.storage.local.set({ tasks: [] }, () => {
    setTaskAlarms([]);
    showTasks();
  });
}

const closeIcon = document.getElementById("closeIcon");
closeIcon.addEventListener("click", () => {
  window.close(); // Close the popup
});
