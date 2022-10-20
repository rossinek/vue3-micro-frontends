import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { plugin as MicroFrontends } from "./services/micro-frontends";

const app = createApp(App);
app.use(router);
app.use(MicroFrontends);
app.mount("#app");
