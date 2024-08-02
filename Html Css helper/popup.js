document.addEventListener('DOMContentLoaded', function() {
  const htmlTagSelect = document.getElementById('html-tag');
  const cssPropertySelect = document.getElementById('css-property');
  const syntaxDiv = document.getElementById('syntax');
  const resultDiv = document.getElementById('result');

  // Fetch data from JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const { htmlTags, cssProperties } = data;

      // Populate HTML tag select
      htmlTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        htmlTagSelect.appendChild(option);
      });

      // Populate CSS property select
      cssProperties.forEach(property => {
        const option = document.createElement('option');
        option.value = property.property;
        option.textContent = `${property.property} (${property.value})`;
        option.dataset.value = property.value;
        cssPropertySelect.appendChild(option);
      });

      // Update content based on selections
      function updateContent() {
        const selectedTag = htmlTagSelect.value;
        const selectedProperty = cssPropertySelect.value;
        const selectedValue = cssPropertySelect.selectedOptions[0].dataset.value;

        const syntax = `<${selectedTag} style="${selectedProperty}: ${selectedValue};">Content</${selectedTag}>`;
        const result = document.createElement(selectedTag);
        result.style[selectedProperty] = selectedValue;
        result.textContent = 'Content';

        syntaxDiv.textContent = syntax;
        resultDiv.innerHTML = '';
        resultDiv.appendChild(result);
      }

      htmlTagSelect.addEventListener('change', updateContent);
      cssPropertySelect.addEventListener('change', updateContent);

      // Initialize content
      updateContent();
    })
    .catch(error => console.error('Error loading JSON:', error));
});
