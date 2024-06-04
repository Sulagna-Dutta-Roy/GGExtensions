document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX2lkIjo0NjEwODEwLCJ3c2lkIjoiMzM3ODY3NTM5IiwiZW1haWwiOiJkaW5lc2hsYWt1bTAxM0BnbWFpbC5jb20iLCJhdWQiOiIwY2YxY2Y2ODA1ODI4N2RiNWUxOGYyZGNkYmMwOGZkNCIsImV4cCI6MjAzMjc0NTM4MSwianRpIjoiM2MzMzg2ZGVlYjVmYTNjMWM5MjVmMTRkNzE0NjU1YWYiLCJpYXQiOjE3MTczODUzODEsImlzcyI6Im1lZGlhLmlvIiwibmJmIjoxNzE3Mzg0MzgxLCJzdWIiOiIxNjZjZWJmMDcyZjE0ODM3ZDFlOTI0YTYwMTg1OTBjMCJ9.WhlSEFRngpMsZkyWGErIwTrs4pnkLj5sO5zLMRb4FRc'; //  // API endpoints
    const uploadUrl = 'https://api.media.io/v2/import/upload';
    const jobUrl = 'https://api.media.io/v2/job/create';
    const downloadUrl = 'https://api.media.io/v2/export/download';

    // UI elements
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const outputFormat = document.getElementById('outputFormat');
    const statusText = document.getElementById('statusText');

    let taskId = '';

    // Step 1: Upload File
    async function uploadFile() {
        statusText.textContent = 'Uploading to server, please wait...';

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                },
                body: formData
            });
            const data = await response.json();
            taskId = data.task_id;
            console.log('File uploaded. Task ID:', taskId);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    // Step 2: Create Job
    async function createJob() {
        statusText.textContent = 'Compressing file, please wait...';
        const selectedFormat = outputFormat.value;

        try {
            const response = await fetch(jobUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    task_id: taskId,
                    job_type: 'video_compress',
                    options: {
                        output_format: selectedFormat
                    }
                })
            });
            const data = await response.json();
            console.log('Job created:', data);

            // Download the file immediately after creating the job
            await downloadFile();
        } catch (error) {
            console.error('Error creating job:', error);
        }
    }

    // Step 3: Download File
    async function downloadFile() {
        try {
            const response = await fetch(`${downloadUrl}/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Create a download link and click to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `compressed_video.${outputFormat.value}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            statusText.textContent = 'Compressing file Downloaded sucessfully.';
            console.log('File downloaded');
        } catch (error) {
            console.log('Error downloading file:', error);
        }
    }

    // Event listener for Convert button
    convertBtn.addEventListener('click', async () => {
        await uploadFile();
        await createJob();
    });
});
