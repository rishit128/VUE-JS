import signUp from './components/Forms/SignUp.vue'
import signIn from './components/Forms/SignIn.vue'
import masteradmin from './components/Master Admin/MasterAdmin.vue'
import admin from './components/Admin/AdminPage.vue'
import * as VueRouter from 'vue-router'
import user from './components/User/UserPage.vue'

export const routes = [
    {path:'',component:signIn, name:'signin',meta:{notrequireAuth:true}},
    { path: "/signin", component: signIn, name: "signin" ,meta:{notrequireAuth:true}},
    { path: "/signup", component: signUp, name: "signup" ,meta:{notrequireAuth:true}},
    { path: "/masteradmin", component: masteradmin, name: "masteradmin", meta: { requiresAuth: true, masteradminAuth: true } },
    { path: "/admin", component: admin, name: "admin", meta: { requiresAuth: true, adminAuth: true } },
    { path: "/user", component: user, name: "user", meta: { requiresAuth: true, userAuth: true } },
    {path: '/:pathMatch(.*)*', redirect: {name:"signin"}}
]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

export default router
