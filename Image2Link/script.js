document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const generateLinkButton = document.getElementById('generateLinkButton');
    const linkContainer = document.getElementById('linkContainer');

    const clientId = 'ea3ae340c2294c5';  // Replace with your Imgur client ID

    generateLinkButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        if (file) {
            loadingMessage.style.display = 'block';  // Show loading message

            const formData = new FormData();
            formData.append('image', file);

            fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: `Client-ID ${clientId}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    loadingMessage.style.display = 'none';  // Hide loading message
                    if (data.success) {
                        let imageUrl = data.data.link;
                        // Replace the 'i.' prefix with '' to get the correct URL
                        imageUrl = imageUrl.replace('i.imgur.com/', 'imgur.com/');

                        // Create a new div to hold the link
                        const linkDiv = document.createElement('div');
                        linkDiv.className = 'link-div';

                        const link = document.createElement('a');
                        link.href = '#';
                        link.textContent = imageUrl;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(imageUrl).then(() => {
                                alert('link address Copied Use it!!!');
                            }).catch(err => {
                                console.error('Failed to copy: ', err);
                            });
                        });


                        // Clear previous link
                        linkContainer.innerHTML = '';
                        linkDiv.appendChild(link);
                        linkContainer.appendChild(linkDiv);
                    } else {
                        linkContainer.innerHTML = 'Upload failed: ' + data.data.error;
                    }
                })
                .catch(error => {
                    loadingMessage.style.display = 'none';  // Hide loading message
                    linkContainer.innerHTML = 'Upload failed: ' + error.message;
                });
        } else {
            linkContainer.innerHTML = 'Please select a file to upload.';
        }
    });
});
