// Editor imports
import * as monaco from 'monaco-editor';
import {
	MonacoLanguageClient, MessageConnection, CloseAction, ErrorAction, MonacoServices, createConnection
} from '@codingame/monaco-languageclient';

// Networking imports
import {listen} from '@codingame/monaco-jsonrpc';
import normalizeUrl from 'normalize-url';
const ReconnectingWebSocket = require('reconnecting-websocket');

// import path = require('path');
const python_file = 'C:/Users/Magenta/Documents/MonacoEditor/demo/file.py';
// const what_dis = path.join(__dirname, '..', 'demo', 'file.py');
import './main.css';

(self as any).MonacoEnvironment = {
	getWorkerUrl: () => './editor.worker.bundle.js'
};
const value = ['print(\'Hello World!\')'].join('\n');

// console.log("What even is this path? : " + what_dis);
const editor = monaco.editor.create(document.body, {
	model: monaco.editor.createModel(value, 'python', monaco.Uri.parse('inmemory://dummy.py')),
	value: value,
	language: 'python',
	minimap: {
		enabled: false
	},
	glyphMargin:true,
	lightbulb: {
		enabled: true
	},
	links: false,
});

// CLIENT

// Install Monaco Language client services
MonacoServices.install(monaco.editor, {rootUri: `file://${python_file}`});

// Create the web socket
const url = createUrl('ws://localhost:3000/py');
const webSocket = createWebSocket(url);
// Listen when the web socket is open
// @ts-ignore
listen({
	webSocket,
	onConnection: connection => {
		// Create and start the language client
		const languageClient = createLanguageClient(connection);
		const disposable = languageClient.start();
		connection.onClose(() => disposable.dispose());
	}
});

function createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
	return new MonacoLanguageClient({
		name: "Python Language Client",
		clientOptions: {
			// Use a language id as a document selector
			documentSelector: ['python'],
			// disable the default error handlers
			errorHandler: {
				error: () => ErrorAction.Continue,
				closed: () => CloseAction.DoNotRestart
			}
		},
		// Create a language client connection from the JSON RPC connection on demand
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
        maxRetries: 100,
        debug: false
	}
	const webSocket = new WebSocket(url, []);
	return webSocket;
}