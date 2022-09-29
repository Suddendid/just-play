# 项目启动
- npm install
- npm run dev


# 项目打包编译
- 打包测试环境(测试环境) npm run build:testing
- 打包预发布环境 npm run build:staging
- 打包正式环境 npm run build


# 项目结构
```
├── public                  # 静态资源，不需要 webpack 处理
├── .env                    # 开发环境  可配置环境变量
├── .env.staging            # 预发布环境  可配置环境变量
├── .env.testing            # 测试环境  可配置环境变量
├── .env.production         # 正式环境  可配置环境变量
├── vue.config.js           # VueCli配置plugin loader
└── src
    ├── assets
    │   ├── fonts      # 字体文件
    │   ├── images     # 图片资源
    │   └── styles     # CSS样式文件
    ├── components
    │   ├── chart      # 封装了echarts组件 使用参考README.md
    │   └── swiper     # 封装了swiper组件 使用参考REAME.md
    │   └── ... 后续补充
    │      
    ├── api        # 接口api PS:main.js已经全局导入api所有接口 添加入modules后 使用Vue.use()引入 可直接使用this.$api.<接口名>调用
    │   └── modules    # 此目录中添加api接口 
    ├── mixins         # 混入
    ├── store          # VueX
    ├── router         # 路由及拦截器
    ├── utils          # 工具库
    │   ├── request       # http请求封装
    │   ├── ...
    │   
    └── views
        └── Index
```

# 页面适配 rem
- res.js 中已设置 根元素fontSize = 100px 确保正确的设计稿宽度即可， 使用时导入main.js中可实现自行适配
- 对于内联样式 使用rem布局 （设计稿px / 100） rem 即可
- 对于echarts等使用JS设置的尺寸 使用rem.js中的fontSize方法转换为当前页面的大小即可
- 对于CSS文件 使用postcss-pxtorem 插件可实现自动转换 也可开发中自行转换为rem
