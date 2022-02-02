/* --------------------------------------------------------------------------------------------
 * Licensed under the MIT License.
 * ------------------------------------------------------------------------------------------ */

import {listen} from '@codingame/monaco-jsonrpc';
import * as monaco from 'monaco-editor';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection, MessageConnection
} from '@codingame/monaco-languageclient';
import normalizeUrl from 'normalize-url';
import ReconnectingWebSocket from 'reconnecting-websocket';

// Register python language with monaco editor
monaco.languages.register({
    id: 'python',
    extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi'],
    aliases: ['Python', 'py'],
    firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
});

// Initial value in editor box
const value = 'print(\'Hello World!\')';

// Initialization of the editor in the html element
monaco.editor.create(document.body, {
    model: monaco.editor.createModel(value, 'python', monaco.Uri.parse('inmemory:/file.py')),
    glyphMargin: true,
    lightbulb: {
        enabled: true
    },
    minimap: {
        enabled: false
    },
    // False will turn line numbers off so ignore the error here
    // @ts-ignore
    lineNumbers: false,
});


// install Monaco language client services
// Typescript will complain here that we're trying to pass monaco from monaco-editor when we should be passing monaco from monaco-editor-core.
// Ignoring this error because the underlying javascript will accept this object as they have the same class signature
// @ts-ignore
MonacoServices.install(monaco);

// create the web socket
const url = createUrl('/sampleServer')
const webSocket = createWebSocket(url);
// listen when the web socket is opened
listen({
    webSocket,
    onConnection: connection => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
    }
});

function createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['python'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    });
}

function createUrl(path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://${location.host}${location.pathname}${path}`);
}

function createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    const websocket = new ReconnectingWebSocket(url, [], socketOptions);
    // @ts-ignore
    return websocket as WebSocket;
}
