import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({

    state: {
        isloggedIn: !!localStorage.getItem('profile'),
        loginuser: JSON.parse(localStorage.getItem('profile'))?.result||null,
        user: []
    },
    actions: {
        storeuserdata: ({ commit }) => {
            axios.get("http://localhost:5000/user/getdata")
                .then(res => { commit('userdata', res.data) })
                .catch(err => { console.log(err) })
        },
        edituserdata: ({ commit }, payload) => {
            axios.post("http://localhost:5000/user/updatedata", payload)
                .then(res => { commit('edituser', res.data) })
                .catch(err => { console.log(err); })

        },
        deleteuserdata: ({ commit }, payload) => {
            console.log(payload);
            axios.post("http://localhost:5000/user/deleteresult", payload)
                .then(res => { commit('deleteuser', res.data) })
                .catch(err => { console.log(err); })
        },
        adduseraction: ({ commit }, payload) => {
            console.log(payload);
            commit('adduserdata', payload)
        },
        loginuser: ({commit}, payload) => {
            commit("login", payload)
        },
        edituserone:({commit},payload)=>{
            commit('editfinaluser',payload)
        }

    },
    mutations: {
        userdata: (state, userdata) => {
            let users = []
            if (state.loginuser.Usertype== 'Admin') {
                users = userdata.filter((user)=>{
                    return user.Createdby == state.loginuser.email

                })
                
                state.user = users

            }
            else{
                const payload = userdata.filter((user) => {
                    return user.Usertype
                        != 'Master Admin'
                })
                state.user = payload
            }
            
        },
        edituser: (state, editdata) => {
            console.log(editdata);
            const payload = state.user.map((user) => { return user.email == editdata.email ? editdata : user })
            console.log(payload);
            state.user = payload
        },
        deleteuser: (state, deletedata) => {
            const payload = state.user.filter((user) => { return user.email !== deletedata.email })
            state.user = payload
        },
        adduserdata: (state, adduserdata) => {
            console.log(adduserdata)
            state.user = [adduserdata, ...state.user]
        },
        login: (state, payload) => {
            state.loginuser = payload
        },
        editfinaluser:(state,payload)=>{
            localStorage.setItem('profile',JSON.stringify(payload))
            state.loginuser = payload
        }


    },
    getters: {
        getuserdata: (state) => {
            return state.user
        },
        getloginuser:(state)=>{
            return state.loginuser
        }
    }
})