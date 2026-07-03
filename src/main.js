import { Renderer } from './engine/renderer.js';
import { SceneGraph } from './engine/scene-graph.js';
import { ScriptBridge } from './api/script-bridge.js';
import { Explorer } from './ui/explorer.js';
import { ScriptEditor } from './ui/editor.js';

// 1. Initialize Engine Core
const renderer = new Renderer('lucid-canvas');
const app = renderer.getApp();
const sceneGraph = new SceneGraph(app);
const scriptBridge = new ScriptBridge(app);

// 2. Initialize UI Components
const scriptEditor = new ScriptEditor('monaco-container', (entityId, code) => {
    // When "Save" is clicked, pass the code to the ScriptBridge
    const entity = sceneGraph.entities.get(entityId);
    if (entity) {
        scriptBridge.applyScript(entity, code);
    }
});

const explorer = new Explorer('explorer-container', (entityId, entityName) => {
    // When '+' is clicked, open the Monaco Editor
    scriptEditor.open(entityId, entityName);
});

// 3. Setup Button Listeners
document.getElementById('btn-add-cube').addEventListener('click', () => {
    sceneGraph.addCube('New Cube');
    explorer.render(sceneGraph.getHierarchyData());
});

document.getElementById('btn-add-part').addEventListener('click', () => {
    sceneGraph.addPart('New Part');
    explorer.render(sceneGraph.getHierarchyData());
});