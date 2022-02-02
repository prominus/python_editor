/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require('path');
const lib = path.resolve(__dirname, "lib");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    
    entry: {
        "main": path.resolve(lib, "main.js"),
        "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: lib,
        clean: true,
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.ttf$/,
            use: ['file-loader']
        },
        {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'source-map-loader',
            // These modules seems to have broken sourcemaps, exclude them to prevent an error flood in the logs
            exclude: [/vscode-jsonrpc/, /vscode-languageclient/, /vscode-languageserver-protocol/]
        }]
    },
    target: ['web', 'es5'],
    resolve: {
        alias: {
            'vscode': require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility')
        },
        extensions: ['.js', '.json', '.ttf'],
    },
    plugins: [
		new HtmlWebPackPlugin()
	]
};