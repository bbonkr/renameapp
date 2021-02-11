const path = require('path');
const common = require('./webpack.config.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...common,
    entry: {
        app: './src/renderer/index',
    },
    target: 'electron-renderer',
    output: {
        ...common.output,
        filename: '[name].bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
    ],
};