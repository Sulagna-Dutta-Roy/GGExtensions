function displayEmails() {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = '';

    chrome.storage.sync.get("emails", (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error fetching emails:', chrome.runtime.lastError);
            emailList.innerHTML = '<p class="no-emails">Error fetching emails. Please try again.</p>';
            return;
        }

        const emails = data.emails || [];
        if (emails.length === 0) {
            emailList.innerHTML = '<p class="no-emails">No emails stored yet.</p>';
            return;
        }
        emails.forEach((email, index) => {
            const emailDiv = document.createElement('div');
            emailDiv.className = 'email-item';
            emailDiv.innerHTML = `
                <div class="email-subject">${escapeHtml(email.subject)}</div>
                <div class="email-recipients">To: ${escapeHtml(email.recipients)}</div>
                <div class="email-date">${new Date(email.date).toLocaleString()}</div>
                <div class="email-actions">
                    <button onclick="copyEmail(${index})">Copy</button>
                    <button class="delete-btn" onclick="deleteEmail(${index})">Delete</button>
                </div>
            `;
            emailList.appendChild(emailDiv);
        });
    });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function copyEmail(index) {
    chrome.storage.sync.get("emails", (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error fetching emails:', chrome.runtime.lastError);
            alert('Error copying email. Please try again.');
            return;
        }

        const emails = data.emails || [];
        const email = emails[index];
        const emailContent = `To: ${email.recipients}\nSubject: ${email.subject}\nDate: ${email.date}\n\n${email.body}`;
        navigator.clipboard.writeText(emailContent).then(() => {
            alert('Email copied to clipboard!');
        }).catch((err) => {
            console.error('Error copying to clipboard:', err);
            alert('Error copying to clipboard. Please try again.');
        });
    });
}

function deleteEmail(index) {
    if (confirm('Are you sure you want to delete this email?')) {
        chrome.storage.sync.get("emails", (data) => {
            if (chrome.runtime.lastError) {
                console.error('Error fetching emails:', chrome.runtime.lastError);
                alert('Error deleting email. Please try again.');
                return;
            }

            const emails = data.emails || [];
            emails.splice(index, 1);
            chrome.storage.sync.set({ emails: emails }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving emails:', chrome.runtime.lastError);
                    alert('Error deleting email. Please try again.');
                } else {
                    displayEmails();
                }
            });
        });
    }
}

function showAddEmailForm() {
    console.log('Showing add email form');
    const form = `
        <form id="add-email-form">
            <input type="text" id="email-subject" placeholder="Subject" required>
            <input type="text" id="email-recipients" placeholder="Recipients" required>
            <textarea id="email-body" placeholder="Email body" required></textarea>
            <button type="submit">Save Email</button>
        </form>
    `;
    document.getElementById('email-list').innerHTML = form;
    
    document.getElementById('add-email-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        const newEmail = {
            subject: document.getElementById('email-subject').value,
            recipients: document.getElementById('email-recipients').value,
            body: document.getElementById('email-body').value,
            date: new Date().toISOString()
        };
        
        chrome.storage.sync.get("emails", (data) => {
            const emails = data.emails || [];
            emails.push(newEmail);
            chrome.storage.sync.set({ emails: emails }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving new email:', chrome.runtime.lastError);
                    alert('Error saving new email. Please try again.');
                } else {
                    console.log('New email saved successfully');
                    displayEmails();
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    displayEmails();
    document.getElementById('add-email-btn').addEventListener('click', () => {
        console.log('Add New Email button clicked');
        showAddEmailForm();
    });
});