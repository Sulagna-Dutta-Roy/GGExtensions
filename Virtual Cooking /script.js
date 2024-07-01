/********** GAMEPLAY SPECIFIC JAVASCRIPT **********/
//This function resets the entire game and includes everything that needs to be reset, including updating the numbers. This will be different for each game
var restartGame = function () {
  document.getElementById("outro-container").style.display = "none";
  relocateoj();
};
// CALL THIS WHEN THE USER FINISHES PLAYING YOUR BUILD
// this sends the user to the end of the game if the retry is clicked and the dl is not clicked
var finishGameplay = function () {
  if (typeof gotoEndScreen != "undefined") {
    //this is a function in the engineering templates and will only work once this project is uploaded to the UI
    gotoEndScreen();
    //report that the user has finished the game
    if (typeof mn != "undefined") {
      mn("play", "100%");
    }
  } else {
    displayInstallScreen();
  }
};
/********** GAMEPLAY SPECIFIC JAVASCRIPT **********/

/********** EXAMPLE JAVASCRIPT **********/

/* when you feel you need global variables define them within a global object so as not to clutter the global namespace*/

var click = 0;
var cookclickable = true;
var signal;

var cooking = function () {
  var lady = document.getElementById("lady");
  var requestcake = document.getElementById("requestcake");
  var greenbar = document.getElementById("greenbar");
  var pinkbar = document.getElementById("pinkbar");
  var coinhint = document.getElementById("coinhint");
  var chef = document.getElementById("chef");
  var cake = document.getElementById("cake");
  var cakepan = document.getElementById("cakepan");
  var cakebatter = document.getElementById("cakebatter");
  var cooking = document.getElementById("cooking");
  var checkmark = document.getElementById("checkmark");
  var target = document.getElementById("target");
  var tutarrow = document.getElementById("tutarrow");
  var signalarrow = document.getElementById("signalarrow");
  var box = document.getElementById("box");
  var speechlady = document.getElementById("speechlady");
  var text = document.getElementById("text");
  var tutorial = document.getElementById("tutorial");
  var frame = document.getElementById("frame");
  var proces = document.getElementById("proces");
  var smallboard = document.getElementById("smallboard");

  click++;
  clearTimeout(signal);
  signalarrow.className = "";
  console.log(click);
  console.log(cookclickable);

  if (click == 1 || click == 8) {
    tutorial.style.opacity = "0";
    cakepan.className = "cakepan bounce";
    checkmark.className = "check";
    if (click == 8) {
      chef.className = "walk walk2";
    } else {
      chef.className = "walk";
    }
    setTimeout(function () {
      setTimeout(function () {
        cookclickable = true;
      }, 100);
      if (click == 8) {
        tutorial.style.opacity = "0";
        signal = setTimeout(function () {
          signalarrow.className = "arrow arrow2";
        }, 5000);
      } else {
        tutorial.style.opacity = "1";
        tutarrow.className = "arrow arrow2";
      }
      chef.className = "panhand";
      checkmark.className = "";
      target.className = "target target2";
      text.innerHTML = "Pick up the strawberry cake batter.";
      box.className = "box box2";
    }, 1000);
  }

  if (click == 2 || click == 9) {
    cakebatter.className = "cakebatter bounce";
    chef.className = "batterhand";
    setTimeout(function () {
      cookclickable = true;
    }, 100);
    target.className = "target target3";
    box.className = "box box3";
    if (click == 9) {
      signal = setTimeout(function () {
        signalarrow.className = "arrow arrow3";
      }, 5000);
    } else {
      tutarrow.className = "arrow arrow3";
    }
    text.innerHTML = "Put them both into the oven.";
  }

  if (click == 3 || click == 10) {
    frame.className = "frame";
    proces.className = "process";
    cooking.className = "baking";
    chef.className = "stand stand2";
    checkmark.className = "check check2";
    speechlady.className = "speechlady speechlady2";
    tutarrow.className = "";
    text.innerHTML = "The strawberry cake is baking.";
    setTimeout(function () {
      smallboard.className = "smallboard";
      cake.className = "berrycake small";
      checkmark.className = "";
      frame.className = "";
      proces.className = "";
      cooking.className = "";
      if (click == 10) {
        signal = setTimeout(function () {
          signalarrow.className = "arrow arrow3";
        }, 5000);
      }
      target.className = "target target4";
      text.innerHTML = "It's done! Take it out of the oven.";
      setTimeout(function () {
        cookclickable = true;
      }, 100);
    }, 5000);
  }

  if (click == 4 || click == 11) {
    smallboard.className = "";
    chef.className = "panhand";
    cake.className = "berrycake berrycake2";
    setTimeout(function () {
      target.className = "target target5";
      if (click == 11) {
        signal = setTimeout(function () {
          signalarrow.className = "arrow arrow5";
        }, 5000);
      } else {
        tutarrow.className = "arrow arrow5";
      }
      text.innerHTML = "Frost the cake with chocolate buttercream!";
      setTimeout(function () {
        cookclickable = true;
      }, 100);
    }, 300);
  }

  if (click == 5 || click == 12) {
    chef.className = "walkright";
    checkmark.className = "check check3";
    cake.className = "berrycake berrycake2";
    tutorial.style.opacity = "0";
    setTimeout(function () {
      if (click == 12) {
        tutorial.style.opacity = "0";
      } else {
        tutorial.style.opacity = "1";
      }
      cake.className = "";
      frame.className = "frame frame2";
      proces.className = "process";
      cooking.className = "frosting";
      chef.className = "stand stand3";
      checkmark.className = "";
      target.className = "target target6";
      tutarrow.className = "";
      text.innerHTML = "Wait for it to get frosted...";
    }, 1000);
    setTimeout(function () {
      frame.className = "";
      proces.className = "";
      checkmark.className = "smallboard smallboard2";
      cooking.className = "chococake small";
      target.className = "target target7";
      if (click == 12) {
        signal = setTimeout(function () {
          signalarrow.className = "arrow arrow7";
        }, 5000);
      } else {
        tutarrow.className = "arrow arrow7";
      }
      text.innerHTML = "It's done! Grab that cake!";
      setTimeout(function () {
        cookclickable = true;
      }, 100);
    }, 6200);
  }

  if (click == 6 || click == 13) {
    checkmark.className = "";
    cooking.className = "";
    chef.className = "panhand panhand2";
    cake.className = "chococake chococake2";
    setTimeout(function () {
      target.className = "target target8";
      if (click == 13) {
        signal = setTimeout(function () {
          signalarrow.className = "arrow arrow8";
        }, 5000);
      } else {
        tutarrow.className = "arrow arrow8";
      }
      speechlady.className = "speechlady";
      box.className = "box box4";
      text.className = "text";
      text.innerHTML = "Serve it to her!";
      setTimeout(function () {
        cookclickable = true;
      }, 100);
    }, 200);
  }

  if (click == 7 || click == 14) {
    cake.className = "chococake chococake3";
    chef.className = "walkup";
    checkmark.className = "check check4";
    document.getElementById("board").className = "";
    tutorial.style.opacity = "0";
    setTimeout(function () {
      cake.className = "";
      checkmark.className = "";
      chef.className = "stand stand4";
      requestcake.style.opacity = "0";
      lady.className = "happylady";
      document.getElementById("coin1").className = "coin";
      document.getElementById("heart1").className = "heart";
      setTimeout(function () {
        document.getElementById("coin2").className = "coin";
        document.getElementById("heart2").className = "heart";
      }, 230);
      setTimeout(function () {
        document.getElementById("coin3").className = "coin";
        document.getElementById("heart3").className = "heart";
      }, 310);
      setTimeout(function () {
        document.getElementById("coin4").className = "coin";
        document.getElementById("heart4").className = "heart";
      }, 450);
      setTimeout(function () {
        document.getElementById("coin5").className = "coin";
        document.getElementById("heart5").className = "heart";
        if (click == 14) {
          greenbar.className += " green2";
          pinkbar.className += " pink2";
        } else {
          greenbar.className += " green";
          pinkbar.className += " pink";
        }
      }, 580);
    }, 1200);

    setTimeout(function () {
      if (click == 14) {
        tutorial.style.opacity = "0";
        finishGameplay();
      } else {
        tutorial.style.opacity = "1";
        document.getElementById("board").className = "board";
        requestcake.style.opacity = "1";
        lady.className = "lady";
      }
      tutarrow.className = "";
      box.className = "box box5";
      target.className = "target target9";
      text.className = "text text2";
      text.innerHTML =
        "The Trapeze Artist is back for more cake. You know what to do!";
    }, 3000);

    setTimeout(function () {
      for (var i = 1; i < 7; i++) {
        var coins = "coin" + i;
        document.getElementById(coins).className = "";
      }
      for (var i = 1; i < 7; i++) {
        var hearts = "heart" + i;
        document.getElementById(hearts).className = "";
      }
      cakepan.className = "cakepan";
      cakebatter.className = "cakebatter";
      tutorial.style.opacity = "0";
      target.className = "target";
      cookclickable = true;
      signal = setTimeout(function () {
        signalarrow.className = "arrow";
      }, 5000);
    }, 6000);
  }

  if (click === 4) {
    if (typeof mn != "undefined") {
      mn("play", "25%");
    }
  }

  if (click === 8) {
    if (typeof mn != "undefined") {
      mn("play", "50%");
    }
  }

  if (click === 12) {
    if (typeof mn != "undefined") {
      mn("play", "75%");
    }
  }
};

var clickcooking = function () {
  if (cookclickable == true) {
    cooking();
    cookclickable = false;
    console.log(cookclickable);
  }
};

var relocateoj = function () {
  click = 0;
  clearTimeout(signal);
  signalarrow.className = "";
  tutorial.style.opacity = "1";
  target.className = "target";
  box.className = "box";
  text.className = "text";
  tutarrow.className = "arrow";
  chef.className = "stand";
  frame.className = "";
  proces.className = "";
  cake.className = "";
  checkmark.className = "";
  cooking.className = "";
  cakepan.className = "cakepan";
  cakebatter.className = "cakebatter";
  text.innerHTML = "Grab that round cake pan.";
  greenbar.style.width = "0px";
  pinkbar.style.width = "0px";
  smallboard.className = "";
};

/* this code is example code filled with hopefully useful bits of javascript you can reference */
/* please feel free to adjust the and add to these code snippets to make future project easier */
/* DELETE THIS CODE WHEN YOU ARE DONE WITH YOUR PROJECT */

/********** EXAMPLE JAVASCRIPT **********/

/********** OUTRO SPECIFIC JAVASCRIPT **********/

displayInstallScreen = function () {
  document.getElementById("outro-container").style.display = "block";
  document.getElementById("top-button").className = "mng-install-dl";
  document.getElementById("top-button").onclick = clickDownload;
  document.getElementById("bottom-button").className = "mng-install-thanks";
  document.getElementById("bottom-button").onclick = clickDownload;
  document.getElementById("dl-div").className = "mng-install-click-url";
};

// this sends the user to the itunes page where they can download the game. It also is compatable with our UI
var clickDownload = function () {
  window.location.href =
    "https://itunes.apple.com/us/app/bakery-blitz-cooking-game/id1036859032?mt=8";
};
/********** OUTRO SPECIFIC JAVASCRIPT **********/
