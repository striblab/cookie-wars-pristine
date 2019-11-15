const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const WebpackNotifierPlugin = require('webpack-notifier');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';


module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
				{
				test: /\.svelte$/,
				use: [
				{
	            	loader: 'babel-loader',
	          		options: {
	            		presets: [['@babel/preset-env', {'targets': 'ie >= 11'}]],
	            		plugins: ['@babel/plugin-proposal-object-rest-spread',
	            			["@babel/plugin-transform-runtime", {
						        "absoluteRuntime": false,
						        "corejs": 3,
						        "helpers": true,
						        "regenerator": true,
						        "useESModules": false
    						}]
    					]
	          		}
	          	},
				{
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
	          	]
			},
			{
	            test: /\.(js|mjs)$/,
	            exclude: /node_modules\/(?!svelte|isomorphic-fetch|query-string|split-on-first|strict-uri-encode\/).*/,
	        	use: {
	            	loader: 'babel-loader',
	          		options: {
	          			sourceType: 'unambiguous',
	            		presets: [['@babel/preset-env', {'targets': 'ie >= 11'}]],
	            		plugins: ['@babel/plugin-proposal-object-rest-spread',
	            			["@babel/plugin-transform-runtime", {
						        "absoluteRuntime": false,
						        "corejs": 3,
						        "helpers": true,
						        "regenerator": true,
						        "useESModules": false
    						}],
    					]
	          		}
	        	},
	      	},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
    new WebpackNotifierPlugin(),
	],
	devtool: prod ? false: 'source-map'
};
