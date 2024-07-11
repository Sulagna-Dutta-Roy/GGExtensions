document.getElementById('myButton').addEventListener('click', function() {
    const point1 = document.getElementById('point1').value.split(',');
    const point2 = document.getElementById('point2').value.split(',');

    if (point1.length === 3 && point2.length === 3) {
        const x1 = parseFloat(point1[0]);
        const y1 = parseFloat(point1[1]);
        const z1 = parseFloat(point1[2]);
        const x2 = parseFloat(point2[0]);
        const y2 = parseFloat(point2[1]);
        const z2 = parseFloat(point2[2]);
        const a = x2-x1;
        const b = y2-y1;
        const c = z2-z1;

        
            
            const ans = Math.sqrt(a*a + b*b + c*c);

            document.getElementById('result').innerText = `Distance: (${ans})`;
        
    } else {
        document.getElementById('result').innerText = 'Please enter two points in the format x,y,z.';
    }
});