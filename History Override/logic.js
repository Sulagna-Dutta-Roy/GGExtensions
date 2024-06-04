
const kMillisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
const kOneWeekAgo = (new Date).getTime() - kMillisecondsPerWeek;
let historyDiv = document.getElementById('historyDiv');
const kColors = ['#FF6F61','#6B5B95','#FFB347','#2EC4B6'];
let $ = document.getElementById.bind(document);

function constructHistory(historyItems) {
  let template = $('historyTemplate');
  for (let item of historyItems) {
    let displayDiv = template.content.querySelector("#history, div");
    let randomColor = kColors[Math.floor(Math.random() * kColors.length)];
    displayDiv.style.backgroundColor = randomColor;
    let titleLink = template.content.querySelector('.titleLink, a');
    let pageName = template.content.querySelector('.pageName, p');
    let removeButton = template.content.querySelector('.removeButton, button');
    let checkbox = template.content.querySelector('.removeCheck, input');
    checkbox.setAttribute('value', item.url);
    let favicon = document.createElement('img');
    let host = new URL(item.url).host;
    titleLink.href = item.url;
    favicon.src = 'chrome://favicon/' + item.url;
    titleLink.textContent = host;
    titleLink.appendChild(favicon);
    pageName.innerText = item.title;
    if (item.title === '') {
      pageName.innerText = host;
    }
    var clone = document.importNode(template.content, true);
    clone.querySelector('.removeButton, button')
      .addEventListener('click', function() {
        chrome.history.deleteUrl({url: item.url}, function() {
          location.reload();
        });
      });
    historyDiv.appendChild(clone);
  }
}

chrome.history.search({
      text: '',
      startTime: kOneWeekAgo,
      maxResults: 99
    }, constructHistory);

$('searchSubmit').onclick = function() {
  historyDiv.innerHTML = " "
  let searchQuery = document.getElementById('searchInput').value
  chrome.history.search({
        text: searchQuery,
        startTime: kOneWeekAgo
      }, constructHistory)
}

$('deleteSelected').onclick = function() {
  let checkboxes = document.getElementsByTagName('input');
  for (var i =0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked == true) {
        chrome.history.deleteUrl({url: checkboxes[i].value})
    }
  }
  location.reload();
}

$('removeAll').onclick = function() {
  chrome.history.deleteAll(function() {
    location.reload();
  });
}

$('seeAll').onclick = function() {
  location.reload();
}