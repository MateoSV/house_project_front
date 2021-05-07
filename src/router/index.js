import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Houses from '../views/Houses.vue'
import Persons from "../views/Persons";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/houses',
    name: 'Houses',
    component: Houses
  },
  {
    path: '/persons',
    name: 'Persons',
    component: Persons
  },
]

const router = new VueRouter({
  routes
})

export default router
