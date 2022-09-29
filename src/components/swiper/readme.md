- 导入 rollSwiper 文件
- 加入 components
- <roll-swiper>
    <template v-slot:slide="e">
    /** e{
            value: 当前slide值
            index: slide索引
        } 
    */
    </template>
    </roll-swiper>
- 属性：
  idName: 非必填 会自动生成
  option： 参数同 swiper 官方 option
  values: slides
