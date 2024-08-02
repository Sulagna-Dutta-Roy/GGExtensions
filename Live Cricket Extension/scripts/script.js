window.onload = function() {
    // This function is triggered when the window is loaded
    console.log("started");
    var m1title = document.getElementById("m1title");

    // Fetching data from the cricket API
    fetch("https://api.cricapi.com/v1/matches?apikey=9df522d1-26ac-494c-9085-484911641a9f&offset=0")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Filter out matches that haven't started yet
            var upcomingMatches = data.data.filter(match => match.status === "Match not started");
            m1title.textContent = "Upcoming Matches: ";
            var matchList = document.createElement("ul");
            upcomingMatches.forEach(match => {
                var matchItem = document.createElement("li");
                matchItem.textContent = `${match.name} - ${match.date}`;
                matchList.appendChild(matchItem);
            });
            document.getElementById("match1").appendChild(matchList);
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
