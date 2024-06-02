import { createRouter, createWebHistory } from "vue-router";
import Customer from "@/components/Customer.vue";
import Room from "@/components/Room.vue";
import Home from "@/components/Home.vue";
import Hotel from "@/components/Hotel.vue";
import Reservation from "@/components/Reservation.vue";
import Payment from "@/components/Payment.vue";
import Login from "@/components/Login.vue";

const routes = [
  { path: "/customers", component: Customer, meta: { requiresAuth: true } },
  { path: "/rooms", component: Room, meta: { requiresAuth: true } },
  { path: "/hotel", component: Hotel, meta: { requiresAuth: true } },
  { path: "/", component: Home, meta: { requiresAuth: true } },

  {
    path: "/reservation",
    component: Reservation,
    meta: { requiresAuth: true },
  },
  { path: "/payment", component: Payment, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
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
