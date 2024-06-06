document.getElementById('calculateButton').addEventListener('click', calculate);

function calculate() {
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const c = parseFloat(document.getElementById("c").value);
    const d = parseFloat(document.getElementById("d").value);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d)) {
        const roots = cubicSolve(a, b, c, d);
        const output = document.getElementById("roots");
        const display = (value) => {
            if (value.i === 0) return `${value.real.toFixed(2)}`;
            else return `${value.real.toFixed(2)} + ${value.i.toFixed(2)}<i>i</i>`;
        };
        output.innerHTML = `
            <div class="sol">
                <h2>Equation :</h2>
                <h3>${a}X<sup>3</sup> + ${b}X<sup>2</sup> + ${c}X + ${d} = 0 </h3>
                <h2>Roots: </h2>
                <ul>
                    <li>X<sub>1</sub> = ${display(roots[0])}</li>
                    <li>X<sub>2</sub> = ${display(roots[1])}</li>
                    <li>X<sub>3</sub> = ${display(roots[2])}</li>
                </ul>
            </div>`;
    } else {
        const output = document.getElementById("roots");
        output.innerHTML = `Enter valid constants...`;
    }
}
