import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userId: '',
  roleId: '',
  name: '',
  avatar: '',
  introduction: '',
  account: {},
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLEID: (state, roleId) => {
    state.roleId = roleId
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, type, platFormId, school } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, type: type, platFormId: platFormId, school: school.trim() }).then(response => {
        debugger
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        debugger
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const resData = JSON.parse(data)
        // resData.roles = ['admin']
        const { sname, roles } = resData

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        commit('SET_ACCOUNT', resData)
        commit('SET_USERID', resData.usersId)
        commit('SET_ROLEID', resData.roleId)
        commit('SET_ROLES', roles)
        commit('SET_NAME', sname)
        commit('SET_AVATAR', 'http://im6.leaderhero.com/emotion/6059/2012011064/7ec3ebea66.gif')
        commit('SET_INTRODUCTION', 'admin')
        resolve(resData)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
