(function() {
    if (document.getElementById('annotationSidebar')) return;

    // Add Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'annotationSidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '10px';
    sidebar.style.left = '10px';
    sidebar.style.width = '220px';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.border = '1px solid #ccc';
    sidebar.style.zIndex = '10000';
    sidebar.style.padding = '10px';
    sidebar.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.display = 'none';
    sidebar.style.borderRadius = '8px';
    document.body.appendChild(sidebar);

    sidebar.innerHTML = `
        <div id="dragHandle" style="padding: 5px 10px; cursor: move; height:30px; background: #007bff; color: white; display: flex; align-items: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <span style="flex-grow: 1; text-align: center;">☰ Drag</span>
            <button id="closeSidebar" style="background: transparent; border: none; font-size: 16px; color: white; cursor: pointer; color: red">✖</button>
        </div>
        <button id="startAnnotation" style="border-radius: 8px; margin: 10px 0; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer;" title="Start Annotation">Start Annotation</button>
        <button id="stopAnnotation" style="display: none; border-radius: 8px; margin: 10px 0; padding: 10px; background: #dc3545; color: white; border: none; cursor: pointer;" title="Stop Annotation">Stop Annotation</button>
        <button id="screenshotButton" style="border-radius: 8px; margin: 10px 0; padding: 10px; background: #17a2b8; color: white; border: none; cursor: pointer;" title="Take only Annotation Screenshot">Annotation Screenshot</button>
        <button id="clearButton" style="border-radius: 8px; margin: 10px 0; padding: 10px; background: #ffc107; color: black; border: none; cursor: pointer;" title="Clear Annotations">Clear Annotations</button>
        <label for="penWidthInput" id="penInputText" style="display: none; margin: 7px 0; font-size: 14px;">Pen Size:</label>
        <input id="penWidthInput" type="range" min="1" max="20" value="2" style="margin: 10px 0; display: none;">
        <label for="colorPickerInput" id="colorInputText" style="display: none; margin: 7px 0; font-size: 14px;">Choose Color:</label>
        <input id="colorPickerInput" type="color" value="#000000" style="margin: 10px 0; display: none; width: 80px">
        <button id="undoButton" style="display: none; border-radius: 8px; margin: 10px 0; padding: 10px; background: #6c757d; color: white; border: none; cursor: pointer;" title="Undo Last Annotation">Undo</button>
    `;

    const startAnnotationButton = document.getElementById('startAnnotation');
    const stopAnnotationButton = document.getElementById('stopAnnotation');
    const screenshotButton = document.getElementById('screenshotButton');
    const clearButton = document.getElementById('clearButton');
    const closeSidebarButton = document.getElementById('closeSidebar');
    const dragHandle = document.getElementById('dragHandle');
    const penWidthInput = document.getElementById('penWidthInput');
    const colorPickerInput = document.getElementById('colorPickerInput');
    const undoButton = document.getElementById('undoButton');
    const penInputText = document.getElementById('penInputText');
    const colorInputText = document.getElementById('colorInputText');


    // Annotation Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'annotationCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let drawing = false;
    let penColor = '#000000';
    let penWidth = 2;
    const paths = [];
    let currentPath = [];

/*     const penWidthInput = document.createElement('input');
    penWidthInput.type = 'range';
    penWidthInput.min = 1;
    penWidthInput.max = 20;
    penWidthInput.value = 2;
    penWidthInput.style.display = 'none';
    penWidthInput.style.margin = '10px 0';
    sidebar.appendChild(penWidthInput);

    const colorPickerInput = document.createElement('input');
    colorPickerInput.type = 'color';
    colorPickerInput.value = '#000000';
    colorPickerInput.style.display = 'none';
    colorPickerInput.style.margin = '10px 0';
    sidebar.appendChild(colorPickerInput); */

   /*  const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.style.display = 'none';
    undoButton.style.borderRadius = '8px';
    undoButton.style.margin = '10px 0';
    undoButton.style.padding = '10px';
    undoButton.style.background = '#6c757d';
    undoButton.style.color = 'white';
    undoButton.style.border = 'none';
    undoButton.style.cursor = 'pointer';
    sidebar.appendChild(undoButton); */

    penWidthInput.addEventListener('input', (e) => {
        penWidth = e.target.value;
    });

    colorPickerInput.addEventListener('input', (e) => {
        penColor = e.target.value;
    });

    startAnnotationButton.addEventListener('click', () => {
        canvas.style.display = 'block';
        canvas.style.cursor = 'crosshair';
        startAnnotationButton.style.display = 'none';
        stopAnnotationButton.style.display = 'inline';
        penWidthInput.style.display = 'block';
        colorPickerInput.style.display = 'block';
        undoButton.style.display = 'block';
        clearButton.style.display = 'block';
        penInputText.style.display = 'block';
        colorInputText.style.display = 'block';
    });

    stopAnnotationButton.addEventListener('click', () => {
        canvas.style.display = 'none';
        canvas.style.cursor = 'default';
        startAnnotationButton.style.display = 'inline';
        stopAnnotationButton.style.display = 'none';
        penWidthInput.style.display = 'none';
        colorPickerInput.style.display = 'none';
        undoButton.style.display = 'none';
        clearButton.style.display = 'none';
        penInputText.style.display = 'none';
        colorInputText.style.display = 'none';
    });

    undoButton.addEventListener('click', () => {
        paths.pop();
        redraw();
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.style.display = 'none';
    });

    clearButton.addEventListener('click', () => {
        paths.length = 0;
        redraw();
    });

    let isDragging = false;
    let offsetX, offsetY;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - sidebar.getBoundingClientRect().left;
        offsetY = e.clientY - sidebar.getBoundingClientRect().top;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    function onDrag(e) {
        if (isDragging) {
            sidebar.style.left = `${e.clientX - offsetX}px`;
            sidebar.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    }

    canvas.addEventListener('mousedown', (e) => {
        if (e.target.id === 'annotationCanvas') {
            drawing = true;
            currentPath = [{ x: e.clientX, y: e.clientY, color: penColor, width: penWidth }];
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            currentPath.push({ x: e.clientX, y: e.clientY, color: penColor, width: penWidth });
            ctx.lineTo(e.clientX, e.clientY);
            ctx.strokeStyle = penColor;
            ctx.lineWidth = penWidth;
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (drawing) {
            paths.push(currentPath);
            drawing = false;
            ctx.closePath();
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (drawing) {
            paths.push(currentPath);
            drawing = false;
            ctx.closePath();
        }
    });

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            ctx.beginPath();
            path.forEach((point, index) => {
                ctx.strokeStyle = point.color;
                ctx.lineWidth = point.width;
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
            });
            ctx.closePath();
        });
    }

    screenshotButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'screenshot.png';
        link.click();
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'toggleSidebar') {
            sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'flex' : 'none';
        }
    });

})();



/* (function() {
    if (document.getElementById('annotationSidebar')) return;

    // Add Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'annotationSidebar';
    sidebar.classList.add('collapsed');
    sidebar.style.position = 'fixed';
    sidebar.style.top = '10px';
    sidebar.style.left = '10px';
    sidebar.style.width = '150px';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.border = '1px solid #ccc';
    sidebar.style.zIndex = '10000';
    sidebar.style.padding = '10px';
    sidebar.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    document.body.appendChild(sidebar);

    sidebar.innerHTML = `
        <div id="dragHandle" style="cursor: grab; padding: 5px; background: #007bff; color: white; border-radius: 50%; width: 100%; text-align: center;">☰</div>
        <div id="tools" style="display: none;">
            <label for="penWidth">Pen Width:</label>
            <input type="range" id="penWidth" min="1" max="20" value="2"><br><br>
            <label for="colorPicker">Color:</label>
            <input type="color" id="colorPicker" value="#000000"><br><br>
            <button id="undoButton">Undo</button>
            <button id="startAnnotation">Start Annotation</button>
            <button id="stopAnnotation" style="display: none;">Stop Annotation</button>
        </div>
    `;

    const dragHandle = document.getElementById('dragHandle');
    const toolsDiv = document.getElementById('tools');
    const startAnnotationButton = document.getElementById('startAnnotation');
    const stopAnnotationButton = document.getElementById('stopAnnotation');
    let isDragging = false;
    let offsetX, offsetY;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragHandle.style.cursor = 'grabbing';
        offsetX = e.clientX - sidebar.getBoundingClientRect().left;
        offsetY = e.clientY - sidebar.getBoundingClientRect().top;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onStopDrag);
    });

    function onDrag(e) {
        if (isDragging) {
            sidebar.style.left = `${e.clientX - offsetX}px`;
            sidebar.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onStopDrag() {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onStopDrag);
    }

    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('expanded');
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('expanded')) {
            toolsDiv.style.display = 'block';
        } else {
            toolsDiv.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('expanded') && !e.target.closest('#annotationSidebar')) {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            toolsDiv.style.display = 'none';
        }
    });

    // Prevent annotation on the sidebar
    sidebar.addEventListener('mousedown', (e) => e.stopPropagation());
    sidebar.addEventListener('mousemove', (e) => e.stopPropagation());
    sidebar.addEventListener('mouseup', (e) => e.stopPropagation());

    // Annotation Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'annotationCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let drawing = false;
    let penColor = '#000000';
    let penWidth = 2;
    const paths = [];
    let currentPath = [];

    const penWidthInput = document.getElementById('penWidth');
    const colorPickerInput = document.getElementById('colorPicker');
    const undoButton = document.getElementById('undoButton');

    penWidthInput.addEventListener('input', (e) => {
        penWidth = e.target.value;
    });

    colorPickerInput.addEventListener('input', (e) => {
        penColor = e.target.value;
    });

    startAnnotationButton.addEventListener('click', () => {
        canvas.style.display = 'block';
        startAnnotationButton.style.display = 'none';
        stopAnnotationButton.style.display = 'inline';
    });

    stopAnnotationButton.addEventListener('click', () => {
        canvas.style.display = 'none';
        startAnnotationButton.style.display = 'inline';
        stopAnnotationButton.style.display = 'none';
    });

    undoButton.addEventListener('click', () => {
        paths.pop();
        redraw();
    });

    canvas.addEventListener('mousedown', (e) => {
        if (e.target.id === 'annotationCanvas') {
            drawing = true;
            currentPath = [{ x: e.clientX, y: e.clientY, color: penColor, width: penWidth }];
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            currentPath.push({ x: e.clientX, y: e.clientY, color: penColor, width: penWidth });
            ctx.lineTo(e.clientX, e.clientY);
            ctx.strokeStyle = penColor;
            ctx.lineWidth = penWidth;
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (drawing) {
            paths.push(currentPath);
            drawing = false;
            ctx.closePath();
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (drawing) {
            paths.push(currentPath);
            drawing = false;
            ctx.closePath();
        }
    });

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            ctx.beginPath();
            path.forEach((point, index) => {
                ctx.strokeStyle = point.color;
                ctx.lineWidth = point.width;
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
            });
            ctx.closePath();
        });
    }
})();
 */