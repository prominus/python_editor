const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		app: './dist/main.js',
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
	},
	resolve: {
		alias: {
			'vscode': require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility')
		},
		extensions: ['.ts', '.js', '.json', '.ttf']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
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
			},
			{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
                // These modules seems to have broken sourcemaps, exclude them to prevent an error flood in the logs
                exclude: [/vscode-jsonrpc/, /vscode-languageclient/, /vscode-languageserver-protocol/]
            }
		]
	},
	target: 'web',
	plugins: [
		new HtmlWebPackPlugin({
			title: 'Monaco Editor Sample',
		})
	]
};
