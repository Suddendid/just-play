/**
 * @Description:地图定位
 * @Author yangze
 * @Date 2022/6/17
 */

export const getLocation = () => {
  // if (common_tool.browser.versions.weixin) {
  //   return WXGetLocation()
  // } else {
  //   return AMapGetLocation()
  // }

  return AMapGetLocation();
};

export const WXGetLocation = () => {
  return new Promise(function (resolve, reject) {
    wx.getLocation({
      isHighAccuracy: true,
      highAccuracyExpireTime: 3001,
      type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        console.log(res);
        wgs84to84P(
          [res.longitude, res.latitude],
          function (wgsInfo) {
            resolve(wgsInfo);
          },
          function (errorInfo) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            resolve([longitude, latitude]);
          }
        );
      },
    });
  });
};

export const WebGetLocation = () => {
  return new Promise(function (resolve, reject) {
    // let onLocateSuccess = function(position) {
    //   console.log(position)
    //   let wgs84_lnglat = [position.coords.longitude, position.coords.latitude];
    //   CoordinateTransfrom("WGS84toWGS84P", wgs84_lnglat, function (wgsInfo) {
    //     resolve(wgsInfo)
    //   }, function (errorInfo) {
    //     resolve(wgs84_lnglat)
    //   })
    // }
    // let onLocateError = function(res) {
    //   reject(res);
    // }

    common_tool.getGpsInfo(
      function (position) {
        console.log(position);
        let wgs84_lnglat = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        CoordinateTransfrom(
          "WGS84toWGS84P",
          wgs84_lnglat,
          function (wgsInfo) {
            resolve(wgsInfo);
          },
          function (errorInfo) {
            resolve(wgs84_lnglat);
          }
        );
      },
      function (err) {
        console.log(err);
      }
    );
  });
};

export const AMapGetLocation = () => {
  return new Promise(function (resolve, reject) {
    AMap.plugin("AMap.Geolocation", function () {
      var geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: "RB",
      });

      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, "complete", onAmapComplete);
      AMap.event.addListener(geolocation, "error", onAmapError);

      function onAmapComplete(data) {
        // data是具体的定位信息
        console.log("成功：" + JSON.stringify(data));
        var position = data.position;
        var lon = position.lng;
        var lat = position.lat;
        var gcj_lnglat = [lon, lat];

        CoordinateTransfrom(
          "GCJ02toWGS84P",
          gcj_lnglat,
          function (wgsInfo) {
            resolve(wgsInfo);
          },
          function (errorInfo) {
            resolve(gcj_lnglat);
          }
        );
      }

      function onAmapError(data) {
        // 定位出错
        reject(data);
      }
    });
  });
};

export const QMapGetLocation = () => {
  return new Promise(function (resolve, reject) {
    let that = this;
    let qqMap = new qq.maps.Geolocation(
      "XGMBZ-NF7WR-BLLW4-WR426-7DS6K-2ZFU4",
      "mapqq"
    );
    qqMap.getLocation(
      function (res) {
        let gcj_lnglat = [res.lng, res.lat];
        CoordinateTransfrom(
          "GCJ02toWGS84P",
          gcj_lnglat,
          function (wgsInfo) {
            resolve(wgsInfo);
          },
          function (errorInfo) {
            resolve(gcj_lnglat);
          }
        );
      },
      function (error) {
        reject(error);
      }
    );
  });
};

// GCJ02转84
export const GCJ02TOWgs84 = (lnglat) => {
  return GeoGlobe.Proj4cn.gcj02towgs84(lnglat);
};

// 百度转84
export const BD09TOWgs84 = (lnglat) => {
  return GeoGlobe.Proj4cn.datum.bd09.toWGS84(lnglat);
};

export const CoordinateTransfrom = (transfromType, lnglat, success) => {
  console.log(lnglat);
  var url =
    "http://open.ihooyah.com/api/gis/coordinate-transfrom?transfromType=" +
    transfromType +
    "&locations=" +
    lnglat.join(",");
  $.ajax({
    url: url,
    headers: {
      appKey: "hLEmxIt0VOgCrHRE",
      appSecret: "ec540a180ada28cc68e013dfd36745fde33172cf",
    },
    success: function (res) {
      if (res.code == 200 && res.result.length > 0) {
        let item = res.result[0];
        console.log(item);
        success([item.longitude, item.latitude]);
      } else {
        success(GCJ02TOWgs84(lnglat));
      }
    },
    error: function (res) {
      success(GCJ02TOWgs84(lnglat));
    },
  });
};
