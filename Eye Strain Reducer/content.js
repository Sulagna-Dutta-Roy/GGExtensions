function applyBlueLightFilter(intensity) {
    const filterValue = `invert(${intensity}%) sepia(${intensity}%)`;
  
    const css = `
      html {
        filter: ${filterValue};
      }
    `;
  
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
  }
  