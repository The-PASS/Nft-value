import { createRouter, createWebHashHistory } from "vue-router";

import Index from "@/pages/Index.vue";
import Category from "@/pages/Category.vue";
import Details from "@/pages/Overview/Collectables.vue";
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
    component: () => import("@/pages/Category/index.vue"),
    redirect: "/list/Collectables",
    meta: {
      keepAlive: false,
      search: true,
    },
    children: [
      {
        name: "Collectables",
        path: "/list/Collectables",
        component: () => import("@/pages/Category/Collectables.vue"),
      },
      {
        name: "Art",
        path: "/list/Art",
        component: () => import("@/pages/Category/Art.vue"),
      },
    ],
  },
  {
    name: "Collectabless",
    path: "/Collectables/:name/:tokenId?",
    component: Details,
    meta: {
      keepAlive: false,
    },
  },
  {
    name: "Arts",
    path: "/Art/:name/:chain/:tokenId?",
    component: () => import("@/pages/Overview/Art.vue"),
    meta: {
      keepAlive: false,
      // noHeader: true,
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
