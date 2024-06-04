document.addEventListener('DOMContentLoaded', function () {
  const problemNameElem = document.getElementById('problem-name');
  const difficultyElem = document.getElementById('difficulty');
  const leetcodeLinkElem = document.getElementById('leetcode-link');

  // Fetch the data from data.json
  fetch(chrome.runtime.getURL('data.json'))
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Get today's date and format it as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];

      // Get stored problem date
      const storedDate = localStorage.getItem('problemDate');
      let problemOfTheDay;

      if (storedDate === today) {
        // If the problem for today is already stored, retrieve it
        problemOfTheDay = JSON.parse(localStorage.getItem('problemOfTheDay'));
      } else {
        // Otherwise, pick a new random problem
        problemOfTheDay = data[Math.floor(Math.random() * data.length)];

        // Store the new problem and the date
        localStorage.setItem('problemDate', today);
        localStorage.setItem('problemOfTheDay', JSON.stringify(problemOfTheDay));
      }

      // Update the popup with the problem details
      problemNameElem.textContent = problemOfTheDay.problemName;
      difficultyElem.textContent = `Difficulty: ${problemOfTheDay.difficulty}`;
      leetcodeLinkElem.href = problemOfTheDay.leetCodeLink;
    });
});
