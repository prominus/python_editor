/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {listen} from '@codingame/monaco-jsonrpc';
// import * as monaco from 'monaco-editor-core';
import * as monaco from 'monaco-editor';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection, MessageConnection
} from '@codingame/monaco-languageclient';
import normalizeUrl from 'normalize-url';
const ReconnectingWebSocket = require('reconnecting-websocket');


// register Monaco languages
// monaco.languages.register({
//     id: 'json',
//     extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
//     aliases: ['JSON', 'json'],
//     mimetypes: ['application/json'],
// });

monaco.languages.register({
    id: 'python',
    extensions: ['.py'],
    aliases: ['Python', 'py'],
});

// create Monaco editor
const value = ['print(\'Hello World!\')'].join('\n');
// model: monaco.editor.createModel(value, 'json', monaco.Uri.parse('inmemory://model.json')),
// NOTE! The create model has to stay as json model, otherwise the autofill/autocompletion will not work
monaco.editor.create(document.getElementById("container")!, {
    model: monaco.editor.createModel(value, 'python', monaco.Uri.parse('inmemory:/file.py')),
    glyphMargin: true,
    lightbulb: {
        enabled: true
    },
    minimap: {
        enabled: false
    }
});


// install Monaco language client services
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
    return new ReconnectingWebSocket(url, [], socketOptions);
}
