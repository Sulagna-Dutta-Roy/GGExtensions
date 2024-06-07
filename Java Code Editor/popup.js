document.addEventListener('DOMContentLoaded', function() {
    const javaEditorLink = document.getElementById('java-editor-link');
    javaEditorLink.addEventListener('click', function() {
      chrome.tabs.create({ url: "https://www.onlinegdb.com/online_java_compiler" });
    });
  });
  