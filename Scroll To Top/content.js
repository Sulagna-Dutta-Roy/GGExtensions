const scrollToTopButton = document.createElement('div');
scrollToTopButton.innerHTML = '↑';
scrollToTopButton.style.position = 'fixed';
scrollToTopButton.style.bottom = '20px';
scrollToTopButton.style.right = '20px';
scrollToTopButton.style.padding = '10px';
scrollToTopButton.style.backgroundColor = '#000';
scrollToTopButton.style.color = '#fff';
scrollToTopButton.style.borderRadius = '50%';
scrollToTopButton.style.cursor = 'pointer';
scrollToTopButton.style.zIndex = '1000';
scrollToTopButton.style.display = 'none';
scrollToTopButton.style.textAlign = 'center';
scrollToTopButton.style.lineHeight = '24px';
scrollToTopButton.style.fontSize = '18px';

document.body.appendChild(scrollToTopButton);

scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

console.log('Scroll to Top button added to the page');
