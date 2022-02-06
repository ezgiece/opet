import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import Dashboard from '@/views/Dashboard/Dashboard.vue'

Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
 
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
]

const router = new VueRouter({
  /*mode: 'history',
  base: process.env.BASE_URL,*/
  routes
})




export default router
