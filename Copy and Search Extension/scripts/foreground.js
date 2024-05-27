document.addEventListener('copy', () => {
    navigator.clipboard.readText()
        .then(res => {
            chrome.runtime.sendMessage({
                message: 'search',
                payload: `"${res}"`
            });
        })
        .catch(err => console.log(err));
});