const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

console.log('---------build-------x--')

module.exports = {
    alias: {
        mock: path.join(__dirname, './mock')
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: 'markdown'
        })
    ]
}