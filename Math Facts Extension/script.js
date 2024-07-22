document.getElementById('generate-fact').addEventListener('click', function() {
    fetch('http://numbersapi.com/random/math')
      .then(response => response.text())
      .then(data => {
        document.getElementById('fact').innerText = data;
      })
      .catch(error => {
        console.error('Error fetching the math fact:', error);
        document.getElementById('fact').innerText = 'Could not fetch a fact. Please try again.';
      });
    });
    
document.getElementById('reset').addEventListener('click',()=>{
  document.getElementById('fact').innerText = "Click the button to get a fact!";

})