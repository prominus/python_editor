require('monaco-editor');
(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}
require('./client');
