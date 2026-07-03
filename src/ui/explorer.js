/**
 * Explorer manages the UI tree view of your game objects.
 */
export class Explorer {
    /**
     * @param {string} containerId - The HTML ID of the div where the explorer lives.
     * @param {Function} onOpenScriptEditor - Callback fired when the '+' is clicked.
     */
    constructor(containerId, onOpenScriptEditor) {
        this.container = document.getElementById(containerId);
        this.onOpenScriptEditor = onOpenScriptEditor;
        
        if (!this.container) {
            console.error(`[Lucid Engine] Explorer container '${containerId}' not found.`);
        }
    }

    /**
     * Clears and re-renders the DOM tree based on SceneGraph data.
     * @param {Array} hierarchyData - The data from sceneGraph.getHierarchyData()
     */
    render(hierarchyData) {
        this.container.innerHTML = ''; // Clear current tree
        const ul = document.createElement('ul');
        ul.className = 'explorer-tree';
        
        hierarchyData.forEach(node => {
            ul.appendChild(this._createNodeElement(node));
        });
        
        this.container.appendChild(ul);
    }

    /**
     * Recursively builds the list items.
     * @private
     */
    _createNodeElement(node) {
        const li = document.createElement('li');
        li.className = 'explorer-item';
        
        // The visible text of the entity
        const title = document.createElement('span');
        title.className = 'explorer-title';
        title.textContent = node.name;
        
        // The "Plus" button (hidden by default via CSS)
        const addScriptBtn = document.createElement('button');
        addScriptBtn.innerHTML = '+';
        addScriptBtn.className = 'action-btn'; // CSS handles the pulse and hover reveal
        addScriptBtn.title = 'Add/Edit Script';
        
        // Open Monaco Editor when clicked
        addScriptBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent clicking the row itself
            this.onOpenScriptEditor(node.id, node.name);
        });
        
        li.appendChild(title);
        li.appendChild(addScriptBtn);
        
        // If it has children, render them recursively
        if (node.children && node.children.length > 0) {
            const childUl = document.createElement('ul');
            node.children.forEach(childNode => {
                childUl.appendChild(this._createNodeElement(childNode));
            });
            li.appendChild(childUl);
        }
        
        return li;
    }
}
