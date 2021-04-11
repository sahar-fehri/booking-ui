import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'signup',
    component: () => import('../components/Signup.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/room',
    name: 'room',
    component: () => import('../components/Room.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base:'/',
  routes
})


export default router
