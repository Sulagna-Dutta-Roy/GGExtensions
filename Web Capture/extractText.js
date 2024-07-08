(function() {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  function extractText() {
    const text = document.body.innerText;
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    
    browserAPI.runtime.sendMessage({
      action: "downloadText",
      url: url,
      filename: 'extracted_text.txt'
    });
  }

  extractText();
})();