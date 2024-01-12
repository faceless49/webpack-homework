const path = require('node:path');

module.exports = {
	// не изменять!
	devtool: false,
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.cooljson$/,
				type: 'json'
			}
		]
	},
	entry: {
		app: {
			import: './src/app.js',
		},
	},
	output: {
		path: path.resolve(__dirname, './bundle'),
		filename: 'awesome-bundle.js'
	},
	resolve: {
		extensions: ['...', '.cooljson',],
		alias: {
			Components: path.resolve(__dirname, 'src/components'),
			_: [path.resolve(__dirname, 'src/helpers'), path.resolve(__dirname, 'src/utilities')],
			Helpers: path.resolve(__dirname, 'src/helpers'),
			Utils: path.resolve(__dirname, 'src/utilities'),
		},
		fallback: {
			coolurl: path.resolve(__dirname, 'src/utilities/url.js'),
		}
	}
	// ...ваш конфиг
}
