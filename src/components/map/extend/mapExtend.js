/**
 * @Description: 地图工具方法扩展
 * @Author yangze
 * @Date 2022/6/17
 */

import * as rem from "@/utils/rem";
// njtoken
export const njtoken = "7a8d0555524fb2e7701d2e109b4291ad";

// 多时相参数配置
export const _dSXWmtsOption = {
  url: "http://mapservices.njghzy.com.cn:84/njmap/NJDOM_DSX/wmts",
  layerIdentifier: "DOMDSX",
  version: "1.0.0",
  layerStyle: "DOMDSX",
  layerMatrixSet: "DOMDSX_Matrix_0",
  format: "image/tile",
};

// 添加到底图图层的Group ID
export const CONSTANT = {
  BASEGROUPID: {
    BOTTOM: "BASEGROUPID_BOTTOM",
    CENTER: "BASEGROUPID_CENTER",
    TOP: "BASEGROUPID_TOP",
    TOP1: "BASEGROUPID_TOP1",
  },
};
// Map扩展方法
const mapExtendFunctions = {
  /**
   * 加载图片
   * @param {*} imageName 图片别名
   * @param {*} imageUrl  图片路径
   * @returns
   */
  loadMapImage: function (imageName, imageUrl) {
    return new Promise((resolve) => {
      if (this.hasImage(imageName)) {
        resolve();
        return;
      }
      this.loadImage(imageUrl, (error, image) => {
        this.addImage(imageName, image);
        resolve();
      });
    });
  },

  /**
   * 批量在地图上加载图片
   * @param {*} images
   * @returns
   */
  batchLoadMapImages: function (images) {
    return Promise.all(
      images.map((e) => {
        return this.loadMapImage(e.imageName, e.imageUrl);
      })
    );
  },

  /**
   * 通过features返回GeoJson格式source
   * @param {*} features
   * @returns
   */
  getDefatultSource: function (features) {
    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features,
      },
    };
  },

  /**
   * 创建source
   * @param {*} id source id
   * @param {*} features
   */
  createSource: function (id, features) {
    if (this.includeSource(id)) {
      this.getSource(id).setData({
        type: "FeatureCollection",
        features: features,
      });
    } else {
      this.addSource(id, this.getDefatultSource(features));
    }
  },

  /**
   * 判断图层是否已经加载
   * @param {*} id 图层 id
   * @returns
   */
  includeLayer: function (id) {
    return this.getLayer(id);
  },

  /**
   * 判断source是否已经加载
   * @param {*} id source id
   * @returns
   */
  includeSource: function (id) {
    return this.getSource(id);
  },

  /**
   * 添加symbol图层
   * @param {*} id 图层唯一标识 自定义
   * @param {*} features 初始化图层数据features 可为[]
   * @param {*} option 图层样式配置项
   * @param {*} groupId 要添加到Group的id 可不传
   */
  createSymbolLayer: function (id, features = [], option = {}, groupId) {
    const {
      layout,
      paint,
      source = this.getDefatultSource(features),
      ...baseOption
    } = option;

    const symbolLayer = {
      id: id, //图层ID
      type: "symbol", //图层类型
      source: source, //数据源
      layout: {
        ...(layout || {}),
      },
      paint: {
        ...(paint || {}),
      },
      ...baseOption,
    };
    if (!groupId) {
      !this.includeLayer(id) && this.addLayer(symbolLayer, groupId);
    } else {
      !this.includeLayer(id) && this.addLayerToGroup(symbolLayer, groupId);
    }
  },

  /**
   * 添加线图层
   * @param {*} id 图层唯一标识 自定义
   * @param {*} features 初始化图层数据features 可为[]
   * @param {*} option 图层样式配置项
   * @param {*} groupId 要添加到Group的id 可不传
   */
  createPolylineLayer(id, features, option = {}, groupId) {
    const {
      layout,
      paint,
      source = this.getDefatultSource(features),
      ...baseOption
    } = option;

    const lineLayer = {
      id: id,
      type: "line",
      source: source,
      layout: {
        ...(layout || {}),
      },
      paint: {
        ...(paint || {}),
      },
      ...baseOption,
    };
    if (!groupId) {
      !this.includeLayer(id) && this.addLayer(lineLayer);
    } else {
      !this.includeLayer(id) && this.addLayerToGroup(lineLayer, groupId);
    }
  },

  /**
   * 添加面图层
   * @param {*} id 图层唯一标识 自定义
   * @param {*} features 初始化图层数据features 可为[]
   * @param {*} option 图层样式配置项
   * @param {*} groupId 要添加到Group的id 可不传
   */
  createPolygonLayer: function (id, features, option = {}, groupId) {
    const {
      layout,
      paint,
      source = this.getDefatultSource(features),
      ...baseOption
    } = option;
    const polygonLayer = {
      id: id,
      type: "fill",
      source: source,
      layout: {
        ...(layout || {}),
      },
      paint: {
        "fill-color": "rgba(239,143,143,0.7)",
        ...(paint || {}),
      },
      ...baseOption,
    };
    if (!groupId) {
      !this.includeLayer(id) && this.addLayer(polygonLayer);
    } else {
      !this.includeLayer(id) && this.addLayerToGroup(polygonLayer, groupId);
    }
  },

  /**
   * 设置数据
   * @param {*} id source id
   * @param {*} features
   */
  setData: function (id, features) {
    this.includeSource(id) &&
      this.getSource(id).setData({
        type: "FeatureCollection",
        features: features,
      });
  },

  // 创建BaseGroup
  createBaseGroup: function () {
    Object.keys(CONSTANT.BASEGROUPID).forEach((e) => {
      this.addLayerGroup([], CONSTANT.BASEGROUPID[e]);
    });
  },
  // 存储需要聚合动态显示的marker
  _clusterMarkers: [],
  // 存储需要移动的事件
  _onMoveHandlers: [],
  // 地图移动事件
  _onMoveHandler: function () {
    this._onMoveHandlers.forEach((handler) => {
      handler();
    });
  },
  // 更新当前层级marker显示
  _updateClusterMarkers: function () {
    const zoom = this.getZoom();
    this._clusterMarkers.forEach((item) => {
      if (zoom > item.minzoom && zoom < item.maxzoom) {
        item.markers.forEach((item) => {
          item.marker.getElement().style.display = item._display;
        });
      } else {
        item.markers.forEach((item) => {
          item.marker.getElement().style.display = "none";
        });
      }
    });
  },
  // 添加移动事件
  setOnMoveHandler: function (handler) {
    handler && this._onMoveHandlers.push(handler);
  },
  // 设置对应markers 层级显示范围
  setMarkersZoomRange: function (markers, minzoom, maxzoom) {
    this._clusterMarkers.push({
      markers: markers.map((marker) => {
        return {
          marker: marker,
          _display: marker.getElement().display || "block",
        };
      }),
      maxzoom: maxzoom,
      minzoom: minzoom,
    });
    this._updateClusterMarkers();
    this.setOnMoveHandler(this._updateClusterMarkers.bind(this));
  },
  /**
   * 添加marker标记组
   * @param {Object}
   *      @param {Array<Object>} items 数据组 PS：每条数据必须包含lngLat坐标点位
   *      @param {Function} elHandler 创建markerDom 回调
   *      @param {option} 创建marker扩展参数
   * @returns
   */
  addMarkers({ items, elHandler, option }) {
    return items.map((item, index) => {
      const marker = new mapboxgl.Marker(elHandler(item, index), {
        offset: option.offset,
      })
        .setLngLat(item.lngLat)
        .addTo(this);
      return marker;
    });
  },
  /**
   * 创建多时相影像图层
   * @param {*} time 影像时间
   * @returns
   */
  createDsxByTime: function (time) {
    const mutilwmts = new GeoGlobe.Layer.GeoWMTSLayer({
      url: _dSXWmtsOption.url, //服务地址
      layer: _dSXWmtsOption.layerIdentifier,
      format: _dSXWmtsOption.format,
      matrixSet: _dSXWmtsOption.layerMatrixSet, //矩阵集名称
      version: _dSXWmtsOption.version, //服务版本
      noFadingParent: true, //无父级瓦片缓存
      time: encodeURIComponent(time), //时间转义
    });
    return mutilwmts;
  },
  addBackGroundBaseLayer: function (opacity) {
    let backLayer = new GeoGlobe.Layer.BackgroundLayer({
      id: "background", //图层ID
      type: "background", //图层类型
      paint: {
        "background-color": "#000", //图层颜色
        "background-opacity": opacity, //图层透明度
      },
    });
    this.addLayerToGroup(backLayer, CONSTANT.BASEGROUPID.BOTTOM); //添加图层
  },
  /**
   * 切换底图
   * @param {*} layerItem 底图配置项
   *      {
   *        type: 1:影像地图 -1:多时相 0:电子底图
   *        dtCustom：自定义底图
   *        time: 多时相影像底图时间 ---- type为1时必传
   *        dtKey:南京天地图底图key
   *        zjKey:南京天地图底图注记Key
   *      }
   * @param {*} GJ 是否需要切换国家底图
   */
  switchBaseMap: function (layerItem, GJ) {
    // 清空图层
    this.clearGroup(CONSTANT.BASEGROUPID.TOP);
    this.clearGroup(CONSTANT.BASEGROUPID.BOTTOM);

    if (GJ) {
      if (layerItem.type == 1 || layerItem.type == -1) {
        const layer_vec = new GeoGlobe.TDTLayer("img_c");
        const layer_cva = new GeoGlobe.TDTLayer("cia_c");
        this.addLayerToGroup(layer_vec, CONSTANT.BASEGROUPID.BOTTOM);
        this.addLayerToGroup(layer_cva, CONSTANT.BASEGROUPID.BOTTOM);
      } else {
        const layer_vec = new GeoGlobe.TDTLayer("vec_c");
        const layer_cva = new GeoGlobe.TDTLayer("cva_c");
        this.addLayerToGroup(layer_vec, CONSTANT.BASEGROUPID.BOTTOM);
        this.addLayerToGroup(layer_cva, CONSTANT.BASEGROUPID.BOTTOM);
      }
    }

    switch (layerItem.type) {
      case -1: {
        if (layerItem.time && layerItem.time.length > 0) {
          // 影像底图
          let dsxLayer = this.createDsxByTime(layerItem.time);
          this.addLayerToGroup(dsxLayer, CONSTANT.BASEGROUPID.BOTTOM);
          // 背景蒙版
          this.addBackGroundBaseLayer();
          // 影像注记
          let zj_layer = new GeoGlobe.NJLayer(layerItem.zjKey);
          this.addLayerToGroup(zj_layer, CONSTANT.BASEGROUPID.TOP);
          // this.setLayerZoomRange(zj_layer.id, 16, 19);
        }
        break;
      }
      case 0:
      case 1:
        {
          let dt_layer = null;
          if (layerItem.dtCustom) {
            dt_layer = new GeoGlobe.Layer.ArcgisVTS({
              style: layerItem.dtCustom,
            });
          } else {
            // 南京电子地图底图
            dt_layer = new GeoGlobe.NJLayer(layerItem.dtKey);
          }
          // 移除 城墙线/城墙 图层
          if (dt_layer.layers) {
            dt_layer.layers = dt_layer.layers.filter(function (l) {
              return l.id && !l.id.includes("城墙");
            });
          }
          dt_layer.sprite && this.loadSprite(dt_layer.sprite);
          dt_layer.glyphs && this.style.setGlyphs(dt_layer.glyphs);
          this.addLayerToGroup(dt_layer, CONSTANT.BASEGROUPID.BOTTOM);

          // 背景蒙版
          this.addBackGroundBaseLayer(0.8);

          setTimeout(() => {
            let zj_layer = new GeoGlobe.NJLayer(layerItem.zjKey);
            // 移除 城墙线/城墙 图层
            if (zj_layer.layers) {
              zj_layer.layers = zj_layer.layers.filter(function (l) {
                return l.id && !l.id.includes("城墙");
              });
              zj_layer.layers.forEach((e) => {
                if (e.layout["text-size"]) {
                  e.layout["text-size"] = rem.fontSize(16);
                }
                if (e.type == "symbol") {
                  e.layout["icon-size"] = rem.fontSize(1);
                }
              });
            }

            zj_layer.sprite && this.loadSprite(zj_layer.sprite);
            zj_layer.glyphs && this.style.setGlyphs(zj_layer.glyphs);
            this.addLayerToGroup(zj_layer, CONSTANT.BASEGROUPID.TOP);
            if (zj_layer.layers) {
              zj_layer.layers.forEach((e) => {
                this.setLayerZoomRange(e.id, 16, 19);
              });
            } else {
              this.setLayerZoomRange(zj_layer.id, 16, 19);
            }
          }, 1000);
        }

        break;
      case 1:
        {
        }

        break;
      default:
        break;
    }
  },
};

// 扩展Map类 增加参数
GeoGlobe.MapExtend = GeoGlobe.Class({
  initialize: function (a) {
    const map = GeoGlobe.Map(a);
    Object.keys(mapExtendFunctions).forEach((key) => {
      map[key] = mapExtendFunctions[key];
    });
    map.on("move", map._onMoveHandler);
    map.on("moveend", map._onMoveHandler);
    return map;
  },
  CLASS_NAME: "GeoGlobe.MapExtend",
});

export class HighlightMark {
  constructor(options) {
    !options.map && console.log("map 不能为空");
    this.lngLat = [118.76220703125, 32.17904090881348];
    this.activeTypes = [0, 1, 2];
    this.map = options.map;
    this._init();
    this.setVisibility(false);
  }
  //   初始化
  _init() {
    this._initSource();
    this._initPolygon();
    this._initPolyline();
    this._initMark();
  }
  //   初始化默认Marker
  _initMark() {
    let div = document.createElement("div");
    // div.style.backgroundImage =
    //   "url(" + require("@/assets/images/mark_blue.png") + ")";
    div.style.backgroundSize = "contain";
    div.style.backgroundRepeat = "no-repeat";
    div.style.width = "48px";
    div.style.height = "48px";
    div.style.zIndex = "10";
    this.marker = new mapboxgl.Marker(div)
      .setLngLat(this.lngLat)
      .setOffset([0, -26])
      .addTo(this.map);
  }
  _initSource() {
    this.map.createSource("high-light-mark", []);
  }
  _initPolyline() {
    this.map.createPolylineLayer("high-light-polyline", [], {
      source: "high-light-mark",
      paint: {
        "line-color": "#05aaff",
        "line-width": 3,
      },
    });
  }
  _initPolygon() {
    this.map.createPolygonLayer("high-light-polygon", [], {
      source: "high-light-mark",
      paint: {
        "fill-color": "#05aaff",
        "fill-opacity": 0.5, //透明度
      },
    });
  }
  //   设置显示隐藏
  setVisibility(flag) {
    if (this.activeTypes.includes(0)) {
      this.marker &&
        (this.marker.getElement().style.display = flag ? "block" : "none");
    }
    if (this.activeTypes.includes(1)) {
      this.map.setLayoutProperty(
        "high-light-polyline",
        "visibility",
        flag ? "visible" : "none"
      );
    }
    if (this.activeTypes.includes(2)) {
      this.map.setLayoutProperty(
        "high-light-polygon",
        "visibility",
        flag ? "visible" : "none"
      );
    }
  }
  //   设置点图片
  setMarkerImage(image) {
    this.marker &&
      (this.marker.getElement().style.backgroundImage = `url(${image})`);
  }
  //   更新或设置数据
  setData(geoJson) {
    this.map.setData("high-light-mark", [geoJson]);
    const bounds = getGeoBoundsWithFeatures([geoJson]);
    this.marker && this.marker.setLngLat(bounds.getCenter());
  }
  setLngLat(lngLat) {
    this.marker && this.marker.setLngLat(lngLat);
  }

  //   设置类型 types [ 0, 1 , 2]
  setActiveTypes(types = []) {
    this.activeTypes = types;
    this.setVisibility(false);
    if (!this.activeTypes.includes(0)) {
      this.marker && (this.marker.getElement().style.display = "none");
    }
    if (!this.activeTypes.includes(1)) {
      this.map.setLayoutProperty("high-light-polyline", "visibility", "none");
    }
    if (!this.activeTypes.includes(2)) {
      this.map.setLayoutProperty("high-light-polygon", "visibility", "none");
    }
  }

  //   销毁
  destroyed() {
    this.setVisibility(false);
    this.marker && this.marker.remove();
    this.marker = null;
    this.map.removeSource(this.map, "high-light-mark");
    this.map.removeLayer(this.map, "high-light-polygon");
    this.map.removeLayer(this.map, "high-light-polyline");
  }
}

/**
 * 合并多点位的数组到一个数组中
 * @param {*} coordinates
 * @returns
 */
export const flatCoordinates = (coordinates) => {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length == 0) {
    return [];
  }
  const element = coordinates[0];
  if (Array.isArray(element)) {
    return coordinates.reduce((pre, cur) => {
      if (cur.length == 2 && !Array.isArray(cur[0])) {
        pre.push(cur);
      } else {
        const totals = flatCoordinates(cur);
        pre.push(...totals);
      }
      return pre;
    }, []);
  } else {
    return coordinates;
  }
};

/**
 * 通过GeoJSON返回MapboxBounds
 * @param {*} features
 * @returns
 */
export const getGeoBoundsWithFeatures = (features) => {
  let allCoordinates = features.reduce((pre, cur) => {
    pre.push(...flatCoordinates(cur.geometry.coordinates));
    return pre;
  }, []);
  const first = allCoordinates[0];
  const bounds = allCoordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new GeoGlobe.LngLatBounds(first, first)); //地理边界
  return bounds;
};

/**
 * 通过点位数组计算bounds
 * @param {*} lnglats 坐标点数组 [[lng,lat],[lng,lat]]
 * @returns
 */
export const getGeoBoundsWithLnglats = (lnglats) => {
  const first = lnglats[0];
  const bounds = lnglats.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new GeoGlobe.LngLatBounds(first, first)); //地理边界
  return bounds;
};

/**
 * 创建地理实体
 * @param {*} option 配置项
 *    {
 *      layout:图层layout
 *      paint:图层paint
 *      validFn: 筛选有效图层
 *    }
 * @returns
 */
export const createDLSTLayer = (option) => {
  const VTS = new GeoGlobe.Format.VTS();
  const dlstLayer = VTS.createLayer(
    `http://mapservices.njghzy.com.cn:84/njmap/NJVTS_DLST/wmts`,
    option.style || {}
  );
  dlstLayer.layers.forEach((e) => {
    if (option.validFn && option.validFn(e)) {
      e.layout = { ...e.layout, ...(option.layout || {}) };
      e.paint = { ...e.paint, ...(option.paint || {}) };
    } else {
      e.layout.visibility = "none";
    }
  });
  return dlstLayer;
};

/**
 * 获取支持的多时相
 * @returns
 */
export const getSupportServiceTimes = () => {
  let urlWmtsParams = {
    request: "GetVersions",
    VERSION: _dSXWmtsOption.version,
    layer: _dSXWmtsOption.layerIdentifier,
    tileMatrixSet: _dSXWmtsOption.layerMatrixSet,
    content: "FULL",
    service: "WMTS",
    njtoken: njtoken,
  };
  let urlWmtsParamString = Object.keys(urlWmtsParams)
    .map((key) => {
      return `${key}=${urlWmtsParams[key]}`;
    })
    .join("&");
  let urlWmts = `${_dSXWmtsOption.url}?${urlWmtsParamString}`;
  return GeoSupportService.Mutil_WMTS(urlWmts);
};
