/**
 * ScriptBridge manages the execution of dynamic scripts on PlayCanvas entities.
 */
export class ScriptBridge {
    constructor(app) {
        this.app = app;
        // Keep track of active scripts for each entity
        this.entityScripts = new Map(); 
    }

    /**
     * Compiles and attaches a script to an entity.
     * @param {pc.Entity} entity - The PlayCanvas entity
     * @param {string} code - The user-written JS from Monaco
     */
    applyScript(entity, code) {
        try {
            // Create a function that accepts 'entity' and 'app' as arguments
            // We use 'new Function' to execute the string as code
            const scriptFunction = new Function('entity', 'app', code);

            // Store the function so we can clear/update it later
            this.entityScripts.set(entity.guid, scriptFunction);

            // Execute the script immediately
            scriptFunction(entity, this.app);
            
            console.log(`Script applied successfully to ${entity.name}`);
        } catch (err) {
            console.error("Script Execution Error:", err);
            // Here you can trigger a notification in your UI
        }
    }

    /**
     * Updates all active scripts on every frame (if needed)
     */
    update(dt) {
        // If your scripts need to run every frame, 
        // you would iterate through this.entityScripts here
        // and call them with dt.
    }
}
