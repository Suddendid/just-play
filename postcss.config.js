module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      minPixelValue: 0, // 小于或等于`1px`不转换为视窗单位
      rootValue: 100,
      unitPrecision: 5,
      replace: true,
      propList: ["*"],
    },
  },
};
