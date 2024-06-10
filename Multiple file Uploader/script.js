document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector(".file-browse-input");
    const browseButton = document.querySelector(".file-browse-button");
    const fileUploadBox = document.querySelector(".file-upload-box");
    const fileList = document.querySelector(".file-list");
    const fileCompletedStatus = document.querySelector(".file-completed-status");
  
    browseButton.addEventListener("click", () => {
      fileInput.click();
    });
  
    fileInput.addEventListener("change", () => {
      handleFiles(fileInput.files);
    });
  
    fileUploadBox.addEventListener("dragover", (event) => {
      event.preventDefault();
      fileUploadBox.classList.add("active");
    });
  
    fileUploadBox.addEventListener("dragleave", () => {
      fileUploadBox.classList.remove("active");
    });
  
    fileUploadBox.addEventListener("drop", (event) => {
      event.preventDefault();
      fileUploadBox.classList.remove("active");
      handleFiles(event.dataTransfer.files);
    });
  
    function handleFiles(files) {
      for (const file of files) {
        const fileSize = (file.size / 1024).toFixed(2); // Convert size to KB
        const li = document.createElement("li");
        li.classList.add("file-item");
  
        const fileExtension = file.name.split('.').pop().toUpperCase();
  
        li.innerHTML = `
          <div class="file-extension">${fileExtension}</div>
          <div class="file-content-wrapper">
            <div class="file-content">
              <span class="file-name">${file.name}</span>
              <div class="file-info">
                <small>${fileSize} KB</small>
                <small class="file-status">Uploading...</small>
              </div>
              <button class="cancel-button">&times;</button>
            </div>
            <div class="file-progress-bar">
              <div class="file-progress"></div>
            </div>
          </div>
        `;
        fileList.appendChild(li);
  
        const formData = new FormData();
        formData.append("file", file);
  
        fetch("upload.php", {
          method: "POST",
          body: formData,
        })
        .then(response => response.text())
        .then(data => {
          const fileStatus = li.querySelector(".file-status");
          const fileProgress = li.querySelector(".file-progress");
          fileStatus.textContent = "Uploaded";
          fileProgress.style.width = "100%";
          fileCompletedStatus.textContent = "Upload complete!";
        })
        .catch(error => {
          console.error("Error:", error);
          const fileStatus = li.querySelector(".file-status");
          fileStatus.textContent = "Upload failed.";
          fileCompletedStatus.textContent = "Upload failed.";
        });
      }
    }
  });
  
