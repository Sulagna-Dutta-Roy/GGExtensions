document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const saveFileButton = document.getElementById('saveFile');
    const fileList = document.getElementById('fileList');
    const downloadFileButton = document.getElementById('downloadFile');
  
    saveFileButton.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const content = e.target.result;
          chrome.storage.local.set({[file.name]: content}, function() {
            updateFileList();
          });
        };
        reader.readAsDataURL(file);
      }
    });
  
    downloadFileButton.addEventListener('click', () => {
      const selectedFile = fileList.value;
      if (selectedFile) {
        chrome.storage.local.get(selectedFile, function(result) {
          const content = result[selectedFile];
          const link = document.createElement('a');
          link.href = content;
          link.download = selectedFile;
          link.click();
        });
      }
    });
  
    function updateFileList() {
      chrome.storage.local.get(null, function(items) {
        fileList.innerHTML = '';
        for (let key in items) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = key;
          fileList.appendChild(option);
        }
      });
    }
  
    updateFileList();
  });
  