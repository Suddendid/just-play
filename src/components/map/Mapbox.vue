<template>
  <div class="mapbox">
    <div ref="mapbox" class="map"></div>
    <map-control ref="control" v-if="showControl" :mapOptions="baseMapOptions"
                 :style="{ right: controlMargin + 'px' }" @baseMapchange="addNJBaseMap"
                 class="map-control">
    </map-control>
  </div>
</template>

<script>
import MapControl from "@/components/map/MapControl.vue"
import * as MapExtend from "./extend/mapExtend";

export default {
  name: "Mapbox",
  data() {
    return {};
  },
  components: { MapControl },
  props: {
    initOption: {
      type: Object,
      default: () => { },
    },
    showControl: {
      type: Boolean,
      default: false
    },
    controlMargin: {
      type: Number,
    },
    baseMapOptions: {
      type: Array,
      default: () => {
        return [
          {
            name: "矢量",
            s: true,
            type: 0,
            dtKey: "esri_vec_dt_government",
            zjKey: "esri_vec_zj_government",
            img: ""
            // img: require("@/assets/map/r_vector.png"),
          },
          {
            name: "影像",
            s: false,
            type: -1,
            time: "2021-12-01",
            dtKey: "geo_tile_dom_dt",
            zjKey: "geo_tile_dom_zj",
            img: ""
            // img: require("@/assets/map/r_dom.png"),
          },
        ]
      },
      require: false
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap: function () {
      const defaultOption = {
        mapCRS: "4490",
        container: this.$refs.mapbox,
        zoom: 12.5,
        minZoom: 8,
        maxZoom: 20,
        center: [118.7234, 32.1325],
        isIntScrollZoom: false, //缩放级别是否为整数处理模式
        pitch: 0,
        bearing: 0,
      };
      this.map = new GeoGlobe.MapExtend(
        Object.assign(defaultOption, this.initOption)
      );
      this.map.on("load", () => {
        this.$refs.control && this.$refs.control.bindTargetMap(this.map)
        this.map.createBaseGroup()
        this.addNJBaseMap(this.baseMapOptions[0]);
        this.$emit("load", this.map);
      });
      this.map.on("click", (res) => {
        this.$emit("click", res);
      });
    },
    addNJBaseMap(option) {
      if (!option) return
      this.map.switchBaseMap(option)
    },
    flyTo(options) {
      this.map.flyTo(options);
    }
  },
  destroyed() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
};
</script>

<style scoped>
.mapbox {
  width: 100%;
  height: 100%;
}
.mapbox > .map {
  width: 100%;
  height: 100%;
  background: #15325f;
}

.map-control {
  position: absolute;
  right: 15px;
  bottom: 15px;
}
</style>
