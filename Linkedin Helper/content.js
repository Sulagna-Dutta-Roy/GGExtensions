function analyzeProfile() {
    const nameElement = document.querySelector('.pv-top-card--list .text-heading-xlarge');
    const headlineElement = document.querySelector('.pv-top-card--list .text-body-medium');
    
    if (nameElement && headlineElement) {
      const name = nameElement.textContent.trim();
      const headline = headlineElement.textContent.trim();
      
      const insights = `Name: ${name}\nHeadline: ${headline}\nSuggestions: Improve your headline by being more specific and adding relevant keywords.`;
      alert(insights);
    } else {
      alert('Profile information not found. Make sure you are viewing a LinkedIn profile.');
    }
  }
  
  function addProfileAnalysisButton() {
    const button = document.createElement('button');
    button.textContent = 'Analyze Profile';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#0073b1';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.onclick = analyzeProfile;
    document.body.appendChild(button);
  }
  
  window.onload = addProfileAnalysisButton;
  