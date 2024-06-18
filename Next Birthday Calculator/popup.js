document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateRemainingDays);
});

function calculateRemainingDays() {
    const birthdayInput = document.getElementById('birthday').value;
    if(!birthdayInput){
      alert("Please entter your birthday");
      return;
    }
    const birthday = new Date(birthdayInput);
    const today = new Date();
    console.log("today: " + today);

    // Adjust birthday year to current year
    birthday.setFullYear(today.getFullYear());
    
    // If birthday has already passed this year, set it to next year
    if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
    }
    
    const timeDiff = birthday.getTime() - today.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = "Remaining days until your next birthday: " + daysDiff;
}