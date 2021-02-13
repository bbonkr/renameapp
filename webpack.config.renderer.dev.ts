// const path = require('path');
// const webpack = require('webpack');
// const rendererConfig = require('./webpack.config.renderer');
// const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

import path from 'path';
import webpack from 'webpack';
import rendererConfig from './webpack.config.renderer';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default {
    ...rendererConfig,
    mode: 'development',
    devtool: 'eval',
    plugins: [
        ...rendererConfig.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshPlugin(),
    ],
    devServer: {
        port: 3000,
        host: '0.0.0.0',
        contentBase: path.resolve('dist'),
        historyApiFallback: true,
        hot: true,
        hotOnly: true,
        inline: true,
        publicPath: '/',
        watchContentBase: true,
        writeToDisk: true,
    },
};
