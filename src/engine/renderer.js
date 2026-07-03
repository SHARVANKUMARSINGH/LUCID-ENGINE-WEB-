import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Color4 } from '@babylonjs/core';

export class Renderer {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) throw new Error(`[Lucid Engine] Canvas '${canvasId}' not found.`);

        // 1. Initialize Babylon Engine and Scene
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);
        
        // Dark grey editor background
        this.scene.clearColor = new Color4(0.12, 0.12, 0.12, 1);

        // 2. Start the Render Loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // 3. Handle window resizing
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.setupDefaultScene();
    }

    setupDefaultScene() {
        // Create a controllable camera
        const camera = new FreeCamera("MainCamera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
        
        // Attach camera controls to the canvas so you can look around
        camera.attachControl(this.engine.getRenderingCanvas(), true);

        // Add basic lighting so cubes aren't pitch black
        const light = new HemisphericLight("DirectionalLight", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }

    getScene() {
        return this.scene;
    }
}