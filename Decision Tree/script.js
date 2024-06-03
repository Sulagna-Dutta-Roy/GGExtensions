// Initial tree data
let treeData = {
    name: "Start",
    children: []
};

// Render the tree
const renderTree = (data, parentElement) => {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = data.name;

    // Add Child button
    const addButton = document.createElement('button');
    addButton.innerHTML = `&plus;`;
    addButton.classList.add('control-btn');
    addButton.onclick = () => {
        const newQuestion = prompt('Enter new question or outcome:');
        if (newQuestion) {
            if (!data.children) data.children = [];
            data.children.push({ name: newQuestion });
            saveTree()
            renderFullTree();
        }
    };
    li.appendChild(addButton);

    // Edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = `&#9998;`;
    editButton.classList.add('control-btn', 'edit-btn');
    editButton.onclick = () => {
        const newName = prompt('Edit question or outcome:', data.name);
        if (newName) {
            data.name = newName;
            saveTree()
            renderFullTree();
        }
    };
    li.appendChild(editButton);

    // expand/collapse button
    const expandCollapseButton = document.createElement('button');
    if (data.children && data.children.length!==0) {
        expandCollapseButton.innerHTML = `&#9660;`;
    }else {
        expandCollapseButton.innerHTML = ``;
    }
    
    expandCollapseButton.classList.add('expand-collapse-btn');
    expandCollapseButton.onclick = (e) => {
        const children = e.target.parentElement.querySelectorAll(":scope > ul")
        console.log(children)
        children.forEach(child => {
            if (child.classList.contains("collapse")) {
                child.classList.remove("collapse")
                expandCollapseButton.innerHTML = `&#9660;`;
            }else {
                child.classList.add("collapse")
                expandCollapseButton.innerHTML = `&#9658;`;
            }
        
        });

    };
    li.insertBefore(expandCollapseButton, li.firstChild);



    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `&times;`;
    deleteButton.classList.add('control-btn', 'delete-btn');
    deleteButton.onclick = () => {
        if (confirm('Are you sure you want to delete this node?')) {
            deleteNode(treeData, data.name);
            saveTree()
            renderFullTree();
        }
    };
    if (data.name != 'Start') li.appendChild(deleteButton);

    if (data.children) {
        data.children.forEach(child => {
            renderTree(child, li);
        });
    }

    ul.appendChild(li);
    parentElement.appendChild(ul);
};

// Render the full tree
const renderFullTree = () => {
    const existing_tree = JSON.parse(localStorage.getItem('tree'));
    if (existing_tree) {
        treeData = existing_tree;
    }else {
        saveTree()
    }
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; // Clear previous tree
    renderTree(treeData, treeContainer);
};

// Delete a node
const deleteNode = (node, name) => {
    if (!node.children) return;
    node.children = node.children.filter(child => child.name !== name);
    node.children.forEach(child => deleteNode(child, name));
};

const saveTree = () => {
    localStorage.setItem('tree', JSON.stringify(treeData));
}

// Initial render
document.addEventListener('DOMContentLoaded', renderFullTree);
