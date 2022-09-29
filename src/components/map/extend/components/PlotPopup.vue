<!-- 小区面弹框 -->
<template>
  <div class="xqm-info four-xqm">
    <div class="xqm-info-head">
      <div class="xqm-info-head-base">
        <div class="base-title">{{item.properties.NAME}}</div>
        <div class="base-dz">
          <img src='../images/icon-xqm-dz.png' /> <span>{{item.properties.DZ}}</span>
        </div>
      </div>
      <div class="xqm-info-head-extend" @click.stop="clickFitBoudsAction">
        进入小区 <img src="../images/icon-xqm-next.png" />
      </div>
    </div>
    <div class="xqm-info-content">
      <div class="info-title">基本信息</div>
      <div class="info-items">
        <div class="info-item" v-for="e in items" :key="e.name">
          <div class="info-item-title">{{e.name}}</div>
          <div class="info-item-value">{{e.key || ""}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: 'PlotPopup',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          properties: {}
        }
      },
      require: true
    },
    fitHandler: {
      type: Function,
      default: () => null,
      require: false
    },
  },
  data() {
    return {

    }
  },
  computed: {
    items() {
      return [
        { name: "所在街道", key: this.item ? this.item.properties.SZXZ : "" },
        { name: "所在社区", key: this.item ? this.item.properties.SZSQ : "" },
        { name: "总楼栋数", key: this.item ? this.item.properties.LDZS : "" },
        { name: "总户室数", key: this.item ? this.item.properties.FWZS : "" },
        { name: "物业名称", key: this.item ? this.item.properties.PORPERTY : "" },
        { name: "开发商", key: this.item ? this.item.properties.KFS : "" },
        { name: "入住人口", key: this.item ? this.item.properties.RKZS : "" },
        { name: "物业电话", key: this.item ? this.item.properties.PORPERTY_L : "" },
        { name: "建筑年代", key: this.item ? this.item.properties.JZND : "" },
        { name: "建筑面积", key: this.item ? this.item.properties.JZMJ : "" },
        { name: "占地面积", key: this.item ? this.item.properties.ZDMJ : "" },
        { name: "绿化率", key: this.item ? this.item.properties.LHL : "" },
        { name: "物业费", key: this.item ? this.item.properties.WYF : "" },
        { name: "停车位", key: this.item ? this.item.properties.TCW : "" }
      ]
    }
  },
  components: {},
  created() {
    console.log(this.item);
  },
  mounted() {
  },
  methods: {
    clickFitBoudsAction() {
      this.fitHandler && this.fitHandler()
    },
  }
};
</script>
<style scoped>
.xqm-info {
  width: 500px;
}
.xqm-info-head {
  padding: 15px;
  background: #242f3a90;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.xqm-info-head .xqm-info-head-base {
}

.xqm-info-head .xqm-info-head-base .base-title {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}
.xqm-info-head .xqm-info-head-base .base-dz {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.xqm-info-head .xqm-info-head-base .base-dz img {
  width: 15px;
  height: auto;
  margin-right: 5px;
}
.xqm-info-head .xqm-info-head-base .base-dz span {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff90;
}

.xqm-info-head .xqm-info-head-extend {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #4effe6;
  cursor: pointer;
}

.xqm-info-head .xqm-info-head-extend img {
  margin-left: 5px;
  width: 10px;
}

.xqm-info-content {
  padding: 15px;
  padding-bottom: 5px;
  padding-top: 15px;
}

.xqm-info-content .info-title {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #4effe6;
}
.xqm-info-content .info-items {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  margin-top: 15px;
  /* margin: 30px 0; */
}
.xqm-info-content .info-item {
  width: calc((100% - 15px) / 2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  margin-right: 15px;
}

.xqm-info-content .info-item:nth-child(2n) {
  margin-right: 0;
}

.xqm-info-content .info-item-title {
  flex: 1;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
}
.xqm-info-content .info-item-value {
  flex: 2;
  font-size: 12px;
  line-height: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}
</style>
