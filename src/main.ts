import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createHead } from "@vueuse/head";
import "./assets/index.postcss";
// @ts-ignore
import VueTippy from "vue-tippy";
import TWEEN from "@tweenjs/tween.js";
import VueClickAway from "vue3-click-away";

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
app.use(VueClickAway);

app.mount("#app");
