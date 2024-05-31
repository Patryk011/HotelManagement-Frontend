import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/", component: Home, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.push("/login");
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem("username")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
