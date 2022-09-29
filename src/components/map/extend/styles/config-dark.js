export const THEME = () => {
  const LTFW_COLORS = {
    DEFAULT: "#D8DFEA", // 默认
    NORMAL: "#6196D6", // 有人
    FILTER: "#F5AE4C", // 筛选
    CLICK: "#0BE7FD", // 点击高亮
    HC: "#F5AE4C", //
  };
  const DISTRICT_CONFIG = {
    // 选中
    SELECT: {
      FILL: {
        "fill-color": "#00FEFF",
        "fill-opacity": 0.3, //透明度
      },
    },
    STREET: {
      MINZOOM: 8,
      LINE: {
        "line-color": "#00FEFF",
        "line-width": 3,
        "line-opacity": 1,
      },
      FILL: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.3, //透明度
        // "fill-opacity": ["case", ["<", "zoom", 13], 1, 0], //透明度
      },
    },
    COMMUNITY: {
      MINZOOM: 13,
      LINE: {
        "line-color": "#fff600",
        "line-width": 3,
        "line-opacity": 1,
      },
      FILL: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.3, //透明度
      },
    },
    GRID: {
      MINZOOM: 15,
      LINE: {
        "line-color": "#ff5796",
        "line-width": 3,
        "line-opacity": 1,
      },
      FILL: {
        "fill-color": ["get", "color"],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          16,
          0.3,
          16.0001,
          0,
        ], //透明度
        // "fill-opacity": 0.3, //透明度
      },
    },
    XQM: {
      LINE: {
        "line-color": "#FFB065", //图层颜色
        "line-width": 1.5,
      },
      FILL: {
        "fill-color": "rgba(255,255,255,0)",
        "fill-opacity": 1,
      },
      HIGH_LINE: {
        "line-color": "#00FEFF", //图层颜色
        "line-width": 3,
        "line-opacity": 1, //透明度
      },
    },
  };
  return {
    LTFW_COLORS,
    DISTRICT_CONFIG,
  };
};
