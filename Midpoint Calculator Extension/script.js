document.getElementById('myButton').addEventListener('click', function() {
    const point1 = document.getElementById('point1').value.split(',');
    const point2 = document.getElementById('point2').value.split(',');

    if (point1.length === 2 && point2.length === 2) {
        const x1 = parseFloat(point1[0]);
        const y1 = parseFloat(point1[1]);
        const x2 = parseFloat(point2[0]);
        const y2 = parseFloat(point2[1]);

        if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            document.getElementById('result').innerText = `Midpoint: (${midX}, ${midY})`;
        } else {
            document.getElementById('result').innerText = 'Please enter valid numbers.';
        }
    } else {
        document.getElementById('result').innerText = 'Please enter two points in the format x,y.';
    }
});
