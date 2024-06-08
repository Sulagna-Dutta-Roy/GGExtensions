document.getElementById('navigate').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://app.powerbi.com/singleSignOn?pbi_source=websignup_getstarted_hero&culture=en-us&country=us&ru=https%3A%2F%2Fapp.powerbi.com%2F%3Fpbi_source%3Dwebsignup_getstarted_hero%26culture%3Den-us%26country%3Dus%26noSignUpCheck%3D1' });
  });
  