document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultDiv = document.getElementById('result');
  
    // Function to perform search
    function performSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm !== '') {
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`;
        resultDiv.innerHTML = `<a href="${url}" target="_blank">Read more about "${searchTerm}" on Wikipedia</a>`;
      } else {
        resultDiv.innerHTML = 'Please enter a search term.';
      }
    }
  
    // Trigger search on button click
    searchButton.addEventListener('click', performSearch);
  
    // Trigger search on pressing Enter key
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  });
  