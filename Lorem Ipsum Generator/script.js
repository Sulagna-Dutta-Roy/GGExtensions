document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', function() {
        const numParagraphs = document.getElementById('numParagraphs').value;
        const numSentences = document.getElementById('numSentences').value;

        const loremIpsumText = generateLoremIpsum(numParagraphs, numSentences);
        document.getElementById('result').style.display = '';
        document.getElementById('output').innerText = loremIpsumText;
    });

    function generateLoremIpsum(numParagraphs, numSentences) {
        const loremIpsumSentences = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
            "Integer eget lorem et nisi lobortis fermentum sit amet vitae eros.",
            "Vestibulum scelerisque orci sit amet diam ullamcorper, at suscipit nisi hendrerit.",
            "Sed sed ligula auctor, convallis ligula vel, volutpat sem.",
            "Fusce nec leo ut mauris efficitur tristique.",
            "Duis eu leo vitae sapien venenatis fermentum.",
            "Proin vitae purus euismod, ultricies tortor eu, feugiat libero.",
            "Vivamus a libero sit amet justo tempus sollicitudin.",
            "Curabitur sit amet ipsum vel elit molestie tincidunt in ut purus.",
            "Morbi sit amet odio sed nisi posuere luctus.",
            "Nullam vel magna non lacus scelerisque convallis.",
            "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
            "Suspendisse sed nisl vitae dui volutpat dictum.",
            "Fusce consectetur lacus vel ligula aliquet feugiat.",
            "Phasellus euismod odio id purus convallis, eu faucibus risus pretium.",
            "Vestibulum euismod justo id libero lacinia, sed scelerisque lorem vestibulum.",
            "Nulla facilisi. Donec sed vehicula lorem, eget fringilla magna.",
            "Vivamus quis nulla non arcu sollicitudin tristique.",
            "Quisque id purus vestibulum, commodo lectus eu, accumsan dui."
        ];

        let loremIpsumText = '';
        for (let i = 0; i < numParagraphs; i++) {
            for (let j = 0; j < numSentences; j++) {
                const randomIndex = Math.floor(Math.random() * loremIpsumSentences.length);
                loremIpsumText += loremIpsumSentences[randomIndex] + ' ';
            }
            loremIpsumText += '\n\n';
        }
        return loremIpsumText.trim();
    }
});

function copyLorem() {
    const outputText = document.getElementById('output').innerText;
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = outputText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Lorem Ipsum text copied to clipboard!');
}