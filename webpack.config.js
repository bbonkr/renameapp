const path = require('path');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    name: 'react build',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'hidden-source-map' : 'eval',
    target: 'electron-renderer',
    // node: {
    //     __dirname: false,
    //     __filename: false,
    // },
    resolve: {
        extensions: ['.js', 'jsx'],
    },
    entry: {
        'renderer/index': './src/renderer/index.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
                exclude: /node_modules/,
            },
            // {
            //     test: /\.css$/,
            //     use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            // },
            {
                test: /.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },
    plugins: [new webpack.LoaderOptionsPlugin({ dev: !isProduction })],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
};
