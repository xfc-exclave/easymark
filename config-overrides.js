const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(new MonacoWebpackPlugin({
        languages: ['markdown']
    }));
    config.resolve.fallback = {
        fs: false,
        path: require.resolve('path-browserify')
    }
    return config;
}