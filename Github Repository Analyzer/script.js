document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('repo-form');
    const resultsDiv = document.getElementById('results');

    if (!form || !resultsDiv) {
        console.error('Form or results container not found.');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const ownerInput = document.getElementById('owner');
        const repoInput = document.getElementById('repo');

        if (!ownerInput || !repoInput) {
            console.error('Owner or repo input fields not found.');
            return;
        }

        const owner = ownerInput.value.trim(); //ownerInput if null then error
        const repo = repoInput.value.trim(); //repoInput if null then error

        resultsDiv.innerHTML = 'Loading...';

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!response.ok) throw new Error('Repository not found');

            const repoData = await response.json();

            resultsDiv.innerHTML = `
                <h2>Repository Details</h2>
                <p><strong>Name:</strong> ${repoData.name}</p>
                <p><strong>Description:</strong> ${repoData.description || 'No description available'}</p>
                <p><strong>Stars:</strong> ${repoData.stargazers_count}</p>
                <p><strong>Forks:</strong> ${repoData.forks_count}</p>
                <p><strong>Open Issues:</strong> ${repoData.open_issues_count}</p>
                <p><strong>Language:</strong> ${repoData.language || 'Not specified'}</p>
            `;
        } catch (error) {
            resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});
