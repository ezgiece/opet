const webpack = require('webpack')

const Dotenv = require('dotenv-webpack');

module.exports = {
    publicPath: '/' + process.env.VUE_APP_SUB_PATH ? process.env.VUE_APP_SUB_PATH : '',
    "transpileDependencies": [
        "vuetify"
    ],
    configureWebpack: {
        plugins: [new Dotenv({
                path: './.env.' + process.env.VUE_APP_ENV,
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jquery: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            })
        ]
    }
}