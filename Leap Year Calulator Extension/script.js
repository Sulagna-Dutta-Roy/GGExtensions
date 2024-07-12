document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkButton').addEventListener('click', check);
});

function check() {

    const year = document.getElementById("year").value;

   
    if (year === '') {
        alert("Please enter a year.");
        return;
    }


    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        document.getElementById("output-text").innerText = `${year} is a leap year.`;
    } else {
        document.getElementById("output-text").innerText = `${year} is not a leap year.`;
    }
}
