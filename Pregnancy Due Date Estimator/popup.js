function calculateDueDate() {
   
    var lastMenstrualDate = document.getElementById("lastMenstrualDate").value;

   
    if (!lastMenstrualDate) {
        alert("Please enter the last menstrual period date.");
        return;
    }


    var dueDate = new Date(lastMenstrualDate);
    dueDate.setDate(dueDate.getDate() + 280); 

    // Display the result
    var formattedDueDate = dueDate.toDateString();
    document.getElementById("result").innerHTML = "Estimated Due Date: " + formattedDueDate;
}
