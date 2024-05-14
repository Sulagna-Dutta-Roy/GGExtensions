document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.getElementById('invertCheckbox');

    // Check and apply the stored checkbox state from local storage
    var isChecked = localStorage.getItem('invertCheckboxState') === 'true';
    checkbox.checked = isChecked;
    applyPageColorBasedOnCheckbox(isChecked);

    checkbox.addEventListener('change', function () {
        // Save the checkbox state to local storage
        localStorage.setItem('invertCheckboxState', checkbox.checked);
        applyPageColorBasedOnCheckbox(checkbox.checked);
    });
});

function applyPageColorBasedOnCheckbox(isChecked) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: isChecked ? invertPageColors : resetPageColors
        });
    });
}

function invertPageColors() {
    document.documentElement.style.filter = 'invert(1)';
}

function resetPageColors() {
    document.documentElement.style.filter = 'none';
}
