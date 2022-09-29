
const isDebug = process.env.VUE_APP_DEBUG === "enable";

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  configureWebpack: (config) => {
  },
  publicPath:"./",
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
};
