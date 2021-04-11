import Vue from 'vue'
import Vuex from "vuex"
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/main.css'

Vue.use(Vuex)
Vue.config.productionTip = false
import createPersistedState from 'vuex-persistedstate'


const store = new Vuex.Store({
  state:{
    user: null,
    token: null,
    eventArray: [],
    cola_resources: [
      // your resource list
      {id:"CO1", title: "CO1"},
      {id:"CO2", title: "CO2"},
      {id:"CO3", title: "CO3"},
      {id:"CO4", title: "CO4"},
      {id:"CO5", title: "CO5"},
      {id:"CO6", title: "CO6"},
      {id:"CO7", title: "CO7"},
      {id:"CO8", title: "CO8"},
      {id:"CO9", title: "CO9"},
      {id:"C010", title: "C010"},

    ],
    pepsi_resources: [
      // your resource list
      {id:"PO1", title: "PO1"},
      {id:"PO2", title: "PO2"},
      {id:"PO3", title: "PO3"},
      {id:"PO4", title: "PO4"},
      {id:"PO5", title: "PO5"},
      {id:"PO6", title: "PO6"},
      {id:"PO7", title: "PO7"},
      {id:"PO8", title: "PO8"},
      {id:"PO9", title: "PO9"},
      {id:"P010", title: "P010"},

    ],
  },
  mutations: {
    setUser(state, user){
      state.user = user;
    },
    setToken(state, token){

      state.token = token;
    },
    logout: (state) => {
      state.token = null;
    },
    setEvents(state, arrayEvents){
      state.eventArray = arrayEvents;

    },
    setAvailibilities(state, arr){

      arr.map(x => {
        x.start = new Date(x.start);
        x.end = new Date(x.end);
      });

      state.eventArray = arr

    }
  },
  actions: {
    fetchAccessToken({ commit }) {
      commit('setToken', localStorage.getItem('token'))
    }},
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    resources(state){
      return localStorage.getItem('company') == 'COLA' ? state.cola_resources : state.pepsi_resources;
    },
    allEvents(state){
     
      return state.eventArray;
    },

  },
})


Vue.use(store)
new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')





export default store