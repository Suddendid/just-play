import Vue from "vue";
import Router from "vue-router";
import Index from "@/views/Index.vue";
import NotFound from "@/views/NotFound.vue";

const Test = require("@/views/components/test.vue")
Vue.use(Router);

export default new Router({
    // mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            redirect: "/VideoDemo",
        },
        {
            path: "/play-home",
            name: "PlayHome",
            component: () => {
                return import("@/views/PlayHome.vue")
            },
        },
        {
            path: "/VideoDemo",
            name: "VideoDemo",
            component: () => {
                return import("@/views/VideoDemo.vue")
            },
        },
        {
            path: "/",
            redirect: "/Login",
        },
        {
            path: "/Index",
            name: "Index",
            component: Index,
        },
        {
            path: '/Login',
            name: 'Login',
            component: () => {
                return import("@/views/Login.vue")
            },
            meta: {
                title: "登录",
            },
        },
        {
            name: 'test',
            path: '/test',
            component: Test.default
        }
    ],
});
/**
 * 重写路由的push方法
 * 解决，相同路由跳转时，报错
 * 添加，相同路由跳转时，触发watch (针对el-menu，仅限string方式传参，形如"view?id=5")
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    sessionStorage.setItem("k_route_opt", "push");
    return routerPush.call(this, location).catch((error) => error);
};

//重写路由的replace方法
const routerReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    sessionStorage.setItem("k_route_opt", "replace");
    return routerReplace.call(this, location).catch((error) => error);
};
