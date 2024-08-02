// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const xInput = document.getElementById('x-data');
    const yInput = document.getElementById('y-data');
    const zInput = document.getElementById('z-data');
    const generateGraphButton = document.getElementById('generate-graph');
    const graphDiv = document.getElementById('graph');

    generateGraphButton.addEventListener('click', () => {
        const xData = xInput.value.split(',').map(Number);
        const yData = yInput.value.split(',').map(Number);
        const zData = zInput.value.split(',').map(Number);

        const data = [{
            x: xData,
            y: yData,
            z: zData,
            type: 'scatter3d',
            mode: 'markers',
            marker: {
                size: 5,
                color: 'rgba(217, 217, 217, 0.14)',
                colorscale: 'Viridis',
            }
        }];

        const layout = {
            margin: { t: 0 },
            scene: {
                xaxis: { title: 'X Axis' },
                yaxis: { title: 'Y Axis' },
                zaxis: { title: 'Z Axis' }
            }
        };

        Plotly.newPlot(graphDiv, data, layout);
    });
});
