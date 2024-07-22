document.getElementById('myButton').addEventListener('click', function () {
    var inputNumbers = document.getElementById("numbers").value;
    var numbersArray = inputNumbers.split(",").map((num) => parseInt(num.trim()));

    var result = calculateLCMAndHCFFromArray(numbersArray);
    document.getElementById("result").innerHTML = "LCM: " + result.lcm + ", HCF: " + result.HCF;
});

function calculateLCMAndHCFFromArray(numbersArray) {
    if (numbersArray.length === 0) return { lcm: 0, HCF: 0 };

    var lcm = numbersArray[0];
    var HCF = numbersArray[0];

    for (var i = 1; i < numbersArray.length; i++) {
        HCF = calculateHCF(HCF, numbersArray[i]);
        lcm = calculateLCMHelper(lcm, numbersArray[i]);
    }

    return { lcm: lcm, HCF: HCF };
}

function calculateLCMHelper(a, b) {
    return Math.abs(a * b) / calculateHCF(a, b);
}

function calculateHCF(a, b) {
    while (b !== 0) {
        var temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
