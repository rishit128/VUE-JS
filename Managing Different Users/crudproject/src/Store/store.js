import { createStore } from 'vuex';
import axios from 'axios'
const store = createStore({
    state: {
        isloggedIn: !!localStorage.getItem('profile'),
        loginuser: JSON.parse(localStorage.getItem('profile'))?.result || null,
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
           
            axios.post("http://localhost:5000/user/deleteresult", payload)
                .then(res => { commit('deleteuser', res.data) })
                .catch(err => { console.log(err); })
        },
        adduseraction: ({ commit }, payload) => {
          
            commit('adduserdata', payload)
        },
        loginuser: ({ commit }, payload) => {
            commit("login", payload)
        },
        edituserone: ({ commit }, payload) => {
            commit('editfinaluser', payload)
        },
        multiuserdelete: ({ commit }, payload) => {
            axios.post("http://localhost:5000/user/multiuserdelete", payload).then(res => {
                commit('multiuserdelete', res.data)
            })
                .catch(err => {
                    console.log(err);
                })

        }

    },
    mutations: {
        userdata: (state, userdata) => {
            let users = []
            
            if (state.loginuser.Usertype == 'Admin') {
                users = userdata.filter((user) =>
                 {return user.Createdby == state.loginuser.email }

                )


            }
            else {
                users = userdata.filter((user) => {
                    return user.Usertype
                        != 'Master Admin'
                })



            }
        
            // for (let i = 0; i < users.length; i++) {
            //     allusers.push({ ...users[i], key: users[i]._id })
            // }
            // const allusers = users.map((user) => { return { ...user, key: user._id } })
            state.user = users
        },
        edituser: (state, editdata) => {

            const payload = state.user.map((user) => { return user.email == editdata.email ? editdata : user })

            state.user = payload
        },
        deleteuser: (state, deletedata) => {
            const payload = state.user.filter((user) => { return user.email !== deletedata.email })
            state.user = payload
        },
        adduserdata: (state, adduserdata) => {
            
            
            state.user = [adduserdata, ...state.user]
        },
        login: (state, payload) => {
            state.loginuser = payload
        },
        editfinaluser: (state, payload) => {
         
            localStorage.setItem('profile', JSON.stringify(payload))
            state.loginuser = payload.result
        },
        multiuserdelete: (state, deleteuserdata) => {
            
            let payload = state.user.filter(user => {
                return !deleteuserdata.includes(user._id)
            })
            
            state.user = payload
        }


    },
    getters: {
        getuserdata: (state) => {
            let allusers = []
             for (let i = 0; i < state.user.length; i++) {
                allusers.push({ ...state.user[i], key: state.user[i]._id })
            }
            return allusers
        },
        getloginuser: (state) => {
            return state.loginuser
        }
    }
});


export default store