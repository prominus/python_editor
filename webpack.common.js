/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require('path');
const client = path.resolve(__dirname, "src");
const lib = path.resolve(__dirname, "lib");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    
    entry: {
        "main": path.resolve(client, "main.ts"),
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js'
    },
    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: lib
    },
    module: {
        
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.ttf$/,
            use: ['file-loader']
        }]
    },
    target: ['web', 'es5'],
    resolve: {
        alias: {
            'vscode': require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility')
        },
        extensions: ['.ts', '.js', '.json', '.ttf'],
    },
    plugins: [
		new HtmlWebpackPlugin()
	]
};