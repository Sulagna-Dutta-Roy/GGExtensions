const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

let editIndex = null;

inputBox.onkeyup = ()=>{
  let userEnteredValue = inputBox.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  }else{
    addBtn.classList.remove("active"); //unactive the add button
  }
}

showTasks(); 

addBtn.onclick = ()=>{ //when user click on plus icon button
  let userEnteredValue = inputBox.value; //getting input field value
  let getLocalStorageData = localStorage.getItem("New Todo"); //getting localstorage
  if(getLocalStorageData == null){ //if localstorage has no data
    listArray = []; //create a blank array
  }else{
    listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
  }
  if (editIndex !== null) {
    // Update the todo item
    listArray[editIndex] = userEnteredValue;
    editIndex = null;
  } else {
    // Add new todo item
    listArray.push(userEnteredValue); //pushing or adding new value in array
  }
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string
  showTasks(); //calling showTask function
  addBtn.classList.remove("active"); //unactive the add button once the task added
}

function showTasks(){
  let getLocalStorageData = localStorage.getItem("New Todo");
  if(getLocalStorageData == null){
    listArray = [];
  }else{
    listArray = JSON.parse(getLocalStorageData); 
  }
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
  if(listArray.length > 0){ //if array length is greater than 0
    deleteAllBtn.classList.add("active"); //active the delete button
  }else{
    deleteAllBtn.classList.remove("active"); //unactive the delete button
  }
  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += `<li data-index="${index}">${element}<span class="icon delete-btn"><i class="fas fa-trash"></i></span><span class="icon edit-icon"><i class="fas fa-edit"></i></span></li>`;
  });
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  inputBox.value = ""; //once task added leave the input field blank
}
// Event delegation for delete button
todoList.addEventListener("click", function(event) {
  const target = event.target;
  // Check if the click event targets the delete button icon directly
  if (target.classList.contains("fa-trash")) {
    // If so, retrieve the index of the todo item from its parent <li> element
    const index = target.closest("li").dataset.index;
    deleteTask(index);
  } else if (target.classList.contains("delete-btn")) {
    // If the click event targets the delete button container (orange square),
    // retrieve the index of the todo item from the closest parent <li> element
    const index = target.closest("li").dataset.index;
    deleteTask(index);
  }
  // Check if the click event targets the edit button icon directly
  if (target.classList.contains("fa-edit")) {
    const index = target.closest("li").dataset.index;
    editTask(index);
  } else if (target.classList.contains("edit-btn")) {
    const index = target.closest("li").dataset.index;
    editTask(index);
  }
});
// delete task function
function deleteTask(index){
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1); //delete or remove the li
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks(); //call the showTasks function
}

// edit task function
function editTask(index) {
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  inputBox.value = listArray[index]; // populate input field with the todo text
  editIndex = index; // set edit index
  addBtn.classList.add("active"); // activate the add button
}

// delete all tasks function
deleteAllBtn.onclick = ()=>{
  listArray = []; //empty the array
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
  showTasks(); //call the showTasks function
}

const closeIcon = document.getElementById("closeIcon");

// Add click event listener to close the popup
closeIcon.addEventListener("click", () => {
    window.close(); // Close the popup
});
