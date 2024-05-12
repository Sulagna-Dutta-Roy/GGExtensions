window.onload = function() {
    // This function is triggered when the window is loaded
    console.log("started");
    var m1title = document.getElementById("m1title");
    var m2title = document.getElementById("m2title");
    var uid1;
    var uid2;

    // Fetching data from the cricket API
    fetch("https://cricapi.com/api/cricket/Wh4CFtViqVbDCgaYC61AIw45UUM2")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var m1t = data.data[0].title;
            var m2t = data.data[1].title;
            m1title.textContent = m1t;
            m2title.textContent = m2t;
            uid1 = data.data[0].unique_id;
            uid2 = data.data[1].unique_id;
            getscore1(uid1); // Call to function to get score for Upcoming matches
            getscore2(uid2); // Call to function to get score for Ongoing Matches
        })
        .catch(() => {
            var error = document.getElementById("error");
            error.textContent = "Error Occurred!";
        });
}

// Function to get score for Upcoming matches
function getscore1(uid) {
    var m1score = document.getElementById("m1score");
    fetch("https://cricapi.com/api/cricketScore/Wh4CFtViqVbDCgaYC61AIw45UUM2?unique_id=" + uid)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var score = data.stat;
            m1score.textContent = score;
        })
        .catch(() => {
            var error = document.getElementById("error");
            error.textContent = "Error Occurred!";
        });
}

// Function to get score for Ongoing Matches
function getscore2(uid) {
    var m2score = document.getElementById("m2score");
    fetch("https://cricapi.com/api/cricketScore/Wh4CFtViqVbDCgaYC61AIw45UUM2?unique_id=" + uid)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var score = data.stat;
            m2score.textContent = score;
        })
        .catch(() => {
            var error = document.getElementById("error");
            error.textContent = "Error Occurred!";
        });
}

// Function to refresh the page
document.getElementById('refresh').onclick = function() {
    history.go(0);
};
