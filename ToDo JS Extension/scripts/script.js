const inputBox = document.querySelector(".inputField input[type='text']");
const dateInput = document.querySelector(".inputField input[type='date']");
const timeInput = document.querySelector(".inputField input[type='time']");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

// Function to validate inputs and update button state
const validateInputs = () => {
  let userEnteredValue = inputBox.value.trim();
  
  if (userEnteredValue) {
    addBtn.classList.add("active");
    addBtn.disabled = false;
  } else {
    addBtn.classList.remove("active");
    addBtn.disabled = true;
  }
};

// Event listeners for input changes
[inputBox, dateInput, timeInput].forEach(input => {
  input.addEventListener("input", validateInputs);
});

showTasks(); // Call showTasks on page load

addBtn.onclick = () => { // When user clicks on the plus icon button
  let userEnteredValue = inputBox.value.trim();
  let dateEnteredValue = dateInput.value;
  let timeEnteredValue = timeInput.value;

  let getLocalStorageData = localStorage.getItem("New Todo");
  let listArray = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];

  let taskObj = {
    task: userEnteredValue,
    date: dateEnteredValue || "No Date", // Default to "No Date" if not provided
    time: timeEnteredValue || "No Time"  // Default to "No Time" if not provided
  };
  
  listArray.push(taskObj);
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks();
  addBtn.classList.remove("active");
  addBtn.disabled = true;
  inputBox.value = "";
  dateInput.value = "";
  timeInput.value = "";
};

function showTasks() {
  let getLocalStorageData = localStorage.getItem("New Todo");
  let listArray = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];
  
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = listArray.length;

  if (listArray.length > 0) {
    deleteAllBtn.classList.add("active");
    deleteAllBtn.disabled = false;
  } else {
    deleteAllBtn.classList.remove("active");
    deleteAllBtn.disabled = true;
  }
  
  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += `<li>${element.task} <span class="time">${element.date} ${element.time}</span><span class="icon delete-btn" data-index="${index}"><i class="fas fa-trash"></i></span></li>`;
  });
  todoList.innerHTML = newLiTag;
}

todoList.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    let index = event.target.dataset.index;
    deleteTask(index);
  }
});

function deleteTask(index) {
  let getLocalStorageData = localStorage.getItem("New Todo");
  let listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1);
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks();
}

deleteAllBtn.onclick = () => {
  localStorage.removeItem("New Todo");
  showTasks();
}

const closeIcon = document.getElementById("closeIcon");
closeIcon.addEventListener("click", () => {
  window.close();
});
