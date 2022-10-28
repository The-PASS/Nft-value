import { createRouter, createWebHashHistory } from "vue-router";

import Index from "@/pages/Index.vue";
import Category from "@/pages/Category.vue";
import Details from "@/pages/Dashboard/index.vue";
import Search from "@/pages/Search.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Index,
    meta: {
      title: "Vite + Vue + TypeScript + Tailwind Starter Template",
      footer: true,
      nopadding: true,
      keepAlive: false,
    },
  },
  {
    name: "List",
    path: "/list",
    component: Category,
    meta: {
      keepAlive: false,
      search: true,
    },
  },
  {
    name: "details",
    path: "/detail/:name/:tokenId?",
    component: Details,
    meta: {
      keepAlive: false,
    },
  },
  {
    name: "search",
    path: "/search/:keyword?",
    component: Search,
    meta: {
      keepAlive: false,
      noHeader: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
