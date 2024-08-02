document.addEventListener('DOMContentLoaded', () => {
    fetch('tags.json')
      .then(response => response.json())
      .then(tags => {
        const dropdown = document.getElementById('htmlTagDropdown');
        const syntaxDisplay = document.getElementById('syntaxDisplay');
        const exampleDisplay = document.getElementById('exampleDisplay');
  
        tags.forEach(tag => {
          const option = document.createElement('option');
          option.value = tag.name;
          option.textContent = tag.name;
          dropdown.appendChild(option);
        });
  
        dropdown.addEventListener('change', (event) => {
          const selectedTag = event.target.value;
          const tagInfo = tags.find(tag => tag.name === selectedTag);
          if (tagInfo) {
            syntaxDisplay.textContent = tagInfo.syntax;
            exampleDisplay.innerHTML = tagInfo.example;
          }
        });
      });
  });
  