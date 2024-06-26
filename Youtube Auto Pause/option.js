const options = {
    autopause: true,
    autoresume: true,
    scrollpause: false,
    lockpause: true,
    lockresume: true,
    focuspause: false,
    focusresume: false,
    disabled: false,
    cursorTracking: false,
  };
  
  var hosts = chrome.runtime.getManifest().host_permissions;
  for (var host of hosts) {
    options[host] = true;
  }
  
  // Saves options to chrome storage
  function save_options() {
    var storage = {};
  
    for (var option in options) {
      storage[option] = document.getElementById(option).checked;
    }
  
    chrome.storage.sync.set(storage, function () {});
  }
  
  // Restores options from chrome storage
  function restore_options() {
    chrome.storage.sync.get(options, function (items) {
      for (var option in items) {
        document.getElementById(option).checked = items[option];
      }
  
      for (var option in options) {
        document.getElementById(option).disabled = items.disabled;
        if (items.disabled) {
          document.getElementById("disabled").disabled = false;
        }
      }
    });
  }
  
  // Show shortcuts in the options window
  chrome.commands.getAll(function (commands) {
    var hotkeysDiv = document.getElementById("hotkeys");
    for (let i = 0; i < commands.length; i++) {
      if (
        commands[i].shortcut.length === 0 ||
        commands[i].description.length === 0
      ) {
        continue;
      }
      var tag = document.createElement("p");
      var text = document.createTextNode(
        commands[i].shortcut + " - " + commands[i].description
      );
      tag.appendChild(text);
      hotkeysDiv.appendChild(tag);
    }
  });
  
  function formatHostName(hostname) {
    return hostname.replace("https://", "").split("/")[0].replaceAll("*.", "");
  }
  
  var hostsDiv = document.getElementById("hosts");
  for (host of hosts) {
    var label = document.createElement("label");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = host;
    label.appendChild(checkbox);
    var span = document.createElement("span");
    span.className = "label-text";
    span.innerHTML = formatHostName(host);
    label.appendChild(span);
    hostsDiv.appendChild(label);
    checkbox.addEventListener("change", save_options);
  }
  
  // Show version in the options window
  var version = document.getElementById("version");
  version.innerHTML = "v" + chrome.runtime.getManifest().version;
  
  // Restore options on load and when they change in the store
  document.addEventListener("DOMContentLoaded", restore_options);
  chrome.storage.onChanged.addListener(function (_changes, _namespace) {
    restore_options();
  });
  
  // Listen to changes of options
  for (var option in options) {
    document.getElementById(option).addEventListener("change", save_options);
  }
  
  var coll = document.getElementsByClassName("collapsible_button");
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
  
  // Add event listener for the cursor tracking option
  document
    .getElementById("cursorTracking")
    .addEventListener("change", save_options);