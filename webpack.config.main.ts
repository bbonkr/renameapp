// const common = require('./webpack.config.common');
import common from './webpack.config.common';

export default {
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
