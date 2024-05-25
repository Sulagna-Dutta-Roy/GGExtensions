const todoListIcon = document.querySelector("#todoList");
todoListIcon.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../HTML/todoList.html";
});

// Select all list items
const listItems = document.querySelectorAll('#list-container li');

// Add click event listener to each list item
listItems.forEach(item => {
    item.addEventListener('click', () => {
        // Toggle the 'checked' class
        item.classList.toggle('checked');

        // Select the circle symbol
        const circle = item.querySelector('::before');

        // Toggle the visibility of the circle
        if (item.classList.contains('checked')) {
            circle.style.opacity = 0; // Hide the circle
        } else {
            circle.style.opacity = 1; // Show the circle
        }
    });
});

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
document.getElementById("add-task-btn").addEventListener("click", function(){
   addTask();
});

let totalTasks = 0;
function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }else{
        totalTasks++;
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

let completedTasks = 0;
listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
        completedTasks++;
    }else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData(){
    localStorage.setItem("to-do-list", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("to-do-list");
}

showTask();


// Calculate the total number of tasks added and completed (replace with actual data)
const totalTasksAdded = totalTasks; //localStorage.getItem("totalTasksAdded") || 0;
const totalTasksCompleted = completedTasks; //localStorage.getItem("totalTasksCompleted") || 0;

// Calculate the percentage of tasks completed
const percentageCompleted = (totalTasksCompleted / totalTasksAdded) * 100;

