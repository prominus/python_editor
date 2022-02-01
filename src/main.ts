/* --------------------------------------------------------------------------------------------
 * Licensed under the MIT License.
 * ------------------------------------------------------------------------------------------ */
require('monaco-editor');

(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}

require('./client');
require('./container');

