/**
 * SceneGraph manages the creation, deletion, and hierarchy of all game objects.
 * It serves as the bridge between the PlayCanvas engine and your UI Explorer.
 */
export class SceneGraph {
    constructor(app) {
        this.app = app;
        // Map to store all active entities by their unique GUID
        this.entities = new Map(); 
    }

    /**
     * Creates a new Cube entity and adds it to the scene.
     * @param {string} name - The name of the cube (defaults to 'New Cube')
     * @returns {pc.Entity} The created entity
     */
    addCube(name = 'New Cube') {
        const cube = new pc.Entity(name);
        
        // Add a 3D box model component
        cube.addComponent('model', { 
            type: 'box' 
        });

        // Add it to the main PlayCanvas root
        this.app.root.addChild(cube);
        
        // Store it in our local registry
        this.entities.set(cube.getGuid(), cube);
        
        return cube;
    }

    /**
     * Creates a generic empty "Part" (useful as a folder or empty parent).
     */
    addPart(name = 'New Part') {
        const part = new pc.Entity(name);
        this.app.root.addChild(part);
        this.entities.set(part.getGuid(), part);
        return part;
    }

    /**
     * Removes an entity from the 3D world and the registry.
     * @param {string} guid - The unique ID of the entity to remove
     */
    removeEntity(guid) {
        const entity = this.entities.get(guid);
        if (entity) {
            entity.destroy(); // PlayCanvas handles removing it from the scene
            this.entities.delete(guid);
        }
    }

    /**
     * Reparents an entity (drag-and-drop in the explorer).
     */
    setParent(childGuid, parentGuid) {
        const child = this.entities.get(childGuid);
        const parent = parentGuid ? this.entities.get(parentGuid) : this.app.root;

        if (child && parent) {
            child.reparent(parent);
        }
    }

    /**
     * Generates a clean data tree for your UI Explorer to render.
     * Call this whenever an object is added, removed, or reparented.
     * @returns {Array} Array of object data
     */
    getHierarchyData() {
        const hierarchy = [];
        
        // Iterate through top-level entities in our registry
        this.entities.forEach((entity, guid) => {
            // Only push root-level items (items whose parent is the main app root)
            if (entity.parent === this.app.root) {
                hierarchy.push(this._buildNode(entity));
            }
        });

        return hierarchy;
    }

    /**
     * Recursive helper to build the tree structure for the UI.
     * @private
     */
    _buildNode(entity) {
        const node = {
            id: entity.getGuid(),
            name: entity.name,
            children: []
        };

        // Recursively grab children
        const children = entity.children;
        for (let i = 0; i < children.length; i++) {
            // Only include entities that are tracked in our registry
            if (this.entities.has(children[i].getGuid())) {
                node.children.push(this._buildNode(children[i]));
            }
        }

        return node;
    }
}
