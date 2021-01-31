const common = require('./webpack.config.common');

module.exports = {
    ...common,
    entry: {
        main: './src/main/main.ts',
    },
    target: 'electron-main',
    output: {
        ...common.output,
        filename: '[name].js',
    },
};
