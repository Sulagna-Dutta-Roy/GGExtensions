document.getElementById('convert').addEventListener('click', convertColors);
document.getElementById('copy').addEventListener('click', copyToClipboard);
document.getElementById('reset').addEventListener('click', resetFields);

function convertColors() {
    const input = document.getElementById('input').value;
    const convertFrom = document.getElementById('convertFrom').value;
    const convertTo = document.getElementById('convertTo').value;
    console.log(input, convertFrom, convertTo)

    let result;
    let pat;

    switch (convertFrom) {
        case 'rgb':
            pat = "rgb(255, 255, 255)";
            result = convertRGB(input, convertTo);
            break;
        case 'rgba':
            pat = "rgba(255, 255, 255, 1)";
            result = convertRGBA(input, convertTo);
            break;
        case 'hex':
            pat = "#ffffff";
            result = convertHex(input, convertTo);
            break;
        case 'hsl':
            pat = "hsl(360, 100%, 100%)";
            result = convertHSL(input, convertTo);
            break;
        case 'hsv':
            pat = "hsv(360, 100%, 100%)";
            result = convertHSV(input, convertTo);
            break;
        case 'cmyk':
            pat = "cmyk(100%, 100%, 100%, 100%)";
            result = convertCMYK(input, convertTo);
            break;
    }
    document.getElementById('result').value = result;
}

function copyToClipboard() {
    const result = document.getElementById('result');
    result.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
}

function resetFields() {
    document.getElementById('input').value = '';
    document.getElementById('result').value = '';
}

function convertRGB(input, convertTo) {
    // Conversion logic for RGB
    let result = "";
    const rgb = input.replace(/[^\d,]/g, '').split(',');

    switch (convertTo) {
        case 'hex':
            result = '#' + rgb.map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            break;
        case 'rgba':
            result = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
            break;
        case 'hsl':
            result = rgbToHsl(rgb[0], rgb[1], rgb[2]);
            break;
        case 'hsv':
            result = rgbToHsv(rgb[0], rgb[1], rgb[2]);
            break;
        case 'cmyk':
            result = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
            break;
    }
    return result;
}

function convertRGBA(input, convertTo) {
    // Conversion logic for RGBA
    let result = "";
    const rgba = input.replace(/[^\d,.]/g, '').split(',');

    switch (convertTo) {
        case 'hex':
            const rgbPart = rgba.slice(0, 3).map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            const alphaPart = Math.round(parseFloat(rgba[3]) * 255).toString(16).padStart(2, '0');
            result = `#${rgbPart}${alphaPart}`;
            break;
        case 'rgb':
            result = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
            break;
        case 'hsl':
            result = rgbToHsl(rgba[0], rgba[1], rgba[2]);
            break;
        case 'hsv':
            result = rgbToHsv(rgba[0], rgba[1], rgba[2]);
            break;
        case 'cmyk':
            result = rgbToCmyk(rgba[0], rgba[1], rgba[2]);
            break;
    }
    return result;
}

function convertHex(input, convertTo) {
    // Conversion logic for HEX
    let result = "";
    const hex = input.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    switch (convertTo) {
        case 'rgb':
            result = `rgb(${r}, ${g}, ${b})`;
            break;
        case 'rgba':
            result = `rgba(${r}, ${g}, ${b}, 1)`;
            break;
        case 'hsl':
            result = rgbToHsl(r, g, b);
            break;
        case 'hsv':
            result = rgbToHsv(r, g, b);
            break;
        case 'cmyk':
            result = rgbToCmyk(r, g, b);
            break;
    }
    return result;
}

function convertHSL(input, convertTo) {
    // Conversion logic for HSL
    let result = "";
    const hsl = input.replace(/[^\d,.%]/g, '').split(',');

    const h = parseInt(hsl[0]);
    const s = parseInt(hsl[1].replace('%', ''));
    const l = parseInt(hsl[2].replace('%', ''));

    switch (convertTo) {
        case 'rgb':
            result = hslToRgb(h, s, l);
            break;
        case 'rgba':
            result = hslToRgb(h, s, l).replace('rgb', 'rgba').replace(')', ', 1)');
            break;
        case 'hex':
            result = rgbToHex(hslToRgb(h, s, l));
            break;
        case 'hsv':
            result = hslToHsv(h, s, l);
            break;
        case 'cmyk':
            result = rgbToCmyk(hslToRgb(h, s, l).replace('rgb(', '').replace(')', '').split(','));
            break;
    }
    return result;
}

function convertHSV(input, convertTo) {
    // Conversion logic for HSV
    let result = "";
    const hsv = input.replace(/[^\d,.%]/g, '').split(',');

    const h = parseInt(hsv[0]);
    const s = parseInt(hsv[1].replace('%', ''));
    const v = parseInt(hsv[2].replace('%', ''));

    switch (convertTo) {
        case 'rgb':
            result = hsvToRgb(h, s, v);
            break;
        case 'rgba':
            result = hsvToRgb(h, s, v).replace('rgb', 'rgba').replace(')', ', 1)');
            break;
        case 'hex':
            result = rgbToHex(hsvToRgb(h, s, v));
            break;
        case 'hsl':
            result = hsvToHsl(h, s, v);
            break;
        case 'cmyk':
            result = rgbToCmyk(hsvToRgb(h, s, v).replace('rgb(', '').replace(')', '').split(','));
            break;
    }
    return result;
}

function convertCMYK(input, convertTo) {
    // Conversion logic for CMYK
    let result = "";
    const cmyk = input.replace(/[^\d,.%]/g, '').split(',');

    const c = parseInt(cmyk[0].replace('%', ''));
    const m = parseInt(cmyk[1].replace('%', ''));
    const y = parseInt(cmyk[2].replace('%', ''));
    const k = parseInt(cmyk[3].replace('%', ''));

    switch (convertTo) {
        case 'rgb':
            result = cmykToRgb(c, m, y, k);
            break;
        case 'rgba':
            result = cmykToRgb(c, m, y, k).replace('rgb', 'rgba').replace(')', ', 1)');
            break;
        case 'hex':
            result = rgbToHex(cmykToRgb(c, m, y, k));
            break;
        case 'hsl':
            result = rgbToHsl(cmykToRgb(c, m, y, k).replace('rgb(', '').replace(')', '').split(','));
            break;
        case 'hsv':
            result = rgbToHsv(cmykToRgb(c, m, y, k).replace('rgb(', '').replace(')', '').split(','));
            break;
    }
    return result;
}

function rgbToHsl(r, g, b) {
    // Conversion from RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function rgbToHsv(r, g, b) {
    // Conversion from RGB to HSV
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    let h;
    switch (max) {
        case min:
            h = 0;
    }
}

// Define the default background color
const defaultBackgroundColor = 'linear-gradient(to right bottom, #7ed0e7, #77c1ee, #87afee, #a399e1, #bf80c6)';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('convert').addEventListener('click', convertColors);
    document.getElementById('reset').addEventListener('click', resetBackground);
});

function convertColors() {
    const input = document.getElementById('input').value;
    const convertFrom = document.getElementById('convertFrom').value;
    const convertTo = document.getElementById('convertTo').value;

    let result;

    switch (convertFrom) {
        case 'rgb':
            result = convertRGB(input, convertTo);
            break;
        case 'rgba':
            result = convertRGBA(input, convertTo);
            break;
        case 'hex':
            result = convertHex(input, convertTo);
            break;
        case 'hsl':
            result = convertHSL(input, convertTo);
            break;
        case 'hsv':
            result = convertHSV(input, convertTo);
            break;
        case 'cmyk':
            result = convertCMYK(input, convertTo);
            break;
        default:
            result = 'Invalid conversion';
    }

    if (isValidColor(result)) {
        document.body.style.background = result;
    } else {
        console.log('Invalid color code');
    }

    document.getElementById('result').value = result;
}

function resetBackground() {
    // Reset the body's background color to the default
    document.body.style.background = defaultBackgroundColor;

    // Clear the input and result fields
    document.getElementById('input').value = '';
    document.getElementById('result').value = '';
}

function isValidColor(colorCode) {
    const s = new Option().style;
    s.color = colorCode;
    return s.color !== '';
}

// Your existing conversion functions go here


