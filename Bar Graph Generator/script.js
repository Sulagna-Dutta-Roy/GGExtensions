class BarGraph {
    constructor(canvas, axisData) {
        this.canvas = canvas;
        this.dataList = [];
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.fontSize = 12;
        this.maxLabelWidth = 0;

        this.axisData = {
            xMinValue: axisData.xMinValue || 0,
            xMaxValue: axisData.xMaxValue || NaN,
            xAxisLabel: axisData.xAxisLabel || "X Axis",
            xAxisUnit: axisData.xAxisUnit || "unit",
            xAxisDivisionCount: axisData.xAxisDivisionCount || 10,
            yAxisLabel: axisData.yAxisLabel || "Y Axis",
        };

        this.padding = 50;
    }

    addData(name, value, color) {
        const data = {
            name: name || "",
            value: value || 0,
            color: color || this.getRandomColor()
        };

        this.dataList.push(data);
        if (parseFloat(data.value) > this.axisData.xMaxValue) this.axisData.xMaxValue = value;
        const labelWidth = this.getTextWidth(data.name);
        if (labelWidth > this.maxLabelWidth) this.maxLabelWidth = labelWidth;
    }

    clearGraph() {
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGraph() {
        this.clearGraph();
        const ctx = this.canvas.getContext("2d");
        ctx.font = `${this.fontSize}px 'Segoe UI'`;

        if (this.dataList.length === 0) return;

        if (isNaN(this.axisData.xMaxValue)) {
            this.axisData.xMaxValue = Math.max(...this.dataList.map(o => o.value), 0);
        }

        const unitX = (this.height - 2 * this.padding) / (this.axisData.xMaxValue - this.axisData.xMinValue);
        const barWidth = (this.width - 2 * this.padding) / (2 * this.dataList.length);
        let labelRotation = 0;

        if (barWidth < this.maxLabelWidth) {
            labelRotation = Math.acos(barWidth / this.maxLabelWidth);
            ctx.font = `${this.fontSize * 0.75}px 'Segoe UI'`;
        }

        this.dataList.forEach((data, i) => {
            const x = this.padding + barWidth * (2 * i + 1);
            const y = this.height - this.padding - data.value * unitX;
            ctx.fillStyle = data.color;
            ctx.fillRect(x, y, barWidth, data.value * unitX);

            const textWidth = this.getTextWidth(data.name);
            let lx = x + barWidth / 2;
            if (barWidth > this.maxLabelWidth) lx -= textWidth / 2;
            const ly = this.height - this.padding + 1.5 * this.fontSize;

            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(labelRotation);
            ctx.beginPath();
            ctx.fillText(data.name, 0, 0);
            ctx.restore();
        });

        ctx.strokeStyle = "#888";
        ctx.beginPath();
        ctx.moveTo(this.padding, this.padding);
        ctx.lineTo(this.padding, this.height - this.padding);
        ctx.lineTo(this.width - this.padding, this.height - this.padding);
        ctx.stroke();

        ctx.font = `${this.fontSize * 0.75}px 'Segoe UI'`;

        const unitHeight = (this.height - 2 * this.padding) / this.axisData.xAxisDivisionCount;
        const unitSize = (this.axisData.xMaxValue - this.axisData.xMinValue) / this.axisData.xAxisDivisionCount;
        for (let i = 0; i <= this.axisData.xAxisDivisionCount; i++) {
            const y = this.height - this.padding - i * unitHeight;
            ctx.beginPath();
            ctx.moveTo(this.padding - 5, y);
            ctx.lineTo(this.padding + 5, y);
            ctx.stroke();
            ctx.fillStyle = "#888";
            let num = i * unitSize;
            if (num !== num.toFixed(2)) {
                num = num.toFixed(2);
            }
            const textWidth = this.getTextWidth(num.toString());
            ctx.fillText(num, this.padding - textWidth - 8, y + this.fontSize / 2);
        }
    }

    getRandomColor() {
        const colors = [
            "#898CFF", "#5AD0E5", "#668DE5", "#71E096", "#FFDC89",
            "#FF6E40", "#FF96E3", "#4A4F74", "#556467", "#222831"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getTextWidth(text) {
        const textElement = document.createElement("span");
        document.body.appendChild(textElement);
        textElement.innerHTML = text;
        textElement.style.fontSize = `${this.fontSize}px`;
        textElement.style.height = 'auto';
        textElement.style.width = 'auto';
        textElement.style.position = 'absolute';
        textElement.style.whiteSpace = 'nowrap';
        textElement.style.padding = "0";
        const width = Math.ceil(textElement.clientWidth);
        document.body.removeChild(textElement);
        return width;
    }
}

let barGraph;
let canvas;
const scaleFactor = 2;

window.onload = () => {
    canvas = document.getElementById("graph");
    canvas.width = canvas.clientWidth * scaleFactor;
    canvas.height = canvas.clientHeight * scaleFactor;
    canvas.style.transform = `scale(${1 / scaleFactor})`;

    const axisData = { xMinValue: 0 };
    barGraph = new BarGraph(canvas, axisData);
    barGraph.drawGraph();

    document.getElementById("addBtn").addEventListener("click", add);
    document.getElementById("refreshBtn").addEventListener("click", refresh);
    document.getElementById("addRandomBtn").addEventListener("click", addRandom);
}


function add() {
    const name = document.getElementById("name").value;
    const value = document.getElementById("value").value;
    const division = document.getElementById("division").value;
    const color = document.getElementById("color").value;
    const randomColor = document.getElementById("randomColor").checked;

    if (division) barGraph.axisData.xAxisDivisionCount = division;
    if (value) barGraph.addData(name, value, randomColor ? "" : color);
    barGraph.drawGraph();
}

function refresh() {
    const division = document.getElementById("division").value;
    if (division) barGraph.axisData.xAxisDivisionCount = division;
    barGraph.drawGraph();
}

function addRandom() {
    const value = Math.ceil(Math.random() * 100);
    const lblLength = Math.ceil(Math.random() * 6) + 4;
    const letters = "ABCDEFGHIJ";
    barGraph.addData(letters.substring(0, lblLength), value, "");
    barGraph.drawGraph();
}
