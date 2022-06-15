import { createRouter, createWebHistory } from "vue-router";

import Index from "@/pages/Index.vue";
import Category from "@/pages/Category.vue";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
  {
    path: "/",
    component: Index,
    meta: {
      title: "Vite + Vue + TypeScript + Tailwind Starter Template",
      search: false,
    },
  },
  {
    path: "/list",
    component: Category,
  },
  {
    path: "/detail",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
