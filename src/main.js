import { Renderer } from './engine/renderer.js';
import { SceneGraph } from './engine/scene-graph.js';
import { ScriptBridge } from './api/script-bridge.js';
import { Explorer } from './ui/explorer.js';
import { ScriptEditor } from './ui/editor.js';

// 1. Initialize Engine Core (Babylon.js)
const renderer = new Renderer('lucid-canvas');
const scene = renderer.getScene(); // Babylon uses the Scene object

const sceneGraph = new SceneGraph(scene);
const scriptBridge = new ScriptBridge(scene); 

// 2. Initialize UI Components
const scriptEditor = new ScriptEditor('monaco-container', (entityId, code) => {
    // When "Compile & Save" is clicked, pass the code to the ScriptBridge
    const entity = sceneGraph.entities.get(entityId);
    if (entity) {
        scriptBridge.applyScript(entity, code);
    }
});

const explorer = new Explorer('explorer-container', (entityId, entityName) => {
    // When the '+' icon is clicked in the explorer, open the Monaco Editor
    scriptEditor.open(entityId, entityName);
});

// 3. Setup Button Listeners for the UI
const btnAddCube = document.getElementById('btn-add-cube');
const btnAddPart = document.getElementById('btn-add-part');

if (btnAddCube) {
    btnAddCube.addEventListener('click', () => {
        sceneGraph.addCube('New Cube');
        // Re-render the UI tree so the new cube shows up
        explorer.render(sceneGraph.getHierarchyData());
    });
}

if (btnAddPart) {
    btnAddPart.addEventListener('click', () => {
        sceneGraph.addPart('New Part');
        // Re-render the UI tree so the new part shows up
        explorer.render(sceneGraph.getHierarchyData());
    });
}

console.log("[Lucid Engine] Initialization Complete. Ready to build.");