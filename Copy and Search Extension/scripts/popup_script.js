chrome.runtime.sendMessage({ message: 'get_current_search_engine' }, response => {
    document.querySelectorAll('option').forEach(option => {
        if (response.payload === option.value) {
            document.querySelector('#search_engine').value = response.payload;
            document.querySelector('.search_engine_choice').style.opacity = 1;
            document.querySelector('.search_engine_choice').innerHTML = option.innerText;
        }
    });
});

document.querySelector('button').addEventListener('click', () => {
    document.querySelectorAll('option').forEach(option => {
        if (option.selected) {
            chrome.runtime.sendMessage({
                message: 'save_search_engine',
                payload: option.value
            }, response => {
                if (response.message === 'success') {
                    document.querySelector('.search_engine_choice').style.opacity = 1;
                    document.querySelector('.search_engine_choice').innerHTML = option.innerText;
                }
            });
        }
    });
});