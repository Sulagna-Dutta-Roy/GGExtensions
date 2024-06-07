document.addEventListener('DOMContentLoaded', loadSavedEmails);

function generateEmail() {
    const scenario = document.getElementById('scenario').value;
    const name = document.getElementById('name').value.trim();
    const recipient = document.getElementById('recipient').value.trim();
    const details = document.getElementById('details').value.trim();
    const errorElement = document.getElementById('error');
    const emailOutputElement = document.getElementById('emailOutput');

    // Clear previous error message and email content
    errorElement.textContent = '';
    emailOutputElement.value = '';

    // Validate inputs
    if (!name || !recipient || !details) {
        errorElement.textContent = 'Please fill out all fields.';
        return;
    }

    let emailContent = '';

    switch (scenario) {
        case 'internship':
            emailContent = `Dear ${recipient},\n\nI am writing to express my interest in the internship opportunity at your esteemed organization. My name is ${name}, and I am eager to gain practical experience in the field of [Your Field].\n\n${details}\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.\n\nBest regards,\n${name}`;
            break;
        case 'job':
            emailContent = `Dear ${recipient},\n\nI am excited to apply for the [Job Title] position at [Company Name] as advertised. My name is ${name}, and I believe my skills and background make me a perfect fit for this role.\n\n${details}\n\nI have attached my resume for your review. Thank you for your time and consideration. I look forward to the possibility of discussing this exciting opportunity with you.\n\nSincerely,\n${name}`;
            break;
        case 'networking':
            emailContent = `Dear ${recipient},\n\nI hope this email finds you well. My name is ${name}, and I recently came across your profile while researching leaders in [Industry/Field]. I am very impressed with your work and would love to connect and possibly discuss your insights on [Topic].\n\n${details}\n\nThank you for your time, and I look forward to connecting with you.\n\nBest regards,\n${name}`;
            break;
        case 'followUp':
            emailContent = `Dear ${recipient},\n\nI hope you are doing well. My name is ${name}, and I am writing to follow up on our recent conversation regarding [Subject/Meeting].\n\n${details}\n\nThank you for your attention to this matter. I look forward to your response.\n\nBest regards,\n${name}`;
            break;
        case 'thankYou':
            emailContent = `Dear ${recipient},\n\nI wanted to take a moment to thank you for [Reason for Thanks]. My name is ${name}, and I truly appreciate your [help/kindness/support/etc.].\n\n${details}\n\nThank you once again for everything. It means a lot to me.\n\nBest regards,\n${name}`;
            break;
        case 'resignation':
            emailContent = `Dear ${recipient},\n\nI am writing to formally resign from my position at [Company Name], effective [Last Working Day]. My name is ${name}, and it has been a pleasure working with you and the team.\n\n${details}\n\nThank you for the opportunities and support provided during my tenure. I will ensure a smooth transition during my remaining time.\n\nSincerely,\n${name}`;
            break;
        default:
            emailContent = 'Please select a valid scenario.';
    }

    emailOutputElement.value = emailContent;
}

function saveEmail() {
    const emailOutputElement = document.getElementById('emailOutput').value.trim();
    const errorElement = document.getElementById('error');

    if (!emailOutputElement) {
        errorElement.textContent = 'No email content to save. Please generate an email first.';
        return;
    }

    const savedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];
    savedEmails.push(emailOutputElement);
    localStorage.setItem('savedEmails', JSON.stringify(savedEmails));

    loadSavedEmails();
}

function loadSavedEmails() {
    const savedEmailsContainer = document.getElementById('savedEmails');
    savedEmailsContainer.innerHTML = '';
    const savedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];

    savedEmails.forEach((email, index) => {
        const emailElement = document.createElement('div');
        emailElement.className = 'saved-email';
        emailElement.innerHTML = `
            <textarea readonly>${email}</textarea>
            <button onclick="deleteEmail(${index})">Delete</button>
            <button onclick="updateEmail(${index})">Update</button>
        `;
        savedEmailsContainer.appendChild(emailElement);
    });
}

function deleteEmail(index) {
    const savedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];
    savedEmails.splice(index, 1);
    localStorage.setItem('savedEmails', JSON.stringify(savedEmails));
    loadSavedEmails();
}

function updateEmail(index) {
    const savedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];
    const emailToUpdate = savedEmails[index];

    document.getElementById('emailOutput').value = emailToUpdate;
    deleteEmail(index);
}