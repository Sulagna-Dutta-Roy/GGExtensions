function books(genre) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}`)
        .then(response => response.json())
        .then(bookData => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';  // Clear previous results
            bookData.items.slice(0, 10).forEach((item, index) => {
                const book = item.volumeInfo;
                const bookItem = document.createElement('div');
                bookItem.className = 'col-md-6 mb-3';
                bookItem.innerHTML = `
                    <div class="card h-100">
                        <img class="card-img-top" src="${book.imageLinks ? book.imageLinks.thumbnail : 'no_image_available.png'}" alt="Book cover">
                        <div class="card-body">
                            <h5 class="card-title">${index + 1}. ${book.title}</h5>
                            <p class="card-text"><strong>Author:</strong> ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
                            <p class="card-text"><strong>Published Date:</strong> ${book.publishedDate || 'N/A'}</p>
                            <p class="card-text">${book.description ? book.description.substring(0, 100) + '...' : 'No description available'}</p>
                        </div>
                    </div>`;
                bookList.appendChild(bookItem);
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '<p class="text-danger">Failed to fetch book data. Please try again later.</p>';
        });
  }
  
  document.getElementById("clickme").addEventListener("click", () => {
    const type = document.getElementById("type").value;
    books(type);
  });
  
  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById('book-list').innerHTML = '';
  });
  