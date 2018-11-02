// 功能
// ----------------------------
import business from "./business/index.js";
import admin from "./admin/index.js";
import workflow from "./workflow/index.js";
import dashboard from './dashboard/index.js';
import NotFound from "./404";
import task from './task/index.js';
import message from './admin/message/index.js'
import  workflowDashboard from './workflow/dashboard.vue'

const routes = [{
    path: "/",
    redirect: "/dashboard"
  },
  business,
  admin,
  workflow,
  dashboard,
  task,
  message,
  {
    path: "*",
    name: "404",
    component: NotFound
  },
  {
    path: "/workflowDashboard",
    name: "workflowDashboard",
    component: workflowDashboard
  },
];

//测试时使用
console.log("routes", routes);
export default routes; //临时测试路由
