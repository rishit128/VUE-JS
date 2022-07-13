import Vue from 'vue'
import { ToastPlugin } from 'bootstrap-vue'


import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import { routes } from './routes'
import ErrorComponent from './components/error/ErrorComp.vue'
export const eventbus = new Vue()
import store from './store'
import { ModalPlugin } from 'bootstrap-vue'
Vue.use(ModalPlugin)
Vue.use(BootstrapVue);
Vue.use(Vuelidate)
Vue.use(VueRouter);
Vue.config.productionTip = false
Vue.component('error-component', ErrorComponent);

Vue.use(ToastPlugin)
const router = new VueRouter({
  routes,
  mode: 'history'
});
Vue.mixin({
  computed: {
    getlocalstoragedata() {
      return JSON.parse(localStorage.getItem('profile'))
    }
  },
  methods: {
    errormessage(variant = null, message) {
      this.$bvToast.toast(message, {
        title: 'Message',
        variant: variant,
        solid: true,
        autoHideDelay: 8000
      })
    }
  }
})
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
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
