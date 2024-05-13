chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var meaning = "";
  var count = 1;
  if (request.message[0] == "No Definitions Found") {
    swal("No Definitions Found");
  } else {
    request.message[0].forEach((element) => {
      meaning = meaning + `${count}. ` + `${element.definition}` + "\n";
      count = count + 1;
    });
    swal(`The meaning of the word ${request.message[1]} is`, meaning);
  }
});
