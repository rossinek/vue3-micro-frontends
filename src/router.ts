import { createRouter, createWebHistory } from "vue-router";
import HostApp from "./components/HostApp.vue";
import ChildApp from "./components/ChildApp.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/host" },
    { path: "/host", component: HostApp },
    { path: "/child", component: ChildApp },
  ],
});
