import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import * as config from "@/config/index";

Vue.prototype.$config = config;

import './icons'

import '@/assets/styles/font.css';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);

import api from "@/api/index";

Vue.use(api)

import takeFile from "./components/takeFile";

Vue.use(takeFile)

import Directives from './views/components/directives'

Vue.use(Directives)

import * as rem from "@/utils/rem"

Vue.prototype.$rem = rem;

const Bus = new Vue();

new Vue({
    data() {
        return {
            Bus,
        };
    },
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");

console.log(`App v${process.env.VUE_APP_VERSION} is running`);
