/**
 * Renderer manages the PlayCanvas WebGL context and core scene setup.
 */
import * as pc from 'playcanvas';
export class Renderer {
    constructor(canvasId) {
        // 1. Grab the canvas from your index.html
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error(`[Lucid Engine] Canvas with ID '${canvasId}' not found.`);
        }

        // 2. Initialize the PlayCanvas Application
        this.app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            keyboard: new pc.Keyboard(window),
            elementInput: new pc.ElementInput(canvas)
        });

        // 3. Configure Canvas Settings
        this.app.start();
        this.app.setCanvasFillMode(pc.FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

        // 4. Handle responsive resizing
        window.addEventListener('resize', () => {
            this.app.resizeCanvas();
        });

        // 5. Initialize the base scene
        this.setupDefaultScene();
    }

    /**
     * Sets up default lighting and a camera so objects are visible immediately.
     */
    setupDefaultScene() {
        // Create a basic Camera
        const camera = new pc.Entity('MainCamera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.12, 0.12, 0.12), // Dark grey editor background
            nearClip: 0.1,
            farClip: 1000
        });
        // Position camera back and up slightly, looking at center
        camera.setLocalPosition(0, 4, 10);
        camera.lookAt(pc.Vec3.ZERO);
        this.app.root.addChild(camera);

        // Create a Directional Light (Sun)
        const light = new pc.Entity('DirectionalLight');
        light.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1, 1, 1),
            castShadows: true,
            intensity: 1,
            shadowBias: 0.2,
            shadowResolution: 2048
        });
        // Angle the light to create depth
        light.setEulerAngles(45, 30, 0);
        this.app.root.addChild(light);
    }

    /**
     * Helper method to expose the PlayCanvas app instance to other managers
     * (like your ScriptBridge or EntityManager).
     * @returns {pc.Application}
     */
    getApp() {
        return this.app;
    }
}
