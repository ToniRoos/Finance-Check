const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        compress: true,
        port: 9000,
        hot: true,
        client: {
            progress: true,
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
            }
        }
    },

});