document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('popup-btn')
    btn.addEventListener("click", function(){
        chrome.tabs.insertCSS({
            code: ` *{
                font-family: 'Helvetica' ,sans-serif !important;
            }`
        })
    
})
   
})

