function convert() {
    const value1 = parseFloat(document.getElementById('inputValue1').value);
    const unit1 = document.getElementById('unitSelector1').value;
    const unit2 = document.getElementById('unitSelector2').value;
    let convertedValue;

    if (unit1 === 'kg' && unit2 === 'g') {
        convertedValue = value1 * 1000;
    } else if (unit1 === 'kg' && unit2 === 'mg') {
        convertedValue = value1 * 1e+6;
    } else if (unit1 === 'kg' && unit2 === 'ug') {
        convertedValue = value1 * 1e+9;
    } else if (unit1 === 'kg' && unit2 === 't') {
        convertedValue = value1 / 1000;
    } else if (unit1 === 'kg' && unit2 === 'it') {
        convertedValue = value1 * 0.000984207;
    } else if (unit1 === 'kg' && unit2 === 'ust') {
        convertedValue = value1 * 0.00110231;
    } else if (unit1 === 'kg' && unit2 === 'st') {
        convertedValue = value1 * 0.157473;
    } else if (unit1 === 'kg' && unit2 === 'oz') {
        convertedValue = value1 * 35.274;
    } else if (unit1 === 'g' && unit2 === 'kg') {
        convertedValue = value1 / 1000;
    } else if (unit1 === 'g' && unit2 === 'mg') {
        convertedValue = value1 * 1000;
    } else if (unit1 === 'g' && unit2 === 'ug') {
        convertedValue = value1 * 1e+6;
    } else if (unit1 === 'g' && unit2 === 't') {
        convertedValue = value1 / 1e+6;
    } else if (unit1 === 'g' && unit2 === 'it') {
        convertedValue = value1 * 9.8421e-7;
    } else if (unit1 === 'g' && unit2 === 'ust') {
        convertedValue = value1 * 1.10231e-6;
    } else if (unit1 === 'g' && unit2 === 'st') {
        convertedValue = value1 * 0.000157473;
    } else if (unit1 === 'g' && unit2 === 'oz') {
        convertedValue = value1 * 0.035274;
    } else if (unit1 === 'mg' && unit2 === 'kg') {
        convertedValue = value1 / 1e+6;
    } else if (unit1 === 'mg' && unit2 === 'g') {
        convertedValue = value1 / 1000;
    } else if (unit1 === 'mg' && unit2 === 'ug') {
        convertedValue = value1 * 1000;
    } else if (unit1 === 'mg' && unit2 === 't') {
        convertedValue = value1 / 1e+9;
    } else if (unit1 === 'mg' && unit2 === 'it') {
        convertedValue = value1 * 9.8421e-10;
    } else if (unit1 === 'mg' && unit2 === 'ust') {
        convertedValue = value1 * 1.10231e-9;
    } else if (unit1 === 'mg' && unit2 === 'st') {
        convertedValue = value1 * 1.57473e-7;
    } else if (unit1 === 'mg' && unit2 === 'oz') {
        convertedValue = value1 * 3.5274e-5;
    } else if (unit1 === 'ug' && unit2 === 'kg') {
        convertedValue = value1 / 1e+9;
    } else if (unit1 === 'ug' && unit2 === 'g') {
        convertedValue = value1 / 1e+6;
    } else if (unit1 === 'ug' && unit2 === 'mg') {
        convertedValue = value1 / 1000;
    } else if (unit1 === 'ug' && unit2 === 't') {
        convertedValue = value1 / 1e+12;
    } else if (unit1 === 'ug' && unit2 === 'it') {
        convertedValue = value1 * 9.8421e-13;
    } else if (unit1 === 'ug' && unit2 === 'ust') {
        convertedValue = value1 * 1.10231e-12;
    } else if (unit1 === 'ug' && unit2 === 'st') {
        convertedValue = value1 * 1.57473e-10;
    } else if (unit1 === 'ug' && unit2 === 'oz') {
        convertedValue = value1 * 3.5274e-8;
    } else if (unit1 === 't' && unit2 === 'kg') {
        convertedValue = value1 * 1000;
    } else if (unit1 === 't' && unit2 === 'g') {
        convertedValue = value1 * 1e+6;
    } else if (unit1 === 't' && unit2 === 'mg') {
        convertedValue = value1 * 1e+9;
    } else if (unit1 === 't' && unit2 === 'ug') {
        convertedValue = value1 * 1e+12;
    } else if (unit1 === 't' && unit2 === 'it') {
        convertedValue = value1 * 0.984207;
    } else if (unit1 === 't' && unit2 === 'ust') {
        convertedValue = value1 * 1.10231;
    } else if (unit1 === 't' && unit2 === 'st') {
        convertedValue = value1 * 157.473;
    } else if (unit1 === 't' && unit2 === 'oz') {
        convertedValue = value1 * 35274;
    } else if (unit1 === 'it' && unit2 === 'kg') {
        convertedValue = value1 / 0.000984207;
    } else if (unit1 === 'it' && unit2 === 'g') {
        convertedValue = value1 / 9.8421e-7;
    } else if (unit1 === 'it' && unit2 === 'mg') {
        convertedValue = value1 / 9.8421e-10;
    } else if (unit1 === 'it' && unit2 === 'ug') {
        convertedValue = value1 / 9.8421e-13;
    } else if (unit1 === 'it' && unit2 === 't') {
        convertedValue = value1 / 0.984207;
    } else if (unit1 === 'it' && unit2 === 'ust') {
        convertedValue = value1 / 1.12;
    } else if (unit1 === 'it' && unit2 === 'st') {
        convertedValue = value1 * 142.857;
    } else if (unit1 === 'it' && unit2 === 'oz') {
        convertedValue = value1 * 35840;
    } else if (unit1 === 'ust' && unit2 === 'kg') {
        convertedValue = value1 / 0.00110231;
    } else if (unit1 === 'ust' && unit2 === 'g') {
        convertedValue = value1 / 1.10231e-6;
    } else if (unit1 === 'ust' && unit2 === 'mg') {
        convertedValue = value1 / 1.10231e-9;
    } else if (unit1 === 'ust' && unit2 === 'ug') {
        convertedValue = value1 / 1.10231e-12;
    } else if (unit1 === 'ust' && unit2 === 't') {
        convertedValue = value1 / 1.10231;
    } else if (unit1 === 'ust' && unit2 === 'it') {
        convertedValue = value1 * 0.892857;
    } else if (unit1 === 'ust' && unit2 === 'st') {
        convertedValue = value1 * 142.857;
    } else if (unit1 === 'ust' && unit2 === 'oz') {
        convertedValue = value1 * 32000;
    } else if (unit1 === 'st' && unit2 === 'kg') {
        convertedValue = value1 / 0.157473;
    } else if (unit1 === 'st' && unit2 === 'g') {
        convertedValue = value1 / 0.000157473;
    } else if (unit1 === 'st' && unit2 === 'mg') {
        convertedValue = value1 / 1.57473e-7;
    } else if (unit1 === 'st' && unit2 === 'ug') {
        convertedValue = value1 / 1.57473e-10;
    } else if (unit1 === 'st' && unit2 === 't') {
        convertedValue = value1 / 157.473;
    } else if (unit1 === 'st' && unit2 === 'it') {
        convertedValue = value1 / 142.857;
    } else if (unit1 === 'st' && unit2 === 'ust') {
        convertedValue = value1 / 142.857;
    } else if (unit1 === 'st' && unit2 === 'oz') {
        convertedValue = value1 * 224;
    } else if (unit1 === 'oz' && unit2 === 'kg') {
        convertedValue = value1 / 35.274;
    } else if (unit1 === 'oz' && unit2 === 'g') {
        convertedValue = value1 / 0.035274;
    } else if (unit1 === 'oz' && unit2 === 'mg') {
        convertedValue = value1 / 3.5274e-5;
    } else if (unit1 === 'oz' && unit2 === 'ug') {
        convertedValue = value1 / 3.5274e-8;
    } else if (unit1 === 'oz' && unit2 === 't') {
        convertedValue = value1 / 35274;
    } else if (unit1 === 'oz' && unit2 === 'it') {
        convertedValue = value1 / 35840;
    } else if (unit1 === 'oz' && unit2 === 'ust') {
        convertedValue = value1 / 32000;
    } else if (unit1 === 'oz' && unit2 === 'st') {
        convertedValue = value1 / 224;
    }

    document.getElementById('inputValue2').value = convertedValue.toFixed(2);
}