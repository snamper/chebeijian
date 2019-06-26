import Vue from 'vue';
import Router from 'vue-router';

import commonRouter from './common';
import notFound from './404';
import pageRouter from './page';

Vue.use(Router);

const baseRouter = [];

function combineRouter(routers) {
  return routers.reduce((pre, cur) => pre.concat(cur), baseRouter);
}

const pageRouters = [
  commonRouter,
  pageRouter,
];

// 404
pageRouters.push(notFound);

const route = new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: combineRouter(pageRouters),
});

route.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/Login',
      query: {
        redirect: to.fullPath
      }
    })
  } else if (token && to.path === 'login') {
    next('/userIndex')
    // 404判断
  } else {
    next()
  }
})
export default route;