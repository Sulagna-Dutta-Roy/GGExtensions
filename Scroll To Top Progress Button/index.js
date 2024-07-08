// Select the scrollToTop element
var scrollToTop = document.querySelector(".scrollToTop");

// Function to calculate the scroll value and update the scrollToTop button
function calcScrollValue() {
    let pos = document.body.scrollTop || document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let percentval = Math.round((pos * 100) / calcHeight);

    if (pos > 100) {
        scrollToTop.style.display = "flex";
    } else {
        scrollToTop.style.display = "none";
    }

    scrollToTop.style.background = `conic-gradient(#28CEF7 ${percentval}%, white ${percentval}%)`;
}

// Add click event listener to scrollToTop button
scrollToTop.addEventListener("click", function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
});

// Call calcScrollValue on scroll and on load
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;
