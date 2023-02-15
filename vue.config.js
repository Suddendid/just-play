const isDebug = process.env.VUE_APP_DEBUG === "enable";

process.env.VUE_APP_VERSION = require("./package.json").version;
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    configureWebpack: (config) => {
    },
    publicPath: "./",
    css: {
        loaderOptions: {
            // sass: {
            //   prependData: `
            //   @import "@/styles/_variables.scss";
            //   @import "@/styles/_mixins.scss";
            //   @import "@/styles/_functions.scss";
            //   `,
            // },
        },
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
};
