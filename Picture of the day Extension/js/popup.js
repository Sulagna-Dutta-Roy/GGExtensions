function loadAPOD(url) {
  //Shows loader
  var loader = document.getElementById('loader');
  var apod = document.getElementById('apod');
  var internet = document.getElementById('internet');
  var loadingbox = document.getElementById('loadingbox');
  loader.style.display = "block";
  apod.style.display = "none";
  internet.style.display = "none";
  loadingbox.style.display = "initial";
  var internet = setTimeout(function(){document.getElementById('internet').style.display = "block"}, 5000);
  fetch(url)
  .then(response => response.json())
  .then(result => {
    if("copyright" in result) {
      document.getElementById('copyright').textContent = 'Image Credits: ' + result.copyright;
    }
    else {
      document.getElementById('copyright').textContent = 'Image Credits: ' + 'Public Domain';
    }
    if(result.media_type == "video") {
      document.getElementById('apod_img_id').style.display = 'none';
      document.getElementById('apod_vid_id').style.display = 'block';
      document.getElementById('apod_vid_id').src = result.url;
    }
    else {
      document.getElementById('apod_vid_id').style.display = 'none';
      document.getElementById('apod_img_id').style.display = 'block';
      document.getElementById('apod_img_id').src = result.url;
      document.getElementById('apod_img_id').alt = result.url;
      document.getElementById('apod_img_link').href = result.url;
    }
    //Updates share buttons
    var apodDate = result.date.split("-");
    apodDate = apodDate.join("").split("");
    apodDate.shift();
    apodDate.shift();
    apodDate = apodDate.join("");
    //Email
    var emailText = "mailto:?subject=" + result.title + " - Astronomy Picture of the Day" + "&body=" + result.explanation + "%0ALink to picture:%20" + result.url;
    document.getElementById("mailImage").href = emailText;
    //Twitter
    var tweetText = "https://twitter.com/intent/tweet?text=Check out this astronomy picture of the day:%20" + "http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html";
    document.getElementById("tweetImage").href = tweetText;
    //Facebook
    var fbText = "https://www.facebook.com/share.php?u=http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html";
    document.getElementById("facebookImage").href = fbText;
    //Diaspora*
    var dspText = "https://sharetodiaspora.github.io/?title=" + result.title + " - Astronomy Picture of the Day" + "&url=http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html";
    document.getElementById("diasporaImage").href = dspText;
    //Mastodon
    var mdnText = "https://www.addtoany.com/add_to/mastodon?linkurl=http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html" + "&linkname=" + result.title + " - Astronomy Picture of the Day";
    document.getElementById("mastodonImage").href = mdnText;

    //Add Title and explaination
    document.getElementById('apod_explaination').textContent = result.explanation;
    document.getElementById('apod_title').textContent = result.title;
    //Sets the date in the input box to the APOD date being viewed
    document.getElementById('date').value = result.date;
    //Hides next button when viewing today's picture
    if (days == 0) {
      document.getElementById("nextButton").style.display = "none";
    } else {
      document.getElementById("nextButton").style.display = "inline";
    }
    //Hides loader and displays image and information
    apod.style.display = "block";
    loader.style.display = "none";
    loadingbox.style.display = "none";
    clearTimeout(internet);
  });

}

var shareOptions = document.getElementById("shareOptions");
function showSharing() {
    if (shareOptions.style.display != 'block') {
        shareOptions.style.display = 'block';
    } else {
        shareOptions.style.display = 'none';
    }
}
document.getElementById("share").addEventListener("click", showSharing);
document.getElementById("apod").addEventListener("click", function(){
  shareOptions.style.display = 'none';
});

//Sets image to today
var days = 0;
//Gets date from days from current date
function getYesterdaysDate() {
    var date = new Date()
    date.setTime(date.getTime() + (days * (24*60*60*1000)));  // date.setTime takes milliseconds, to turns the days into milliseconds as well

    // Timezone
    var localeOptions = {
      timeZone: "America/New_York"
    }

    // Gets years, months and days in seperate functions, and then concatenates the array to a single string with dashes between
    var dateString = [
      date.toLocaleDateString("en-US", {...localeOptions, year: "numeric"}),
      date.toLocaleDateString("en-US", {...localeOptions, month: "2-digit"}),
      date.toLocaleDateString("en-US", {...localeOptions, day: "2-digit"})
    ].join("-");

    return dateString;
}

function lastImage() {
  //Hide sharing options if Open
  shareOptions.style.display = "none";
  days = days - 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
}
function nextImage() {
  //Hide sharing options if Open
  shareOptions.style.display = 'none';
  days = days + 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
}

//Deafult URL for today's picture
var url = 'https://api.nasa.gov/planetary/apod?api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';

//Request today's picture
loadAPOD(url);

//Patch for very odd bug
document.getElementById("controls").style.display = "none";
document.getElementById('back').style.display = "inline";
document.getElementById("controls").style.display = "inline";
document.getElementById('back').style.display = "none";
//End patch

//Gets previous picture
document.getElementById("backButton").addEventListener("click", lastImage);
//Gets next picture
document.getElementById("nextButton").addEventListener("click", nextImage);
//Custom date send button
document.getElementById("sendButton").addEventListener("click", function(){
  document.getElementById("controls").style.display = "none";
  document.getElementById('back').style.display = "inline";
  //Gets date in input box
  var datetoo = document.getElementById("date").value;
  //Requests image for the date
  url = 'https://api.nasa.gov/planetary/apod?date=' + datetoo + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//Feature to return to previous picture after typing in a manual one
document.getElementById("back").addEventListener("click", function(){
  //This shows the normal controls and hides the back button
  document.getElementById("controls").style.display = "inline";
  document.getElementById('back').style.display = "none";
  //Requests last seen image
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});

//Makes scrolling in popup hide sharing buttons (patch)
window.onscroll = function () {
  shareOptions.style.display = 'none';
};
