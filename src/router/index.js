import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: () => import(/* webpackChunkName: "Todo" */ '../views/Todo.vue')
}]

const router = new VueRouter({
  routes
})

export default router
