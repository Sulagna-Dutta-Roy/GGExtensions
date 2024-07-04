document.addEventListener('DOMContentLoaded', function() {
    const figmaLink = document.getElementById('figma-link');
    figmaLink.addEventListener('click', ()=> {
      chrome.tabs.create({ url: "https://www.figma.com/files/team/1271522887898539493/recents-and-sharing/recently-viewed?fuid=1271522886187338242" });
    });
  });
  