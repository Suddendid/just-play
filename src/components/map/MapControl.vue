<template>
  <div class="control-container">
    <div class="map-tool">
      <div class="map-btn map-compass" @click="resetRotateAction">
        <img :style="{transform: `rotateZ(${compassRotate})`}"
             src="@/assets/images/map/map_compass.png">
      </div>
      <div class="map-btn" @click.stop="changeDimensionAction">{{is3D ? '3D' : '2D'}}</div>
      <div class="map-btn map-zoomin" @click.stop="zoomInAction">
        <a-icon type="plus" />
      </div>
      <div class="map-btn map-zoomout" @click.stop="zoomOutAction">
        <a-icon type="minus" />
      </div>
    </div>

    <div class="map-switch" v-if="mapOptions.length > 0">
      <div class="map-switch-item" v-if="!show" @mouseenter="onEnterMapSwitchAction">
        <img :src="selectItem.img">
        <div class="map-switch-text" :style="{backgroundColor: selectItem.s ? '#3385FF' : ''}">
          {{selectItem.name}}</div>
      </div>
      <div class="map-switch-items" ref="switchItems" v-if="show" @mouseleave="show = false">
        <div v-for="(item,index) in mapOptions" :key="index" class="map-switch-item"
             :class="item.s ? 'map-switch-active' : ''" @click="switchMapAction(item)">
          <img :src="item.img">
          <div class="map-switch-text" v-if="item.name && item.name.length > 0"
               :style="{backgroundColor: item.s ? '#3385FF' : ''}">
            {{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MapControl',
  components: {
  },
  props: {
    mapOptions: {
      type: Array,
      default: () => {
        return []
      },
      require: false
    },
  },
  data() {
    return {
      compassRotate: 0,
      is3D: false,
      show: false
    }
  },
  computed: {
    selectItem() {
      let item = this.mapOptions.find(e => e.s)
      if (!item) {
        return this.mapOptions[0]
      }
      return item
    }
  },
  mounted() {

  },
  methods: {
    bindTargetMap(targetMap) {
      this.targetMap = targetMap
      this.targetMap.on('rotate', () => {
        let bearing = this.targetMap.getBearing();
        this.compassRotate = `${0 - bearing}deg`;
      })
    },
    /**
     * 切换维度
     */
    changeDimensionAction() {
      if (this.is3D) {
        this.is3D = false
        this.targetMap && this.targetMap.flyTo({ pitch: 0 })
      } else {
        this.is3D = true
        this.targetMap && this.targetMap.flyTo({ pitch: 60 })
      }
    },
    /**
     * 切换图层
     */
    switchMapAction(item) {
      if (!item.s) {
        this.mapOptions.forEach(element => {
          element.s = false
        });
        item.s = true
        this.$emit("baseMapchange", item)
        // this.option.changeBaseMapHandler && this.option.changeBaseMapHandler(item)
      }
    },
    resetRotateAction() {
      this.targetMap && this.targetMap.easeTo({ bearing: 0 })
    },
    zoomInAction: function () {
      this.targetMap && this.targetMap.zoomIn()
    },
    zoomOutAction: function () {
      this.targetMap && this.targetMap.zoomOut()
    },
    onEnterMapSwitchAction() {
      this.show = true
      //   anime({
      //     targets: '.map-switch-items',
      //     background: 'rgba(255,255,255,0.80)',
      //     width: ['110px', '200px'],
      //     easing: 'easeInOutQuad',
      //     duration: 350,
      //     loop: false,
      //   })
      //   let that = this;
      //   if (!that.showMapSwitch) {
      //     that.showMapSwitch = true;

      //     let eles = document.querySelectorAll('.map-switch > div');
      //     $(eles[0]).animate({ right: '106px' }, 350);
      //     // $(eles[1]).animate({ right: '106px' }, 350);

      //     anime({
      //       targets: '.map-switch',
      //       background: 'rgba(255,255,255,0.80)',
      //       width: ['110px', '200px'],
      //       easing: 'easeInOutQuad',
      //       duration: 350,
      //       loop: false,
      //     });
      //   }
    },
    onLeaveMapSwitchAction() {
      //   let that = this;
      //   if (that.showMapSwitch) {
      //     that.showMapSwitch = false;

      //     anime({
      //       targets: '.map-switch',
      //       background: 'rgba(255,255,255,0)',
      //       width: ['299px', '110px'],
      //       easing: 'easeInOutQuad',
      //       duration: 350,
      //       loop: false,
      //     });

      //     let eles = document.querySelectorAll('.map-switch > div');
      //     $(eles[0]).animate({ right: '10px' }, 350);
      //     $(eles[1]).animate({ right: '10px' }, 350);
      //   }
    }
  }
}

</script>

<style scoped>
.control-container {
}

.map-tool {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
}

.map-compass > img {
  width: 50px;
}

.map-btn {
  width: 36px;
  height: 36px;
  cursor: pointer;
  background-color: #37393d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
}

.map-tool > div:hover {
  color: #3291a8;
}

.map-tool > div:nth-child(1) {
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: -1px 1px 1px 0 #282c34;
}

.map-tool > div:nth-child(2) {
  border-radius: 4px 4px 0 0;
}

.map-tool > div:nth-child(n + 3):before {
  content: "";
  position: absolute;
  top: 0;
  left: 5px;
  right: 5px;
  height: 1px;
  background-color: #727272;
}

.map-tool > div:nth-child(4) {
  border-radius: 0 0 4px 4px;
}

.map-tool > div > i {
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.map-switch {
  cursor: pointer;
  padding: 5px;
  background-color: #ffffff;
}

.map-switch-items {
  cursor: pointer;
  z-index: 9;
  border-radius: 2px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
}

.map-switch-item {
  width: 86px;
  height: 60px;
  position: relative;
  cursor: pointer;
}

.map-switch-item:nth-child(n + 2) {
  margin-left: 5px;
}

.map-switch-item > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}

.map-switch-item > .map-switch-text {
  position: absolute;
  right: 0;
  bottom: -1px;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.3);
}

.map-switch-active > img {
  border: 1px solid #3385ff;
}
</style>
