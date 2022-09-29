// 去抖动
export const debounce = (fn, delay = 500) => {
  let timer;
  return function() {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};

// 路况渲染
class TrafficRender {
  constructor() {
    // 交通道路服务
    const vtsService = {
      url:
        "http://mapservices.njghzy.com.cn:84/njmap/NJVTS_JTLW/wmts?njtoken=d6ae87a8f02ef7ac8582681f51e52644",
      type: "VTS"
    };
    let { type, url, layer, styleName } = vtsService;
    let VTS = new GeoGlobe.Format.VTS();
    this.layerOptions = VTS.createLayer(url, { layer, styleName });
    this.layerIds = this.layerOptions.layers.map(res => {
      if (res.type === "line") {
        res.paint["line-color"] = "#4FD27D";
        res.paint["line-width"] = 5;
      }
      return res.id;
    });
  }

  addTo(map) {
    this.map = map;
    // 监听地图移动结束事件
    this.map.on(
      "moveend",
      debounce(() => {
        this.renderRoad(this.features);
      })
    );
    this.map.addLayer(this.layerOptions);
  }

  renderRoad(features) {
    if (!features) {
      return;
    }
    this.features = features;
    const bound = this.map.getBounds();
    let pt1 = this.map.project([bound._ne.lng, bound._ne.lat]);
    let pt2 = this.map.project([bound._sw.lng, bound._sw.lat]);
    let bbox = [pt1, pt2];
    let vtsFeatures = this.map.queryRenderedFeatures(bbox, {
      layers: this.layerIds
    });
    //   去重
    let currentVtsIds = Array.from(
      new Set(vtsFeatures.map(f => f.properties.ID))
    );
    // 获取当前视图内的路况
    let trafficFeaturesInView = features.filter(e =>
      currentVtsIds.includes(e.id)
    );
    if (trafficFeaturesInView.length == 0) {
      this.layerIds.forEach(id => {
        //设置图层颜色
        this.map.setPaintProperty(id, "line-color", "#4FD27D");
        //设置线宽
        this.map.setPaintProperty(id, "line-width", 5);
      });
    } else {
      let slowIds = [];
      let jamIds = [];
      trafficFeaturesInView.forEach(e => {
        if (e.congestionDegree == 2) {
          slowIds.push(e.id);
        } else if (e.congestionDegree == 3) {
          jamIds.push(e.id);
        }
      });
      // 缓行
      let arr1 = Array.from(new Set(slowIds));
      // 拥堵
      let arr2 = Array.from(new Set(jamIds));
      arr2 = arr2.filter(item => !arr1.includes(item));

      if (arr1.length === 0) {
        arr1 = ["none"];
      }
      if (arr2.length === 0) {
        arr2 = ["none"];
      }
      this.layerIds.forEach(layerId => {
        this.map.setPaintProperty(layerId, "line-color", [
          "match",
          ["get", "ID"],
          arr1,
          "#FFD045",
          arr2,
          "#E80E0E",
          "#4FD27D"
        ]);

        this.map.setPaintProperty(layerId, "line-width", [
          "match",
          ["get", "ID"],
          arr1,
          3,
          arr2,
          3,
          3
        ]);
      });
    }
  }
  remove() {
    this.layerOptions.remove();
  }
  setVisible(flag) {
    this.layerIds.forEach(id => {
      this.map.setLayoutProperty(id, "visibility", flag);
    });
  }
}

// 查询实时路况信息
const queryTraffic = time => {
  return new Promise(function(resolve, reject) {
    $.get(
      "http://mapservices.njghzy.com.cn:84/GeoEntityCode/traffic",
      {
        SERVICE: "traffic",
        VERSION: "1.0.0",
        REQUEST: "QueryRealTimeTrafficData",
        time: time,
        njtoken: "7a8d0555524fb2e7701d2e109b4291ad"
      },
      function(res) {
        let data = res[time];
        let features = [];
        for (let key in data) {
          data[key].forEach(item => {
            let { linkId, ...rest } = item;
            features.push({
              id: key,
              ...rest
            });
          });
        }
        resolve(features);
      }
    );
  });
};

export default {
  TrafficRender,
  queryTraffic
};
