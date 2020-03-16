import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '92看课', icon: 'dashboard', affix: true }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/documentation',
    component: Layout,
    name: 'documentation',
    redirect: '/documentation/index',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'documentation',
      roles: ['1', '2'] // you can set roles in root nav
    },
    children: [
      {
        path: 'notice',
        component: () => import('@/views/notice/index'),
        name: 'Notice',
        meta: { title: '公告管理', icon: 'documentation',
          roles: ['1'] }
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'documentation',
          roles: ['1'] }
      },
      {
        path: 'dlgroup',
        component: () => import('@/views/dlgroup/index'),
        name: 'Dlgroup',
        meta: { title: '分组管理', icon: 'documentation',
          roles: ['1', '2'] }
      },
      {
        path: 'platform',
        component: () => import('@/views/platform/index'),
        name: 'Platform',
        meta: { title: '平台管理', icon: 'documentation',
          roles: ['1'] }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    alwaysShow: true,
    meta: { title: '财务管理', icon: 'guide', noCache: true, roles: ['1', '2', '3'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/rechrecord/index'),
        name: 'Rechrecord',
        meta: { title: '充值管理', noCache: true,
          roles: ['1'] }
      },
      {
        path: 'transferindex',
        component: () => import('@/views/rechrecord/transferindex'),
        name: 'Transferindex',
        meta: { title: '转账管理', noCache: true,
          roles: ['1', '2', '3'] }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '@/views/users/index',
    hidden: false,
    children: [
      {
        path: 'index',
        // component: () => import('@/views/profile/index'),
        component: () => import('@/views/users/index'),
        name: 'Agent',
        meta: { title: '代理管理', icon: 'user', noCache: true, roles: ['1', '2'] }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '平台管理',
      icon: 'lock',
      roles: ['1'] // you can set roles in root nav
    },
    children: [
      {
        path: 'platformprice',
        component: () => import('@/views/platformprice/index'),
        name: 'Platformprice',
        meta: {
          title: '价格管理',
          roles: ['1'] // or you can only set roles in sub nav
        }
      }

    ]
  },

  {
    path: '/dkorder',
    component: Layout,
    meta: {
      title: '订单管理',
      icon: 'lock' // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dkorder/index'),
        name: 'Dkorder',
        meta: { title: '订单管理', icon: 'icon', noCache: true,
          roles: ['1', '2', '3', '4'] }
      },
      {
        path: 'create/:id(\\d+)/:platformId(\\d+)',
        component: () => import('@/views/dkorder/create'),
        name: 'CreateOrder',
        meta: { title: '编辑订单', noCache: false, activeMenu: '/dkorder/index',
          roles: ['1', '2', '3', '4'] },
        hidden: true
      },
      {
        path: 'createRetail',
        component: () => import('@/views/dkorder/createRetail'),
        name: 'DkorderRetail',
        meta: { title: '零售下单', icon: 'icon', noCache: false, roles: ['5'] }
        // you can set roles in root nav
      },
      {
        path: 'payPage/:orderId(\\d+)',
        component: () => import('@/views/dkorder/payPage'),
        name: 'orderpayPage',
        meta: { title: '订单支付', noCache: false, activeMenu: '/dkorder/createRetail',
          roles: ['5'] },
        hidden: true
      },
      {
        path: 'wzfOrder',
        component: () => import('@/views/dkorder/wzfOrder'),
        name: 'wOrderList',
        meta: { title: '未支付订单', icon: 'icon',
          roles: ['5'] }
      },
      {
        path: 'list',
        component: () => import('@/views/dkorder/list'),
        name: 'DkorderList',
        meta: { title: '订单查询', icon: 'icon' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
