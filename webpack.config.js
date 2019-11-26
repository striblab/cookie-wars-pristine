const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const WebpackNotifierPlugin = require('webpack-notifier');
// const AWS = require('aws-sdk');
// const S3Plugin = require('webpack-s3-plugin')
const WebpackDeployer = require('webpack-s3-deployer');
// import WebpackDeployer from 'webpack-s3-deployer'

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

console.log(mode);

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
			}, {
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
			},
			{
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
					MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
	    },
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
    new WebpackNotifierPlugin(),
		new WebpackDeployer({
		  environments: {
		    staging: {
		      region: 'us-west-1',
		      params: {
		        Bucket: 'static.startribune.com/staging/news/projects/all/20191106-cookie-wars/build',
		        DistributionId: 'BUCKETIDHERE'
		      }
		    },
		    production: {
		      region: 'us-west-1',
		      params: {
		        Bucket: 'static.startribune.com/news/projects/all/20191106-cookie-wars/build',
		        DistributionId: 'BUCKETIDHERE'
		      }
		    }
		  },
		  options: {
		    autoRun: false,
				// buildPath: __dirname + '/src',
		    // entryHtml: 'index.html',
		    invalidateEntry: false,
		    generateDeployFile: true,
				versioning: false,
		    // versioning: {
		    //   timestamp: true,
		    //   gitHash: true,
		    //   custom: false
		    // },
		    // robots: {
		    //   generate: true,
		    //   items: [
		    //     {
		    //       userAgent: '<UserAgentHere>',
		    //       ignores: [ '<FileName or Directory Here>' ]
		    //     }
		    //   ]
		    // },
		    // slack: {
		    //   channels: ['#channel1', '#channel2'],
		    //   webhook: '<Webhook URL>',
		    //   appTitle: '<Application Title>',
		    //   appLink: '<Application URL>',
		    //   payload: {
		    //     username: '<BotName>',
		    //     icon_emoji: ':ghost:',
		    //     text: '<Slack Notification Text>'
		    //   }
		    // }
		  }
		})
		// new S3Plugin({
    //   // Exclude uploading of html
    //   exclude: /.*\.html$/,
    //   // s3Options are required
    //   s3Options: prod ? {credentials: new AWS.SharedIniFileCredentials({profile: 'default'})}:{},
    //   s3UploadOptions: {
    //     Bucket: 'static.startribune.com/news/projects/all/20191106-cookie-wars/build'
    //   }
    // })
	],
	devtool: prod ? false: 'source-map'
};
