console.log('content script')

const domContent = document.body.innerText
const allEmail = [ ...domContent.matchAll(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) ].map(x => x[0])
const toSave = JSON.stringify(allEmail)
chrome.storage.local.get(['email'], function(result) {
    const allSavedEmails = JSON.parse(result.email || '{}')
    const emailsFoThisDomain = allSavedEmails[window.location.origin] || []
    const newEmails = allEmail.filter(email => !emailsFoThisDomain.includes(email))
    const emailsToSave = { 
        ...allSavedEmails, 
        [window.location.origin]: [...emailsFoThisDomain, ...newEmails]
    }
    const stringifiedEmailsToSave = JSON.stringify(emailsToSave)
    chrome.storage.local.set({'email': stringifiedEmailsToSave}, function() {
        console.log('Value is set to ' + stringifiedEmailsToSave)
    })
})