const path = require('node:path');

module.exports = {
	devtool: false,
	mode: 'development',
	entry: {
		vendor: ['react', 'react-dom'],
		login: {
			import: './src/pages/login.js',
		},
		home: {
			import: './src/pages/home.js',
			dependOn: 'vendor',
		},
		app: {
			import: './src/app.js',
			dependOn: 'vendor',
		},
	},
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, './build'),
	}
}
