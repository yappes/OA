export default {
  path: "/task",
  name: "task",
  redirect: '/task/home',
  component: {
    template: `<router-view></router-view>`
  },
  children: [{
    path: '/task/home',
    name: 'manageHome',
    redirect: '/task/manage',
    component: () => import("./layout.vue"),
    children: [{
      path: '/task/manage',
      name: 'manage',
      component: () => import("./manage/manage.vue")  
    },{
      path: '/task/detection',
      name: 'detection',
      component: () => import("./manage/manage.vue")  
    }],
  },{
    path: '/task/insertTask',
    name: 'insertTask',
    component: () => import("./creatTask/creatTask.vue"),
  }],
}
