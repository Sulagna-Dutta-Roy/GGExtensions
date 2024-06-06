// Remove existing inspector if present
if (document.getElementById('css-inspector')) {
    document.getElementById('css-inspector').remove();
  }
  
  // Insert CSS Inspector UI
  const inspectorHTML = `
    <div id="css-inspector" class="container-fluid" style="position: fixed; top: 0; right: 0; width: 350px; height: 100vh; background: white; border-left: 1px solid #ddd; z-index: 10000; padding: 10px; overflow-y: auto;">
      <h4>CSS Inspector</h4>
      <div class="input-group mb-3">
        <input type="text" class="form-control" id="css-property" placeholder="Search property">
      </div>
      <div class="form-group">
        <label for="css-value">Value</label>
        <input type="text" class="form-control" id="css-value">
      </div>
      <button id="apply-css" class="btn btn-primary mb-3">Apply</button>
      <button id="pick-color" class="btn btn-secondary mb-3">Color Picker</button>
      <div id="color-picker" class="input-group mb-3" style="display: none;">
        <input type="color" id="color-input" class="form-control">
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', inspectorHTML);
  
  // Function to apply CSS
  document.getElementById('apply-css').addEventListener('click', () => {
    const property = document.getElementById('css-property').value;
    const value = document.getElementById('css-value').value;
    if (property && value) {
      document.querySelectorAll('*:hover').forEach(element => {
        element.style[property] = value;
      });
    }
  });
  
  // Function to toggle color picker
  document.getElementById('pick-color').addEventListener('click', () => {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = colorPicker.style.display === 'none' ? 'block' : 'none';
  });
  
  // Function to apply color picker value
  document.getElementById('color-input').addEventListener('input', (event) => {
    const color = event.target.value;
    document.getElementById('css-value').value = color;
  });
  