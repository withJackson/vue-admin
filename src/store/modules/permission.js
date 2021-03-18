import { asyncRoutes, constantRoutes } from '@/router'
const hasPremission = (route, roles) => {
  if (route.meta && route.meta.roles) {
    return route.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
const filterRoute = (asyncRoutes, roles) => {
  const res = []
  asyncRoutes.map((route) => {
    const tmp = { ...route }
    if (hasPremission(tmp, roles)) {
      if (tmp.children) {
        tmp.children = filterRoute(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
const state = {
  route: [], // 总共的路由内容
  addRoutes: [] // 用户登录上添加的路由权限
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.route = [...constantRoutes, ...routes]
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // eslint-disable-next-line no-unused-vars
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果不是admin 就设置权限禁止掉部分route
        accessedRoutes = filterRoute(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
