import { MeshBuilder, TransformNode } from '@babylonjs/core';

export class SceneGraph {
    constructor(scene) {
        this.scene = scene;
        // Map to store entities by their Babylon uniqueId
        this.entities = new Map(); 
    }

    addCube(name = 'New Cube') {
        // Create a 3D box in Babylon
        const cube = MeshBuilder.CreateBox(name, { size: 1 }, this.scene);
        
        // Store it using its unique ID as a string
        const id = cube.uniqueId.toString();
        this.entities.set(id, cube);
        
        return cube;
    }

    addPart(name = 'New Part') {
        // TransformNodes are empty containers (like folders) in Babylon
        const part = new TransformNode(name, this.scene);
        
        const id = part.uniqueId.toString();
        this.entities.set(id, part);
        
        return part;
    }

    getHierarchyData() {
        const hierarchy = [];
        
        this.entities.forEach((entity, id) => {
            // Only push root-level items (items with no parent)
            if (!entity.parent) {
                hierarchy.push(this._buildNode(entity));
            }
        });

        return hierarchy;
    }

    _buildNode(entity) {
        const node = {
            id: entity.uniqueId.toString(),
            name: entity.name,
            children: []
        };

        const children = entity.getChildren();
        for (let i = 0; i < children.length; i++) {
            if (this.entities.has(children[i].uniqueId.toString())) {
                node.children.push(this._buildNode(children[i]));
            }
        }

        return node;
    }
}