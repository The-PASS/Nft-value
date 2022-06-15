import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createHead } from "@vueuse/head";
import "./assets/index.postcss";
// @ts-ignore
import VueTippy from "vue-tippy";
import TWEEN from "@tweenjs/tween.js";

const head = createHead();
const app = createApp(App);

const animate = (time = 300) => {
  requestAnimationFrame(animate);
  TWEEN.update(time);
};
animate();

app.use(createPinia());
app.use(router);
app.use(head);
app.use(VueTippy);

app.mount("#app");
