(
    function() {
        let displayAll
        let isSort

        function display(domain) {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                var url = tabs[0].url;
                chrome.storage.local.get(['email'], function(result) {
                    const allSavedEmails = JSON.parse(result.email || '{}')
                    let emailsToDisplay = allSavedEmails[(new URL(url)).origin] || []
                    if (domain) {
                        emailsToDisplay = allSavedEmails[domain] || []
                    }
                    else if(displayAll) {
                        emailsToDisplay = Object.keys(allSavedEmails).map(key => allSavedEmails[key]).flat()
                    }

                    if(isSort) {
                        emailsToDisplay = emailsToDisplay.sort()
                    }
                    populateTable(emailsToDisplay)
                })
            })
        }

        function populateTable(dataArray) {
            const fragment = document.getElementById('container')
            fragment.innerHTML = ''
            dataArray.forEach(element => {
                fragment.appendChild(createElement('div', 'email', element))
            });
        }

        function createElement(element, className, innerHTML) {
            const el = document.createElement(element)
            className && el.setAttribute('class', className)
            el.innerHTML = innerHTML || ''
            return el
        }

        function setSortFlag() {
            isSort = true
            display()
        }

        function setdisplayAll() {
            displayAll = true
            display()
        }

        // function forDomain() {
        //     display('https://github.com/')
        // }

        document.getElementById('sortbtn').addEventListener('click', setSortFlag);
        document.getElementById('showAll').addEventListener('click', setdisplayAll);
        // document.getElementById('domaininput').addEventListener("blur", forDomain)
        // document.getElementById('selector').appendChild()
        display()

    }
)()
