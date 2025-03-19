const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

defaultConfig[ 0 ] = {
	...defaultConfig[ 0 ],
	...{
		entry: {
      queryCarouselEdit: './src/query-carousel/edit.jsx',
      queryCarouselView: './src/query-carousel/view.js',
		},
	},
};

module.exports = defaultConfig;
