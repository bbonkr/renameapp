const path = require('path');

const isEnvDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    devtool: isEnvDevelopment ? 'source-map' : false,
    mode: isEnvDevelopment ? 'development' : 'production',
    output: { path: path.join(__dirname, 'dist') },
    node: { __dirname: false, __filename: false },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|svg|ico|icns|eot|woff|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets',
                },
            },
        ],
    },
};
