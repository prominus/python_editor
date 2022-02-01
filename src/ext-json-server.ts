/* --------------------------------------------------------------------------------------------
 * Licensed under the MIT License.
 * ------------------------------------------------------------------------------------------ */
import { StreamMessageReader, StreamMessageWriter } from 'vscode-jsonrpc/node';
import { start } from "./json-server";

const reader = new StreamMessageReader(process.stdin);
const writer = new StreamMessageWriter(process.stdout);
start(reader, writer);
