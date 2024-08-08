document.addEventListener('DOMContentLoaded', function() {
    const createGroupButton = document.getElementById('createGroup');
  
    createGroupButton.addEventListener('click', function() {
      chrome.tabs.query({ currentWindow: true }, function(tabs) {
        const groupId = Date.now().toString(); // Unique ID for the group
        tabs.forEach(tab => {
          chrome.tabs.group({ tabIds: tab.id, groupId: parseInt(groupId) }, function(groupId) {
            console.log(`Tab ${tab.id} added to group ${groupId}`);
          });
        });
        renderGroups();
      });
    });
  
    function renderGroups() {
      chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function(groups) {
        const groupsContainer = document.getElementById('groups');
        groupsContainer.innerHTML = ''; // Clear previous groups
  
        groups.forEach(group => {
          const groupElement = document.createElement('div');
          groupElement.className = 'group';
          groupElement.innerText = `Group ${group.id}`;
          groupsContainer.appendChild(groupElement);
        });
      });
    }
  
    renderGroups(); // Initial render of groups
  });
  