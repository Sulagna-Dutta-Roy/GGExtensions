document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const tabList = document.getElementById("tabList");
  const saveSessionBtn = document.getElementById("saveSessionBtn");
  const clearSelectedBtn = document.getElementById("clearSelectedBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const sessionSavedMsg = document.getElementById("sessionSavedMsg");
  const sessionList = document.getElementById("sessionList");
  let loader=document.getElementById("preloader");
  window.addEventListener("load",function(){
     loader.style.display="none";
  })
  let sessionHistory = [];

  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      displayTab(tab);
    });
  });

  //To display the history
  chrome.storage.local.get("sessionHistory", function (data) {
    sessionHistory = data.sessionHistory || [];
    sessionHistory.forEach(function (session, index) {
      const li = document.createElement("li");
      const sessionLink = document.createElement("a");
      sessionLink.textContent = `Session ${index + 1}`;
      sessionLink.href = "#";
      sessionLink.addEventListener("click", function () {
        restoreSession(session);
      });
      li.appendChild(sessionLink);
      sessionList.appendChild(li);
    });
  });

  //For Searching tabs
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const tabs = Array.from(tabList.children);
    tabs.forEach(function (tab) {
      const title = tab.textContent.toLowerCase();
      if (title.includes(query)) {
        tab.style.display = "block";
      } else {
        tab.style.display = "none";
      }
    });
  });

  //Saving session
  saveSessionBtn.addEventListener("click", function () {
    const selectedTabs = getSelectedTabs();
    if (selectedTabs.length > 0) {
      sessionHistory.unshift(selectedTabs);
      sessionHistory = sessionHistory.slice(0, 2);
      chrome.storage.local.set({ sessionHistory: sessionHistory }, function () {
        console.log("Session saved.");
        sessionSavedMsg.style.display = "block";
        setTimeout(function () {
          sessionSavedMsg.style.display = "none";
        }, 3000);
      });
    }
  });

  clearSelectedBtn.addEventListener("click", function () {
    const tabs = Array.from(tabList.children);
    tabs.forEach(function (tab) {
      const checkbox = tab.querySelector("input[type='checkbox']");
      if (checkbox.checked) {
        tabList.removeChild(tab);
      }
    });
  });

  // Clearing all tabs
  clearAllBtn.addEventListener("click", function () {
    tabList.innerHTML = "";
  });

  // Get selected tabs
  function getSelectedTabs() {
    const tabs = [];
    const tabElements = Array.from(tabList.children);
    tabElements.forEach(function (tabElement) {
      const checkbox = tabElement.querySelector("input[type='checkbox']");
      if (checkbox.checked) {
        const link = tabElement.querySelector("a");
        tabs.push({ url: link.href, title: link.textContent });
      }
    });
    return tabs;
  }

  function displayTab(tab) {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);
    const link = document.createElement("a");
    link.textContent = tab.title;
    link.href = tab.url;
    link.target = "_blank";
    li.appendChild(link);
    tabList.appendChild(li);
  }

  // Restoring prev
  function restoreSession(session) {
    tabList.innerHTML = "";
    session.forEach(function (tab) {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      li.appendChild(checkbox);
      const link = document.createElement("a");
      link.textContent = tab.title;
      link.href = tab.url;
      link.target = "_blank";
      li.appendChild(link);
      tabList.appendChild(li);
    });
  }

  sessionSavedMsg.style.display = "none";
});
