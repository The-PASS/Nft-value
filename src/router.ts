import { createRouter, createWebHashHistory } from "vue-router";

import Index from "@/pages/Index.vue";
import Category from "@/pages/Category.vue";
import Dashboard from "@/pages/Dashboard/index.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Index,
    meta: {
      title: "Vite + Vue + TypeScript + Tailwind Starter Template",
      search: false,
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
    },
  },
  {
    name: "details",
    path: "/detail/:name/:tokenId?",
    component: Dashboard,
    meta: {
      keepAlive: false,
    },
  },
  {
    name: "search",
    path: "/search/:keyword",
    component: import("@/pages/Search.vue"),
    meta: {
      keepAlive: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
