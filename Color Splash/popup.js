document.getElementById('applyColor').addEventListener('click', () => {
  const color = document.getElementById('colorInput').value;
  changeBackgroundColor(color);
});

document.getElementById('randomColor').addEventListener('click', () => {
  const color = getRandomColor();
  changeBackgroundColor(color);
});

document.getElementById('applyGradient').addEventListener('click', () => {
  const startColor = document.getElementById('gradientStart').value;
  const endColor = document.getElementById('gradientEnd').value;
  changeBackgroundGradient(startColor, endColor);
});

document.getElementById('saveColor').addEventListener('click', () => {
  const color = document.getElementById('colorInput').value;
  saveFavoriteColor(color);
});

document.addEventListener('DOMContentLoaded', loadFavoriteColors);

function changeBackgroundColor(color) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: setPageBackgroundColor,
      args: [color]
    });
  });
}

function setPageBackgroundColor(color) {
  document.body.style.backgroundColor = color;
}

function changeBackgroundGradient(startColor, endColor) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: setPageBackgroundGradient,
      args: [startColor, endColor]
    });
  });
}

function setPageBackgroundGradient(startColor, endColor) {
  document.body.style.backgroundImage = `linear-gradient(${startColor}, ${endColor})`;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function saveFavoriteColor(color) {
  chrome.storage.sync.get(['favoriteColors'], (result) => {
    let favoriteColors = result.favoriteColors || [];
    if (!favoriteColors.includes(color)) {
      favoriteColors.push(color);
      chrome.storage.sync.set({ favoriteColors }, () => {
        displayFavoriteColors(favoriteColors);
      });
    }
  });
}

function loadFavoriteColors() {
  chrome.storage.sync.get(['favoriteColors'], (result) => {
    const favoriteColors = result.favoriteColors || [];
    displayFavoriteColors(favoriteColors);
  });
}

function displayFavoriteColors(favoriteColors) {
  const favoriteColorsContainer = document.getElementById('favoriteColors');
  favoriteColorsContainer.innerHTML = '';
  favoriteColors.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'favorite-color';
    colorDiv.style.backgroundColor = color;
    colorDiv.addEventListener('click', () => {
      changeBackgroundColor(color);
    });
    favoriteColorsContainer.appendChild(colorDiv);
  });
}
