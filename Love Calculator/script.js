document.getElementById('calculate').addEventListener('click', function() {
    const yourName = document.getElementById('your-name').value;
    const crushName = document.getElementById('crush-name').value;

    if (yourName === '' || crushName === '') {
        alert('Please enter both names!');
        return;
    }

    generateLoveScore(yourName, crushName);
    document.getElementById('regenerate').style.display = 'inline-block';
});

document.getElementById('regenerate').addEventListener('click', function() {
    const yourName = document.getElementById('your-name').value;
    const crushName = document.getElementById('crush-name').value;
    generateLoveScore(yourName, crushName);
});

function generateLoveScore(yourName, crushName) {
    const loveScore = Math.floor(Math.random() * 100) + 1;
    document.getElementById('result-message').textContent = `💖 The love percentage between ${yourName} and ${crushName} is:`;
    document.getElementById('result-percentage').textContent = `${loveScore}% 💘`;
}
