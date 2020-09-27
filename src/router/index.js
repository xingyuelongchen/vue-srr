import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
];
export function createRouter() {
  return new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
  });
}

