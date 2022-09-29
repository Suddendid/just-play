/**
 * @Description: 四标四实基础
 * @Author yangze
 * @Date 2022/6/17
 */

import * as mapQuery from "./jbMapQuery";
import * as mapExtend from "./mapExtend";
import themeConfig from "./styles/config";
import PlotPopup from "./components/PlotPopup.vue";
import { VueComponetToElement } from "@/utils/transfer.js";
import { debounce } from "@/utils/util.js";
import { fontSize } from "@/utils/rem";

const THEME_CONFIG = themeConfig.THEME();

const LTFW_HOST = "http://59.83.223.136:30080";

/**
 * 判断江北行政区划等级
 */
export const getUserLevelByCode = (areaCode) => {
  if (!areaCode || areaCode.length == 0) {
    return 1;
  }
  let clearCode = (areaCode || "").replace(/0+$/, "");
  if (clearCode.length == 6) {
    //  新区
    return 1;
  } else if (clearCode.length == 9) {
    //   街道
    return 2;
  } else if (clearCode.length == 12) {
    //   社区
    return 3;
  } else {
    //   网格
    return 4;
  }
};

export class BaseMapKit {
  constructor(map, option = {}) {
    this.map = map;
    this.option = option;
    this.processFlag = 0;
    this.symbolFlag = 1;

    this.styleVisibleMap = {};
    this.init();
    // 加载完成回调
    this.didLoadCallback = option.didLoadCallback || null;
    // 点击白膜事件
    this.clickBuildingCallback = option.clickBuildingCallback || null;
    // 点击小区面事件
    this.clickXqmCallback = option.clickXqmCallback || null;
    // 是否叠加小区面
    this.cellVisible = option.cellVisible;
    this.setCellVisible(this.cellVisible);

    map.on("click", (res) => {
      this.map.setData("district-select-source", []);
      this.map.getLayer("xqm-polygon-high") &&
        this.map.setFilter("xqm-polygon-high", ["in", "OID", ""]);
      this.map.getLayer("xqm-high-border") &&
        this.map.setFilter("xqm-high-border", ["in", "OID", ""]);
      let hasNext = false;
      hasNext = this.addBuildingClickEvent(res);
      hasNext && (hasNext = this.addXqmClickEvent(res));
      hasNext && (hasNext = this.addDistrictClickEvent(res));
    });
  }

  static LTFWHIGHKEYS = {
    FILTERHIGHID: "high-ltfwFilterHighID",
    CLICKHIGHID: "high-ltfwClickHighID",
    HCHIGHID: "high-ltfwHcHighID",
  };

  static STYLENAMES_ENUM = {
    LFFW: "LFFW_STYLE",
    STREET: "STREET_STYLE",
    COMMUNITY: "COMMUNITY_STYLE",
    GRID: "GRID_STYLE",
    XQM: "XQM_STYLE",
  };

  get authLevel() {
    if (
      !this.option.areaItem ||
      !this.option.areaItem.code ||
      this.option.areaItem.code.length == 0
    ) {
      return 1;
    } else {
      return getUserLevelByCode(this.option.areaItem.code);
    }
  }
  // 江北房屋注记
  addJBLTFWNoteLayer() {
    this.map.createSymbolLayer(
      "ltfw-note-symbol",
      [],
      {
        layout: {
          "text-field": "{LDBH}",
          "text-font": ["Microsoft YaHei Regular"],
          "text-size": 12,
          "text-anchor": "center",
          "text-justify": "center",
          "text-ignore-placement": true,
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#5938B3",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1.06667,
        },
        minzoom: 15.5,
        maxzoom: 18,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    this.map.on(
      "zoomend",
      debounce(this.setJBLTFWNoteData.bind(this), 300).bind(this)
    );
    this.map.on(
      "moveend",
      debounce(this.setJBLTFWNoteData.bind(this), 300).bind(this)
    );
  }
  // 设置房屋注记
  setJBLTFWNoteData() {
    if (this.map.getZoom() < 15) {
      return;
    }
    let features = this.map.queryRenderedFeatures({ layers: this.ltfwIds });
    let cacheMap = [];
    let noteFeatures = features
      .filter((feature) => {
        let fwUuid = feature.properties["FANGWUID"];
        if (!cacheMap.includes(fwUuid)) {
          cacheMap.push(fwUuid);
          return true;
        }
        return false;
      })
      .map((feature) => {
        let bounds = mapExtend.getGeoBoundsWithFeatures([feature]);
        feature.properties["LDBH"] =
          !feature.properties["LDBH"] || feature.properties["LDBH"] == "null"
            ? ""
            : feature.properties["LDBH"];
        return {
          geometry: {
            type: "Point",
            coordinates: [bounds.getCenter().lng, bounds.getCenter().lat],
          },
          properties: feature.properties,
        };
      });
    this.map.setData("ltfw-note-symbol", noteFeatures);
  }

  // 江北房屋专题
  addJBLTFWLayer() {
    // 创建指定的单个矢量瓦片图层
    const VTS = new GeoGlobe.Format.VTS();
    const vts_layer = VTS.createLayer(`${LTFW_HOST}/LTFW_UUID/wmts?`, {
      layer: "JBXQ_LTFW",
      styleName: "JBXQ_LTFWha.JBXQ_LTFW",
    });
    vts_layer.layers[0].paint["fill-extrusion-opacity"] = 0.8;
    vts_layer.layers[0].paint["fill-extrusion-color"] = [
      "case",
      ["any", ["==", ["get", "lx_1"], 1]],
      THEME_CONFIG.LTFW_COLORS.NORMAL,
      ["all", ["==", ["get", "lx_1"], 2]],
      THEME_CONFIG.LTFW_COLORS.NORMAL,
      THEME_CONFIG.LTFW_COLORS.DEFAULT,
    ];
    vts_layer.layers[0].minzoom = 15;

    const ltfwFilterHighLayer = JSON.parse(JSON.stringify(vts_layer.layers[0]));
    ltfwFilterHighLayer.id = BaseMapKit.LTFWHIGHKEYS.FILTERHIGHID;
    ltfwFilterHighLayer.paint["fill-extrusion-color"] =
      THEME_CONFIG.LTFW_COLORS.FILTER;
    ltfwFilterHighLayer["filter"] = ["in", "FANGWUID", " "];
    vts_layer.layers.push(ltfwFilterHighLayer);

    const ltfwClickHighLayer = JSON.parse(JSON.stringify(vts_layer.layers[0]));
    ltfwClickHighLayer.id = BaseMapKit.LTFWHIGHKEYS.CLICKHIGHID;
    ltfwClickHighLayer.paint["fill-extrusion-color"] =
      THEME_CONFIG.LTFW_COLORS.CLICK;
    ltfwClickHighLayer["filter"] = ["in", "FANGWUID", " "];
    vts_layer.layers.push(ltfwClickHighLayer);

    const ltfwHcLayer = JSON.parse(JSON.stringify(vts_layer.layers[0]));
    ltfwHcLayer.id = BaseMapKit.LTFWHIGHKEYS.HCHIGHID;
    ltfwHcLayer.paint["fill-extrusion-color"] = THEME_CONFIG.LTFW_COLORS.HC;
    ltfwHcLayer["filter"] = ["in", "FANGWUID", " "];
    vts_layer.layers.push(ltfwHcLayer);

    this.map.style.glyphManager.setURL(vts_layer.layers[0].metadata.glyphs);
    this.map.addLayerToGroup(vts_layer, mapExtend.CONSTANT.BASEGROUPID.CENTER);

    return vts_layer;
  }
  /**
   *
   * @param {*} option
   *  key: STYLENAMES_ENUM 值
   *  hidden : 0:显示 1:隐藏
   */
  setMapStyleVisible(option) {
    this.styleVisibleMap[option.key] = option.hidden;
    const visibility = !option.hidden ? "none" : "visible";
    switch (option.key) {
      case BaseMapKit.STYLENAMES_ENUM.XQM:
        // 小区面
        {
          this.setCellVisible(!option.hidden);
        }
        break;
      case BaseMapKit.STYLENAMES_ENUM.LTFW:
        // 白膜
        {
          this.ltfwIds.forEach((id) => {
            this.map.setLayoutProperty(id, "visibility", visibility);
          });
        }
        break;
      case BaseMapKit.STYLENAMES_ENUM.STREET:
        {
          this.setStreetFillVisible(!option.hidden);
          this.setStreetBorderVisible(!option.hidden);
          this.setStreetNoteVisible(!option.hidden);
        }
        break;
      case BaseMapKit.STYLENAMES_ENUM.COMMUNITY:
        {
          this.setCommunityFillVisible(!option.hidden);
          this.setCommunityBorderVisible(!option.hidden);
          this.setCommunityNoteVisible(!option.hidden);
        }
        break;
      case BaseMapKit.STYLENAMES_ENUM.GRID:
        {
          this.setGridFillVisible(!option.hidden);
          this.setGridBorderVisible(!option.hidden);
          this.setGridNoteVisible(!option.hidden);
        }
        break;
      default:
        break;
    }
  }

  async init() {
    this.ltfwIds = [];
    this.streetFeatures = [];
    this.communityFeatures = [];
    this.gridFeatures = [];
    this.plotFeatures = [];
    this.didLoad = false;
    this.initCallback = null;
    this.xqmDidLoad = false;
    this.xqmInitCallback = null;
    this.clusterMarkers = [];
    this.initDistrictSource();
    this.initDistrictLayer();
    this.addJBHousingFeature();
    this.addBuildingLayers();
    await this.getJBGeoJSON();
  }
  // 添加房屋白膜
  addBuildingLayers() {
    const vts_layer = this.addJBLTFWLayer();
    this.ltfwIds = vts_layer.layers
      .filter((layer) => {
        return !layer.id.startsWith("high");
      })
      .map(function (layer) {
        return layer.id;
      });
    this.addJBLTFWNoteLayer();
  }
  // 社区街道面点击
  addDistrictClickEvent(res) {
    const point = res.point;
    const features = this.map.queryRenderedFeatures(
      [
        [point.x, point.y],
        [point.x, point.y],
      ],
      { layers: ["street-polygon", "community-polygon", "grid-polygon"] }
    );
    if (features && features.length > 0) {
      let feature = features[0];
      console.log(features);
      this.map.setData("district-select-source", [feature]);
      // this.map.setPaintProperty(feature.layer.id, "fill-color", "red")
    } else {
    }
    return true;
  }
  // 小区面点击
  addXqmClickEvent(res) {
    if (!this.map.getLayer("xqm-polygon")) return true;
    const point = res.point;
    const xqmFeatures = this.map.queryRenderedFeatures(
      [
        [point.x, point.y],
        [point.x, point.y],
      ],
      { layers: ["xqm-polygon"] }
    );
    if (xqmFeatures && xqmFeatures.length > 0) {
      this.map.setFilter("xqm-polygon-high", [
        "in",
        "OID",
        xqmFeatures[0].properties.OID,
      ]);
      this.map.setFilter("xqm-high-border", [
        "in",
        "OID",
        xqmFeatures[0].properties.OID,
      ]);
      this.addXQMPopup(xqmFeatures[0]);
      this.clickXqmCallback && this.clickXqmCallback(xqmFeatures);
      return false;
    }
    return true;
  }
  // 小区面popup
  addXQMPopup(item) {
    this.xqmPopup = new mapboxgl.Popup()
      .setLngLat([item.properties.X, item.properties.Y])
      .setHTML("<div id='plot-popup'></div>")
      .addTo(this.map);
    let el = VueComponetToElement({
      component: PlotPopup,
      option: {
        props: {
          item: item,
          fitHandler: () => {
            const bounds = mapExtend.getGeoBoundsWithFeatures([item]);
            this.map.fitBounds(bounds, { padding: 20 });
            this.removeXqmPopup();
          },
        },
      },
      element: document.getElementById("plot-popup"),
    });
  }

  // 隐藏小区面Popup
  removeXqmPopup() {
    this.xqmPopup && this.xqmPopup.remove();
  }

  // 添加房屋白膜点击事件
  addBuildingClickEvent(res) {
    const point = res.point;
    const buildingFeatures = this.map.queryRenderedFeatures(
      [
        [point.x - 10, point.y - 10],
        [point.x + 10, point.y + 10],
      ],
      { layers: this.ltfwIds }
    );
    if (buildingFeatures && buildingFeatures.length > 0) {
      console.log(buildingFeatures);
      this.clickBuilding(buildingFeatures);
      return false;
    } else {
      return true;
    }
  }
  //   点击白膜
  clickBuilding(features) {
    if (features.length == 0) return;
    const filter = features.reduce(
      (memo, feature) => {
        memo.push(feature.properties.FANGWUID);
        return memo;
      },
      ["in", "FANGWUID"]
    );
    this.map.setFilter(BaseMapKit.LTFWHIGHKEYS.CLICKHIGHID, filter);
    this.clickBuildingCallback && this.clickBuildingCallback(features);
  }
  // 设置高亮白膜
  set3DBuildingFilter(ids) {
    this.map &&
      this.map.setFilter(BaseMapKit.LTFWHIGHKEYS.FILTERHIGHID, [
        "in",
        "FANGWUID",
        ...ids.map((e) => Number(e)),
      ]);
  }
  // 初始化source
  initDistrictSource() {
    this.map.createSource("street-source", []);
    this.map.createSource("community-source", []);
    this.map.createSource("grid-source", []);
    this.map.createSource("district-select-source", []);
  }
  // 初始化街道图层
  initDistrictLayer() {
    // 街道面
    this.map.createPolygonLayer(
      "street-polygon",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.STREET.FILL,
        },
        source: "street-source",
        maxzoom: THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 社区面
    this.map.createPolygonLayer(
      "community-polygon",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.FILL,
        },
        source: "community-source",
        layout: {
          visibility: "none",
        },
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.MINZOOM,
        maxzoom: THEME_CONFIG.DISTRICT_CONFIG.GRID.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 网格面
    this.map.createPolygonLayer(
      "grid-polygon",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.GRID.FILL,
        },
        source: "grid-source",
        layout: {
          visibility: "none",
        },
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.GRID.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 网格线-背景
    this.map.createPolylineLayer(
      "grid-polyline-bg",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.GRID.LINE_BORDER,
        },
        source: "grid-source",
        layout: {
          visibility: "none",
        },
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.GRID.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 网格边界
    this.map.createPolylineLayer(
      "grid-polyline",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.GRID.LINE,
        },
        source: "grid-source",
        layout: {
          visibility: "none",
        },
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.GRID.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 社区边界-背景
    this.map.createPolylineLayer(
      "community-polyline-bg",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.LINE_BORDER,
        },
        source: "community-source",
        layout: {
          visibility: "none",
        },
        // maxzoom: 15
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 社区边界
    this.map.createPolylineLayer(
      "community-polyline",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.LINE,
        },
        source: "community-source",
        layout: {
          visibility: "none",
        },
        // maxzoom: 15
        minzoom: THEME_CONFIG.DISTRICT_CONFIG.COMMUNITY.MINZOOM,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 街道边界-背景
    this.map.createPolylineLayer(
      "street-polyline-bg",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.STREET.LINE_BORDER,
        },
        source: "street-source",
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 街道边界
    this.map.createPolylineLayer(
      "street-polyline",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.STREET.LINE,
        },
        source: "street-source",
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 区划面选中
    this.map.createPolygonLayer(
      "district-select-fill",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.SELECT.FILL,
        },
        source: "district-select-source",
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
  }

  // 添加新区小区
  addJBHousingFeature() {
    this.map.createSource("xqm-source", []);
    this.map.createPolygonLayer(
      "xqm-polygon",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.XQM.FILL,
        },
        source: "xqm-source",
        layout: {
          visibility: "none",
        },
        // minzoom: 15
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    this.map.createPolylineLayer(
      "xqm-polyline",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.XQM.LINE,
        },
        source: "xqm-source",
        layout: {
          visibility: "none",
        },
        // minzoom: 15
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    this.map.createPolygonLayer(
      "xqm-polygon-high",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.XQM.HIGH_FILL,
        },
        source: "xqm-source",
        filter: ["in", "OID", ""],
        layout: {
          visibility: "none",
        },
        // minzoom: 15
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    this.map.createPolylineLayer(
      "xqm-high-border",
      [],
      {
        paint: {
          ...THEME_CONFIG.DISTRICT_CONFIG.XQM.HIGH_LINE,
        },
        filter: ["in", "OID", ""],
        source: "xqm-source",
        layout: {
          visibility: "none",
        },
        // minzoom: 15
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 小区注记
    this.map.createSymbolLayer(
      "xq-note-symbol",
      [],
      {
        layout: {
          "text-field": "{NAME}",
          "text-font": ["Microsoft YaHei Regular"],
          "text-size": 13,
          "text-anchor": "center",
          "text-justify": "center",
          "text-ignore-placement": true,
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#1E5FAD",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1.06667,
        },
        minzoom: 14,
        maxzoom: 16.5,
      },
      mapExtend.CONSTANT.BASEGROUPID.CENTER
    );
    // 街道注记
    this.map.createSymbolLayer(
      "street-note-symbol",
      [],
      {
        layout: {
          "text-field": "{NAME}",
          "text-font": ["Microsoft YaHei Semibold"],
          "text-size": fontSize(18),
          "text-anchor": "center",
          "text-justify": "center",
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          visibility: "none",
        },
        paint: {
          "text-color": "#FFFFFF",
          // "text-halo-color": "#1E5FAD",
          // "text-halo-width": 1.06667,
        },
      },
      mapExtend.CONSTANT.BASEGROUPID.TOP1
    );
    // 社区注记
    this.map.createSymbolLayer(
      "community-note-symbol",
      [],
      {
        layout: {
          "text-field": "{NAME}",
          "text-font": ["Microsoft YaHei Semibold"],
          "text-size": fontSize(18),
          "text-anchor": "center",
          "text-justify": "center",
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          visibility: "none",
        },
        paint: {
          "text-color": "#FFFFFF",
          // "text-halo-color": "#1E5FAD",
          // "text-halo-width": 1.06667,
        },
      },
      mapExtend.CONSTANT.BASEGROUPID.TOP1
    );
    // 网格注记
    this.map.createSymbolLayer(
      "grid-note-symbol",
      [],
      {
        layout: {
          "text-field": "{NAME}",
          "text-font": ["Microsoft YaHei Semibold"],
          "text-size": fontSize(18),
          "text-anchor": "center",
          "text-justify": "center",
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          visibility: "none",
        },
        paint: {
          "text-color": "#FFFFFF",
          // "text-halo-color": "#1E5FAD",
          // "text-halo-width": 1.06667,
        },
      },
      mapExtend.CONSTANT.BASEGROUPID.TOP1
    );
  }
  // 获取街道数据
  async getStreetFeatures() {
    let level = this.authLevel;
    switch (level) {
      case 1:
        {
          const streetFeature = await mapQuery.getJBStreetFeatures({});
          this.streetFeatures =
            streetFeature && streetFeature.geojson
              ? streetFeature.geojson.features
              : [];
        }
        break;
      case 2:
        {
          let areaCode = this.option.areaItem.code;
          let query = {
            type: "==",
            property: "街道编码",
            value: areaCode.slice(0, 9),
          };
          const streetFeature = await mapQuery.getJBStreetFeatures(query);
          this.streetFeatures =
            streetFeature && streetFeature.geojson
              ? streetFeature.geojson.features
              : [];
        }
        break;
      default:
        this.streetFeatures = [];
        break;
    }
  }
  // 获取社区数据
  async getCommunityFeatures() {
    let level = this.authLevel;
    switch (level) {
      case 1:
        {
          const communityFeature = await mapQuery.getJBSQFeatures({});
          this.communityFeatures =
            communityFeature && communityFeature.geojson
              ? communityFeature.geojson.features
              : [];
        }
        break;
      case 2:
        {
          let areaCode = this.option.areaItem.code;
          let query = {
            type: "==",
            property: "街道编码",
            value: areaCode.slice(0, 9),
          };
          const communityFeature = await mapQuery.getJBSQFeatures(query);
          this.communityFeatures =
            communityFeature && communityFeature.geojson
              ? communityFeature.geojson.features
              : [];
        }
        break;
      case 3:
        {
          {
            let areaCode = this.option.areaItem.code;
            let query = {
              type: "==",
              property: "社区编码",
              value: areaCode.slice(0, 12),
            };
            const communityFeature = await mapQuery.getJBSQFeatures(query);
            this.communityFeatures =
              communityFeature && communityFeature.geojson
                ? communityFeature.geojson.features
                : [];
          }
        }
        break;
      default:
        this.communityFeatures = [];
        break;
    }
  }
  // 获取网格数据
  async getGridFeatures() {
    let level = this.authLevel;
    switch (level) {
      case 1:
        {
          const gridFeature = await mapQuery.getJBGridFeatues();
          this.gridFeatures =
            gridFeature && gridFeature.geojson
              ? gridFeature.geojson.features
              : [];
        }
        break;
      case 2:
        {
          let areaCode = this.option.areaItem.code;
          let query = {
            type: "==",
            property: "JDBM",
            value: areaCode.slice(0, 9),
          };
          const gridFeature = await mapQuery.getJBGridFeatues(query);
          this.gridFeatures =
            gridFeature && gridFeature.geojson
              ? gridFeature.geojson.features
              : [];
        }
        break;
      case 3:
        {
          let areaCode = this.option.areaItem.code;
          let query = {
            type: "==",
            property: "SQBM",
            value: areaCode.slice(0, 12),
          };
          const gridFeature = await mapQuery.getJBGridFeatues(query);
          this.gridFeatures =
            gridFeature && gridFeature.geojson
              ? gridFeature.geojson.features
              : [];
        }
        break;
      case 4:
        {
          let areaCode = this.option.areaItem.code;
          let query = {
            type: "==",
            property: "WGBM",
            value: areaCode.slice(0, 15),
          };
          const gridFeature = await mapQuery.getJBGridFeatues(query);
          this.gridFeatures =
            gridFeature && gridFeature.geojson
              ? gridFeature.geojson.features
              : [];
        }
        break;
      default:
        this.gridFeatures = [];
        break;
    }
  }
  // 获取小区数据
  async getPlotFeatures() {
    let level = this.authLevel;
    switch (level) {
      case 1:
        {
          const xqmFeature = await mapQuery.getJBXQMFeatures({});
          this.plotFeatures =
            xqmFeature && xqmFeature.geojson ? xqmFeature.geojson.features : [];
        }
        break;
      case 2:
        {
          let name = this.option.areaItem.name;
          let query = {
            type: "==",
            property: "SZXZ",
            value: name,
          };
          const xqmFeature = await mapQuery.getJBXQMFeatures(query);
          this.plotFeatures =
            xqmFeature && xqmFeature.geojson ? xqmFeature.geojson.features : [];
        }
        break;
      case 3:
        {
          let name = this.option.areaItem.name;
          let query = {
            type: "==",
            property: "SZSQ",
            value: name,
          };
          const xqmFeature = await mapQuery.getJBXQMFeatures(query);
          this.plotFeatures =
            xqmFeature && xqmFeature.geojson ? xqmFeature.geojson.features : [];
        }
        break;
      default:
        this.plotFeatures = [];
        break;
    }
  }

  // 获取社区source
  async getJBGeoJSON() {
    await this.getStreetFeatures();

    await this.getCommunityFeatures();

    await this.getGridFeatures();

    this.didLoad = true;
    if (this.didLoadCallback) {
      let flag = this.didLoadCallback();
      if (flag) {
        this.setInitData();
      }
    } else {
      this.setInitData();
    }
    await this.getPlotFeatures();
    this.xqmDidLoad = true;
    if (this.xqmInitCallback) {
      this.xqmInitCallback();
    } else {
      this.updateXqmFeatures(this.plotFeatures);
    }
  }
  setInitData() {
    if (this.initCallback) {
      this.initCallback();
      this.initCallback = null;
    } else {
      this.setSelectDistrictByAreaItem(this.option.areaItem);
    }
  }
  // 显示、隐藏所有图层
  setDistrictVisible(flag) {
    this.map.setData("district-select-source", []);
    this.removeXqmPopup();
    this.processFlag = 0;
    this.setGridBorderVisible(flag);
    this.setGridFillVisible(flag);
    this.setCommunityBorderVisible(flag);
    this.setCommunityFillVisible(flag);
    this.setStreetBorderVisible(flag);
    this.setStreetFillVisible(flag);
    this.setStreetNoteVisible(flag);
    this.setCommunityNoteVisible(flag);
    this.setGridNoteVisible(flag);
  }
  // 显示、隐藏小区面
  setCellVisible(flag) {
    this.cellVisible = flag;
    const tag = flag ? "visible" : "none";
    this.map.getLayer("xqm-polygon") &&
      this.map.setLayoutProperty("xqm-polygon", "visibility", tag);
    this.map.getLayer("xqm-polyline") &&
      this.map.setLayoutProperty("xqm-polyline", "visibility", tag);
    this.map.getLayer("xqm-high-border") &&
      this.map.setLayoutProperty("xqm-high-border", "visibility", tag);
    this.map.getLayer("xqm-polygon-high") &&
      this.map.setLayoutProperty("xqm-polygon-high", "visibility", tag);
    this.map.getLayer("xq-note-symbol") &&
      this.map.setLayoutProperty("xq-note-symbol", "visibility", tag);
  }
  // 显示、隐藏街道边界
  setStreetBorderVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.STREET]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("street-polyline", "visibility", visible);
    this.map.setLayoutProperty("street-polyline-bg", "visibility", visible);
  }
  // 显示、隐藏街道面
  setStreetFillVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.STREET]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("street-polygon", "visibility", visible);
  }
  // 显示、隐藏街道注记
  setStreetNoteVisible(flag) {
    const visible = flag ? "visible" : "none";
    if (flag && this.symbolFlag == 1 && this.processFlag == 0) {
      this.map.setLayoutProperty("street-note-symbol", "visibility", visible);
    } else {
      this.map.setLayoutProperty("street-note-symbol", "visibility", "none");
    }
  }
  // 显示、隐藏社区边界
  setCommunityBorderVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.COMMUNITY]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("community-polyline", "visibility", visible);
    this.map.setLayoutProperty("community-polyline-bg", "visibility", visible);
  }
  // 显示、隐藏社区面
  setCommunityFillVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.COMMUNITY]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("community-polygon", "visibility", visible);
  }
  // 显示、隐藏社区注记
  setCommunityNoteVisible(flag) {
    const visible = flag ? "visible" : "none";
    if (flag && this.symbolFlag == 1 && this.processFlag == 1) {
      this.map.setLayoutProperty(
        "community-note-symbol",
        "visibility",
        visible
      );
    } else {
      this.map.setLayoutProperty("community-note-symbol", "visibility", "none");
    }
  }
  // 显示、隐藏网格边界
  setGridBorderVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.GRID]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("grid-polyline", "visibility", visible);
    this.map.setLayoutProperty("grid-polyline-bg", "visibility", visible);
  }
  // 显示、隐藏网格面
  setGridFillVisible(flag) {
    const visible =
      flag && !this.styleVisibleMap[BaseMapKit.STYLENAMES_ENUM.GRID]
        ? "visible"
        : "none";
    this.map.setLayoutProperty("grid-polygon", "visibility", visible);
  }
  // 显示、隐藏网格注记
  setGridNoteVisible(flag) {
    const visible = flag ? "visible" : "none";
    if (flag && this.symbolFlag && this.processFlag > 1) {
      this.map.setLayoutProperty("grid-note-symbol", "visibility", visible);
    } else {
      this.map.setLayoutProperty("grid-note-symbol", "visibility", "none");
    }
  }
  // 更新街道面数据
  updateStreetFeatures(features) {
    this.map.getSource("street-source").setData({
      type: "FeatureCollection",
      features: features,
    });
    let noteFeatures = features.map((feature) => {
      let bounds = mapExtend.getGeoBoundsWithFeatures([feature]);
      feature.properties["NAME"] =
        !feature.properties["街道名称"] ||
        feature.properties["街道名称"] == "null"
          ? ""
          : feature.properties["街道名称"];
      return {
        geometry: {
          type: "Point",
          coordinates: [bounds.getCenter().lng, bounds.getCenter().lat],
        },
        properties: feature.properties,
      };
    });
    this.map.setData("street-note-symbol", noteFeatures);
  }
  // 更新社区面数据
  updateCommunityFeatures(features) {
    this.map.getSource("community-source").setData({
      type: "FeatureCollection",
      features: features,
    });
    let noteFeatures = features.map((feature) => {
      let bounds = mapExtend.getGeoBoundsWithFeatures([feature]);
      feature.properties["NAME"] =
        !feature.properties["社区名称"] ||
        feature.properties["社区名称"] == "null"
          ? ""
          : feature.properties["社区名称"];
      return {
        geometry: {
          type: "Point",
          coordinates: [bounds.getCenter().lng, bounds.getCenter().lat],
        },
        properties: feature.properties,
      };
    });
    this.map.setData("community-note-symbol", noteFeatures);
  }
  // 更新网格数据
  updateGridFeatures(features) {
    this.map.getSource("grid-source").setData({
      type: "FeatureCollection",
      features: features,
    });
    let noteFeatures = features.map((feature) => {
      let bounds = mapExtend.getGeoBoundsWithFeatures([feature]);
      feature.properties["NAME"] =
        !feature.properties["WGMC"] || feature.properties["WGMC"] == "null"
          ? ""
          : feature.properties["WGMC"];
      return {
        geometry: {
          type: "Point",
          coordinates: [bounds.getCenter().lng, bounds.getCenter().lat],
        },
        properties: feature.properties,
      };
    });
    this.map.setData("grid-note-symbol", noteFeatures);
  }
  // 更新小区数据
  updateXqmFeatures(features) {
    this.map.getSource("xqm-source").setData({
      type: "FeatureCollection",
      features: features,
    });
    let noteFeatures = features.map((feature) => {
      let bounds = mapExtend.getGeoBoundsWithFeatures([feature]);
      feature.properties["NAME"] =
        !feature.properties["NAME"] || feature.properties["NAME"] == "null"
          ? ""
          : feature.properties["NAME"];
      return {
        geometry: {
          type: "Point",
          coordinates: [bounds.getCenter().lng, bounds.getCenter().lat],
        },
        properties: feature.properties,
      };
    });
    this.map.setData("xq-note-symbol", noteFeatures);
  }
  // 更新房屋
  updateLTFWFeatures(expression) {
    this.ltfwIds.forEach((id) => {
      this.map.setFilter(id, expression);
    });
    this.map.setFilter(BaseMapKit.LTFWHIGHKEYS.CLICKHIGHID, ["in", "FANGWUID"]);
  }
  // 设置显示区域
  fitToBoundsByFeatures(features) {
    const bounds = mapExtend.getGeoBoundsWithFeatures(features);
    this.map.fitBounds(bounds, { padding: 20 });
  }
  // 确保获取到数据后调用
  initHandler(fn) {
    if (this.didLoad) {
      fn();
    } else {
      this.initCallback = fn;
    }
  }
  // 确保小区面数据获取到后调用
  initXqmHandler(fn) {
    if (this.xqmDidLoad) {
      fn();
    } else {
      this.xqmInitCallback = fn;
    }
  }
  // 关闭区划注记
  hiddenNoteSymbol() {
    this.symbolFlag = 0;
    this.setStreetNoteVisible(false);
    this.setCommunityNoteVisible(false);
    this.setGridNoteVisible(false);
  }
  // 显示区划注记
  showNoteSymbol() {
    this.symbolFlag = 1;
    this.setStreetNoteVisible(true);
    this.setGridNoteVisible(true);
    this.setCommunityNoteVisible(true);
  }
  //  设置区划
  setSelectDistrictByAreaItem(areaItem) {
    if (!areaItem) {
      this.setSelectDistrict();
      return;
    }
    let level = getUserLevelByCode(areaItem.code);
    switch (level) {
      case 1:
        {
          this.setSelectDistrict();
        }
        break;
      case 2:
        {
          this.setSelectStreet(areaItem);
        }
        break;
      case 3:
        {
          this.setSelectCommunity(areaItem);
        }
        break;
      case 4:
        {
          this.setSelectGrid(areaItem);
        }
        break;
      default:
        break;
    }
  }
  // 设置江北新区范围
  setSelectDistrict() {
    this.initHandler(() => {
      this.removeXqmPopup();
      this.setDistrictVisible(false);
      this.processFlag = 0;
      // 街道面
      this.setStreetFillVisible(true);
      // 街道边界
      this.setStreetBorderVisible(true);
      // 街道注记
      this.setStreetNoteVisible(true);
      // 社区面
      this.setCommunityFillVisible(true);
      // 社区边界
      this.setCommunityBorderVisible(true);
      // 网格面
      this.setGridFillVisible(true);
      // 网格边界
      this.setGridBorderVisible(true);
      this.updateStreetFeatures(this.streetFeatures);
      this.updateCommunityFeatures(this.communityFeatures);
      this.updateGridFeatures(this.gridFeatures);
      this.updateXqmData();
      this.fitToBoundsByFeatures(this.streetFeatures);
      this.updateLTFWFeatures(null);
    });
  }
  // 设置选中街道
  setSelectStreet(streetItem) {
    this.initHandler(() => {
      this.removeXqmPopup();
      this.setDistrictVisible(false);
      this.processFlag = 1;
      // 街道边界
      this.setStreetBorderVisible(true);
      // 街道面
      this.setStreetFillVisible(true);
      // 社区面
      this.setCommunityFillVisible(true);
      // 社区边界
      this.setCommunityBorderVisible(true);
      // 社区注记
      this.setCommunityNoteVisible(true);
      // 网格面
      this.setGridBorderVisible(true);
      // 网格边界
      this.setGridFillVisible(true);
      const streetCode = streetItem.code.slice(0, 9);
      const features = this.streetFeatures.filter((feature) => {
        return feature.properties.街道编码 == streetCode;
      });
      this.updateStreetFeatures(features);
      const communityFeatures = this.communityFeatures.filter((feature) => {
        return feature.properties.街道编码 == streetCode;
      });
      this.updateCommunityFeatures(communityFeatures);
      const gridFeatures = this.gridFeatures.filter((feature) => {
        return feature.properties.JDBM == streetCode;
      });
      this.updateGridFeatures(gridFeatures);
      this.updateXqmData((item) => item.properties.SZXZ == streetItem.name);
      this.fitToBoundsByFeatures(features);
      this.updateLTFWFeatures(["==", "SZJD", streetItem.name]);
    });
  }

  // 设置选中社区
  setSelectCommunity(communityItem) {
    this.initHandler(() => {
      this.removeXqmPopup();
      this.setDistrictVisible(false);
      this.processFlag = 2;
      // this.setCommunityFillVisible(true);
      this.setGridFillVisible(true);
      this.setCommunityFillVisible(true);
      this.setCommunityBorderVisible(true);
      this.setGridBorderVisible(true);
      // this.setGridNoteVisible(true);
      this.setGridBorderVisible(true);
      const communityCode = communityItem.code.slice(0, 12);
      const features = this.communityFeatures.filter((feature) => {
        return feature.properties.社区编码 == communityCode;
      });
      this.updateCommunityFeatures(features);
      this.fitToBoundsByFeatures(features);
      const gridFeatures = this.gridFeatures.filter((feature) => {
        return feature.properties.SQBM == communityCode;
      });
      this.updateGridFeatures(gridFeatures);
      this.updateXqmData((item) => item.properties.SZSQ == communityItem.name);
      this.updateLTFWFeatures(["==", "社区名", communityItem.name]);
    });
  }

  // 设置选中网格
  setSelectGrid(gridItem) {
    this.initHandler(() => {
      this.removeXqmPopup();
      this.setDistrictVisible(false);
      this.processFlag = 2;
      this.setGridFillVisible(true);
      this.setGridBorderVisible(true);
      // this.setGridNoteVisible(true);
      const features = this.gridFeatures.filter((feature) => {
        return feature.properties.WGBM == gridItem.code;
      });
      this.updateGridFeatures(features);
      this.fitToBoundsByFeatures(features);
      this.updateLTFWFeatures(["==", "网格名", gridItem.name]);
    });
  }

  // 通过code获取features
  getFeaturesByAreaCode(code) {
    const areaCode = (code || "").replace(/0+$/, "");
    const level = getUserLevelByCode(code);
    let features = [];
    switch (level) {
      case 1:
        {
          features = this.streetFeatures;
        }
        break;
      case 2:
        {
          features = this.streetFeatures.filter((feature) => {
            return feature.properties.街道编码 == areaCode;
          });
        }
        break;
      case 3:
        {
          features = this.communityFeatures.filter((feature) => {
            return feature.properties.社区编码 == areaCode;
          });
        }
        break;
      case 4:
        {
          features = this.gridFeatures.filter((feature) => {
            return feature.properties.WGBM == areaCode;
          });
        }
        break;
      default:
        break;
    }
    return features;
  }

  // 设置填充
  setFillDistrict(features) {
    this.map.setData("district-select-source", features);
  }

  // 设置小区面
  updateXqmData(fn) {
    this.initXqmHandler(() => {
      const xqmFeatures = this.plotFeatures.filter((item) => {
        return fn ? fn(item) : true;
      });
      this.updateXqmFeatures(xqmFeatures);
    });
  }

  // 设置房屋高亮筛选
  setBuildingFilter(ids) {
    this.map &&
      this.map.setFilter(BaseMapKit.LTFWHIGHKEYS.FILTERHIGHID, [
        "in",
        "FANGWUID",
        ...ids.map((e) => Number(e)),
      ]);
  }

  reset() {
    this.setBuildingFilter([]);
    this.setCellVisible(false);
    this.removeXqmPopup();
  }

  //
  destroyed() {}
}
