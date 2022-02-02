/* --------------------------------------------------------------------------------------------
 * Licensed under the MIT License.
 * ------------------------------------------------------------------------------------------ */
require('monaco-editor');
import './main.css';

(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}

require('./client')
require('./container');

