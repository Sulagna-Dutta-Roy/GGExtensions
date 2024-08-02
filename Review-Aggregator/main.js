document.getElementById('fetchReviews').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    
    if (url) {
      fetchReviews(url).then(reviews => {
        displayReviews(reviews);
      }).catch(error => {
        console.error('Error fetching reviews:', error);
        alert('Failed to fetch reviews. Check the console for details.');
      });
    } else {
      alert('Please enter a URL.');
    }
  });
  
  async function fetchReviews(url) {
    try {
      // Construct the API request URL
      const apiUrl = `https://api.example.com/reviews?url=${encodeURIComponent(url)}`;
      console.log('Request URL:', apiUrl);
  
      // Fetch data from the API
      const response = await fetch(apiUrl);
  
      // Log the response status and headers
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log('Response Data:', data);
  
      // Check if the reviews array exists
      if (!data.reviews || !Array.isArray(data.reviews)) {
        throw new Error('Invalid response format');
      }
  
      return data.reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to fetch reviews. Check the console for details.');
      throw error; // Re-throw to be caught by the calling function
    }
  }
  
  
  
  function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '';
  
    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.innerHTML = `
        <h3>${review.title}</h3>
        <p>${review.content}</p>
      `;
      container.appendChild(reviewElement);
    });
  }
  