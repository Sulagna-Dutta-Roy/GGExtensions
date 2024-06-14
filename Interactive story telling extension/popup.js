document.addEventListener('DOMContentLoaded', function() {
    const storyTitle = document.getElementById('story-title');
    const storyText = document.getElementById('story-text');
    const choice1 = document.getElementById('choice-1');
    const choice2 = document.getElementById('choice-2');
  
    // Initial story state
    let currentScene = 'start';
  
    // Function to update story based on user choices
    function updateStory() {
      switch (currentScene) {
        case 'start':
          storyTitle.textContent = 'Chapter 1: The Beginning';
          storyText.textContent = 'You find yourself in a mysterious forest. Which path will you take?';
          choice1.textContent = 'Follow the river';
          choice2.textContent = 'Enter the cave';
          currentScene = 'scene1';
          break;
        case 'scene1':
          if (this.id === 'choice-1') {
            storyText.textContent = 'You follow the river and discover a hidden treasure!';
          } else {
            storyText.textContent = 'You enter the cave and encounter a dragon... Game Over!';
          }
          choice1.style.display = 'none';
          choice2.style.display = 'none';
          break;
        // Add more scenes and choices as needed
        default:
          break;
      }
    }
  
    // Event listeners for user choices
    choice1.addEventListener('click', updateStory);
    choice2.addEventListener('click', updateStory);
  });
  