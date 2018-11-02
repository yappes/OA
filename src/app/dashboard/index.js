import Dashboard from "./dashboard.vue";
import DashboardView from "./dashboardView.vue";
import DashboardEdit from "./dashboardEdit.vue";

export default {
  path: "/dashboard",
  name: "dashboard",
  component: Dashboard,
  redirect: "/dashboard/dashboardView",
  children: [{
      path: "dashboardView",
      name: "dashboardView",
      component: DashboardView
    },{
      path: "dashboardEdit/:homepageType/:viewId",
      name: "dashboardEdit",
      component: DashboardEdit
    }
  ]
};
