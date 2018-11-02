// import MessageTemplete from "./messageTemplete.vue";

export default {
  path: "/admin",
  name: "admin",
  component: () => import("./adminPage.vue"),
  redirect: "/admin/departmentUser",
  children: [
    {
      path: "modulesInfo",
      name: "modulesInfo",
      component: () => import("./customSettings/modulesInfo/modulesInfo.vue")
    },
    {
      path: "modulesSetting",
      name: "modulesSetting",
      component: () => import("./customSettings/modulesSetting/modulesSetting.vue")
    },
    {
      path: "departmentUser",
      name: "departmentUser",
      component: () => import("./userJurisdiction/departmentUser/departmentUser.vue"),
    },
    {
      path: "rolePermission",
      name: "rolePermission",
      component: () => import("./userJurisdiction/role/role.vue")
    },{
      path: "customPermission",
      name: "customPermission",
      component: () => import("./userJurisdiction/custom/custom.vue")
    },
    {
      path: "parameter",
      name: "parameter",
      component: () => import("./enterprise/parameter/parameter.vue")
    },
    {
      path: "detail",
      name: "detail",
      component: () => import("./enterprise/detail/detail.vue")
    },
    {
      path: "dictionary",
      name: "dictionary",
      component: () => import("./dictionary/dictionary.vue")
    },{
      path: "mobileView",
      name: "mobileView",
      component: () => import("./mobile/mobileView/mobileView")
    },
    {
      path: "mobileMenu",
      name: "mobileMenu",
      component: () => import("./mobile/mobileMenu/mobileMenu")
    },
    {
      path: "menuSetting",
      name: "menuSetting",
      component: () => import("./customSettings/menuSetting/menuSetting.vue")
    },
    {
      path: "homePageSetting",
      name: "homePageSetting",
      component: () => import("./dashboardSetting/homePageSetting/homePageSetting.vue")
    },
    {
      path: "panelSetting",
      name: "panelSetting",
      component: () => import("./dashboardSetting/panelSetting/panelSetting.vue")
    },{
      path: "taskManage",
      name: "taskManage",
      component: () => import('../task/manage/manage.vue'),
    },{
      path:"messageConfig",
      name:"messageConfig",
      component: () => import('./message/messageConfig/messageConfig.vue'),
    },{
      path:"smsTemplate",
      name:"smsTemplate",
      component: () => import('./message/messageTemplate/smsTemplate.vue')
    }, {
      path: "tipsTemplate",
      name: "tipsTemplate",
      component: () => import('./message/messageTemplate/tipsTemplate.vue')
    }, {
      path: "emailTemplate",
      name: "emailTemplate",
      component: () => import('./message/messageTemplate/emailTemplate.vue')
    }, {
      path: "createEmail",
      name: "createEmail",
      component: () => import('./message/createTemplate/createEmail.vue')
    }, {
      path: "processManageAll",
      name: "processManageAll",
      component: () => import('../workflow/processManageAll/src/processManageAll')
    }, {
      path: "workGroup",
      name: "workGroup",
      component: () => import('../workflow/workGroup/src/workGroup')
    }
  ]
};
