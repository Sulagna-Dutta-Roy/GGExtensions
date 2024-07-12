(function() {
  if (window.location.protocol === 'chrome:') {
    console.log('Extension does not run on chrome:// pages');
    return;
  }

  function storeEmail() {
    // Get the email subject
    const subjectElement = document.querySelector('input[name="subjectbox"]');
    const subject = subjectElement ? subjectElement.value : '';

    // Get the email body
    const bodyElement = document.querySelector('div[role="textbox"]');
    const body = bodyElement ? bodyElement.innerText : '';

    // Get the recipient(s)
    const recipientElements = document.querySelectorAll('div[aria-label="To"] span[email]');
    const recipients = Array.from(recipientElements).map(el => el.getAttribute('email')).join(', ');

    // Create the email object
    const email = {
      subject: subject,
      body: body,
      recipients: recipients,
      date: new Date().toISOString()
    };

    // Send the email data to the background script
    chrome.runtime.sendMessage({action: "storeEmail", email: email}, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error storing email:', chrome.runtime.lastError);
      } else if (response && response.success) {
        console.log('Email stored successfully');
        alert('Email stored successfully!');
      }
    });
  }

  function addStoreButton() {
    const composeBox = document.querySelector('.compose-header');
    if (composeBox && !composeBox.querySelector('#store-email-btn')) {
      const storeButton = document.createElement('button');
      storeButton.id = 'store-email-btn';
      storeButton.textContent = 'Store Email';
      storeButton.style.cssText = `
        background-color: #1a73e8;
        color: white;
        border: none;
        padding: 8px 16px;
        margin-left: 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      `;
      storeButton.onclick = storeEmail;
      composeBox.appendChild(storeButton);
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        addStoreButton();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  addStoreButton();
})();