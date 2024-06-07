document.addEventListener('DOMContentLoaded', function () {
    const formatButton = document.getElementById('format-button');
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const errorMessage = document.getElementById('error-message');
  
    formatButton.addEventListener('click', function () {
      const jsonString = jsonInput.value.trim();
      try {
        const json = JSON.parse(jsonString);
        const formattedJson = JSON.stringify(json, null, 2);
        jsonOutput.innerHTML = syntaxHighlight(formattedJson);
        errorMessage.textContent = '';
      } catch (e) {
        errorMessage.textContent = 'Invalid JSON: ' + e.message;
        jsonOutput.textContent = '';
      }
    });
  
    function syntaxHighlight(json) {
      json = json.replace(/(&)/g, '&amp;').replace(/(>)/g, '&gt;').replace(/(<)/g, '&lt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b(\d+)\b)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }
  });
  