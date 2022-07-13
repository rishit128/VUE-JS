// import NavBar from  "./components/NavBar.vue"
import SignUp from "./components/Forms/SignUp.vue"
import HomePage from "./components/HomePage.vue"
import signIn from "./components/Forms/SignIn.vue"
import masteradmin from "./components/MasterAdmin/MasterAdmin.vue"
import admin from "./components/Admin/AdminPage.vue"
import user from "./components/User/UserPage.vue"
export const routes = [
    {path:'',component:HomePage, name:'homepage',meta:{notrequireAuth:true}},
    {path:"/registeruser",component:SignUp, name:'registeruser',meta:{notrequireAuth:true}},
    {path:"/signin",component:signIn, name:"signin",meta:{notrequireAuth:true}},
    {path:"/masteradmin",component:masteradmin, name:"masteradmin",meta: { requiresAuth: true , masteradminAuth:true }},
    {path:"/admin",component:admin,name:"admin",meta: { requiresAuth: true , adminAuth:true }},
    {path:"/user",component:user,name:"user",meta:{requiresAuth: true,userAuth:true}},
    {path: '*', redirect: {name:"signin"}}
]