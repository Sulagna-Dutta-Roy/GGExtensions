const from = document.getElementById('from');
const to = document.getElementById('to');
const input = document.getElementById('value');
const result = document.getElementById("result");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("convert").addEventListener("click", convert)
    document.getElementById('clear').addEventListener('click', clearAll);
})

function convert() {

    if (input.value == "") {
        alert("Please enter a value to convert!")
        return
    }
    const input_value = input.value;
    const decimal_value = parseInt(input_value, from.value);

    if (isNaN(decimal_value)) {
        alert("Invalid number for selected base!")
        return
    }
    
    const output_value = decimal_value.toString(to.value).toUpperCase();

    result.innerHTML = `${input_value}<sub>${from.value}</sub> = ${output_value}<sub>${to.value}</sub>`
}

function clearAll() {
    from.value = "10"
    to.value = "2"
    input.value = ""
    result.innerHTML = ``
}

