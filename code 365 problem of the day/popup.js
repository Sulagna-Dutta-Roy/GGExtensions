document.addEventListener('DOMContentLoaded', function() {
    const problemDescription = document.getElementById('problem-description');
  
    fetch('https://www.naukri.com/code360/problem-of-the-day')
      .then(response => response.text())
      .then(data => {
        // Assuming the problem description is within a specific element in the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const problemElement = doc.querySelector('.problem-description'); // Adjust selector as necessary
        if (problemElement) {
          problemDescription.innerHTML = problemElement.innerHTML;
        } else {
          problemDescription.innerHTML = 'Unable to load problem description.';
        }
      })
      .catch(error => {
        problemDescription.innerHTML = 'An error occurred while fetching the problem description.';
        console.error('Error fetching the problem description:', error);
      });
  });
  