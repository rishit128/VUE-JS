import { createApp } from 'vue'
import App from './App.vue'
import store from '../src/Store/store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from '../src/routes'
router.beforeEach((to, from, next) => {
    const authuser = JSON.parse(localStorage.getItem('profile'))
    if (to.meta.requiresAuth) {
      if (!authuser) {
        next({ name: 'signin' })
      }
      else if (to.meta.masteradminAuth) {
        if (authuser.result.Usertype == 'Master Admin') {
          next()
        }
        else {
          next({ name: 'signin' })
        }
  
      }
      else if (to.meta.adminAuth) {
        if (authuser.result.Usertype == 'Admin') {
          next()
        }
        else {
          next({ name: 'signin' })
        }
      }
      else if (to.meta.userAuth) {
        if (authuser.result.Usertype == 'user') {
          next()
        }
        else {
          next({ name: 'signin' })
        }
      }
    }
    else if (to.meta.notrequireAuth) {
      if (authuser && authuser.result.Usertype == 'Master Admin') {
        next({ name: "masteradmin" })
      }
      else if ((authuser && authuser.result.Usertype == 'Admin')) {
  
        next({ name: "admin" })
      }
      else if ((authuser && authuser.result.Usertype == 'user')) {
  
        next({ name: "user" })
      }
      else {
        next()
      }
  
    }
    else {
      next()
    }
  })
export const app = createApp(App);
app.use(Antd);
app.use(store)
app.use(router)
app.mount('#app')
