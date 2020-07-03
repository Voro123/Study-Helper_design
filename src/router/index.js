import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'

Vue.use(Router)

export default new Router({
  // 为了禁用自带的井号
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      components: {
        default: Main
      }
    }
  ]
})
