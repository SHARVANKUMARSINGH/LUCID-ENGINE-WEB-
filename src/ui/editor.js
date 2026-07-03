import * as monaco from 'monaco-editor';

/**
 * ScriptEditor manages the Monaco Editor modal.
 */
export class ScriptEditor {
    /**
     * @param {string} containerId - The HTML ID where Monaco should render.
     * @param {Function} onSave - Callback fired when the user saves the script.
     */
    constructor(containerId, onSave) {
        this.container = document.getElementById(containerId);
        this.onSave = onSave;
        this.currentEntityId = null;
        
        // Initialize Monaco Editor
        this.editor = monaco.editor.create(this.container, {
            value: '',
            language: 'javascript',
            theme: 'vs-dark', // Standard AA engine dark theme
            automaticLayout: true,
            minimap: { enabled: false } // Keeps the UI cleaner for game scripts
        });

        // Hide editor on startup
        this.container.parentElement.style.display = 'none';
        
        this._setupButtons();
    }

    _setupButtons() {
        const saveBtn = document.getElementById('btn-save-script');
        const closeBtn = document.getElementById('btn-close-script');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const code = this.editor.getValue();
                this.onSave(this.currentEntityId, code);
                this.close();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    /**
     * Opens the editor for a specific entity.
     */
    open(entityId, entityName, existingCode = null) {
        this.currentEntityId = entityId;
        
        // Show the editor wrapper (e.g., a modal background)
        this.container.parentElement.style.display = 'block'; 
        
        // Provide a default template if no code exists yet
        const template = existingCode || `// Script for ${entityName}
        
// This runs once when the script is loaded
console.log("${entityName} initialized.");

// Add your per-frame update logic here
/* entity.on('update', (dt) => {
    
});
*/`;
        
        this.editor.setValue(template);
    }

    /**
     * Closes the editor UI.
     */
    close() {
        this.container.parentElement.style.display = 'none';
        this.currentEntityId = null;
    }
}
