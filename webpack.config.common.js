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
            // webpack@5
            // {
            //     test: /\.m?js/,
            //     resolve: {
            //         fullySpecified: false,
            //     },
            // },
            // {
            //     test: /\.tsx?$/,
            //     exclude: /node_modules/,
            //     use: ['ts-loader'],
            // },
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                '@babel/preset-react',
                            ],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import',
                                isEnvDevelopment && 'react-refresh/babel',
                            ].filter(Boolean),
                        },
                    },
                    'ts-loader',
                ].filter(Boolean),
            },

            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|svg|ico|icns|eot|woff|woff2|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets',
                },
            },
        ],
    },
};
