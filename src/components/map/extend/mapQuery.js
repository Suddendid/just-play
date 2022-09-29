/**
 * @Description: wfs服务查询 坐标点缓冲计算 距离计算
 * @Author yangze
 * @Date 2022/6/17
 */
import * as turf from "@turf/turf";

export const defaultExtend = () => {
  return {
    version: "1.0.0",
    maxFeatures: 999999,
    format: new GeoGlobe.Format.GML.v2({ singleFeatureType: true }),
  };
};

export const defaultQueryBox = () => {
  const queryBBOX = new GeoGlobe.LngLatBounds(
    new GeoGlobe.LngLat(-180, -90),
    new GeoGlobe.LngLat(180, 90)
  );
  return queryBBOX;
};

// 默认查询
export const wfsQuery = (wfsParam) => {
  let { url, name, extend = defaultExtend() } = wfsParam;
  const wfsQueryObj = new GeoGlobe.Query.WFSQuery(url, name, extend);
  return new Promise((resolve, reject) => {
    wfsQueryObj.query(null, function (e) {
      resolve(e);
    });
  });
};

// 默认查询
export const wfsQueryByBox = (wfsParam, queryBox = defaultQueryBox()) => {
  let { url, name, extend = defaultExtend() } = wfsParam;
  const wfsQueryObj = new GeoGlobe.Query.WFSQuery(url, name, extend);
  return new Promise((resolve, reject) => {
    wfsQueryObj.bboxQuery(queryBox, function (e) {
      resolve(e);
    });
  });
};

// 属性查询
export const wfsQueryByAttributes = (wfsParam, query) => {
  let { url, name, extend = defaultExtend() } = wfsParam;
  const wfsQueryObj = new GeoGlobe.Query.WFSQuery(url, name, extend);
  return new Promise((resolve, reject) => {
    wfsQueryObj.attributeQuery(
      query.type,
      query.property,
      query.value,
      {
        matchCase: true,
      },
      function (e) {
        resolve(e);
      }
    );
  });
};

/**
 * 计算缓冲区域
 * @param {*} lngLat 中心点
 * @param {*} radius 缓冲半径 单位:米
 * @returns
 */
export const getBufferAnalysis = (lngLat, radius) => {
  const point = turf.point(lngLat);
  const buffered = turf.buffer(point, radius, {
    units: "meters",
    steps: 100,
  });
  return buffered;
};

/**
 * 计算缓冲区域
 * @param {*} lngLat 中心点
 * @param {*} radius 缓冲半径 单位:米
 * @param {*} transformGeojson 是否需要返回GeoJSON格式面
 * @returns
 */
export const getBboxByCenter = ({
  lngLat,
  radius,
  transformGeojson = false,
}) => {
  const buffer = getBufferAnalysis(lngLat, radius);
  const bbox = turf.bbox(buffer);
  if (transformGeojson) {
    return turf.bboxPolygon(bbox);
  }
  return bbox;
};

/**
 * 计算两点之间的距离
 * @param {*} from 起始点
 * @param {*} to  终点
 * @returns
 */
export const getDistanceBetweenPoints = (from, to) => {
  const fromPoint = turf.point(from);
  const toPoint = turf.point(to);
  const options = { units: "miles" };
  return turf.distance(fromPoint, toPoint, options);
};
