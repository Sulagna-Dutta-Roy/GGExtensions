document.getElementById('flamesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name1 = document.getElementById('name1').value.toLowerCase().replace(/\s+/g, '');
    const name2 = document.getElementById('name2').value.toLowerCase().replace(/\s+/g, '');

    const flames = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemy', 'Siblings'];

    let totalLength = name1.length + name2.length;
    let commonChars = 0;

    for (let i = 0; i < name1.length; i++) {
        if (name2.includes(name1[i])) {
            commonChars++;
            name2 = name2.replace(name1[i], '');
        }
    }

    totalLength -= 2 * commonChars;

    const resultIndex = totalLength % flames.length;
    const result = flames[resultIndex];

    document.getElementById('result').textContent = `Your relationship is: ${result}`;
});
