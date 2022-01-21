import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: '',
    nextId: 0,
    viewKey: 'all'
  },
  mutations: {
    initData(state, list) {
      state.list = list
      state.nextId = list.length
    },
    getInputvalue(state, data) {
      state.inputValue = data
    },
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list = [...state.list, obj]
      state.nextId++
      state.inputValue = ''
    },
    changeViewkey(state, data) {
      state.viewKey = data
    },
    changeDone(state, data) {
      const {
        id,
        done
      } = data
      state.list.forEach(x => {
        if (x.id === id) {
          x.done = done
        }
      })
    },
    removeCurrentItem(state, id) {
      const i = state.list.findIndex(x => x.id === id)
      if (i !== -1) {
        state.list.splice(i, 1)
        state.nextId--
      }
    },
    removeDone(state) {
      state.list = state.list.filter(x => x.done === false)
    }
  },
  actions: {
    async getList(context) {
      const {
        data
      } = await axios.get('/list.json')
      context.commit('initData', data)
    }
  },
  getters: {
    undoneList(state) {
      return state.list.filter(x => x.done === false).length
    },
    infolist(state) {
      switch (state.viewKey) {
        case 'all':
          return state.list
        case 'undone':
          return state.list.filter(x => !x.done)
        case 'done':
          return state.list.filter(x => x.done)
        default:
          return state.list
      }
    }
  },
  plugins: [createPersistedState({
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, {
        expires: 3,
        secure: true
      }),
      removeItem: key => Cookies.remove(key)
    }
  })]
})
