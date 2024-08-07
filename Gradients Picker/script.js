function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function updateSingleColor() {
    const color = document.getElementById('singleColor').value;
    const { r, g, b } = hexToRgb(color);
    const hsl = rgbToHsl(r, g, b);

    document.getElementById('singleColorValues').innerHTML = `
        Hex: ${color}<br>
        RGB: rgb(${r}, ${g}, ${b})<br>
        HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)
    `;

    document.getElementById('colorDisplay6').style.backgroundColor = color;
}

let selectedDirection = 'to bottom';

function updateGradient() {
    const color1 = document.getElementById('gradientColor1').value;
    const color2 = document.getElementById('gradientColor2').value;
    const color1Percent = document.getElementById('color1Slider').value;
    const color2Percent = document.getElementById('color2Slider').value;

    document.getElementById('colorDisplay1').style.backgroundColor = color1;
    document.getElementById('colorDisplay2').style.backgroundColor = color2;

    const gradients = [
        { element: 'gradientTop', direction: 'to top' },
        { element: 'gradientBottom', direction: 'to bottom' },
        { element: 'gradientLeft', direction: 'to left' },
        { element: 'gradientRight', direction: 'to right' },
        { element: 'gradientTopRight', direction: 'to top right' },
        { element: 'gradientBottomLeft', direction: 'to bottom left' },
        { element: 'gradientTopLeft', direction: 'to top left' },
        { element: 'gradientBottomRight', direction: 'to bottom right' },
    ];

    gradients.forEach(gradient => {
        const gradientCSS = `linear-gradient(${gradient.direction}, ${color1} ${color1Percent}%, ${color2} ${color2Percent}%)`;
        document.getElementById(gradient.element).style.background = gradientCSS;
        document.getElementById(gradient.element).innerText = gradient.direction.replace('to ', '').replace(' ', '-').toUpperCase();
    });

    const cssCode = `background: linear-gradient(${selectedDirection}, ${color1} ${color1Percent}%, ${color2} ${color2Percent}%);`;
    document.getElementById('cssCode').innerText = cssCode;
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('CSS Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

document.getElementById('copyButton').addEventListener('click', () => {
    const cssCode = document.getElementById('cssCode').innerText;
    copyToClipboard(cssCode);
});

document.getElementById('singleColor').addEventListener('input', updateSingleColor);
document.getElementById('gradientColor1').addEventListener('input', updateGradient);
document.getElementById('gradientColor2').addEventListener('input', updateGradient);
document.getElementById('color1Slider').addEventListener('input', updateGradient);
document.getElementById('color2Slider').addEventListener('input', updateGradient);

document.querySelectorAll('.gradient-box').forEach(box => {
    box.addEventListener('click', (event) => {
        selectedDirection = event.target.getAttribute('data-direction');
        updateGradient();
    });
});

window.onload = () => {
    updateSingleColor();
    updateGradient();
};
