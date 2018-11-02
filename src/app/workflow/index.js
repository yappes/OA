
import business from './business'

export default {
  path: "/workflow",
  name: "workflow",
  component: () => import('./layout.vue'),
  redirect: "/workflow/checkPending",
  children: [{
      path: 'checked',
      name: 'checked',
      component: () => import('./checked/src/checked.vue')
    }, {
      path: 'checkPending',
      name: 'checkPending',
      component: () => import('./checkPending/src/checkPending.vue')
    }, {
      path: 'drafts',
      name: 'drafts',
      component: () => import('./drafts/src/drafts.vue')
    }, {
      path: 'launchProcess',
      name: 'launchProcess',
      component: () => import('./launchProcess/src/launchProcess.vue')
    }, {
      path: 'launchProcessAside',
      name: 'launchProcessAside',
      component: () => import('./launchProcessAside/src/launchProcessAside.vue')
    }, {
      path: 'launchProcessAll',
      name: 'launchProcessAll',
      component: () => import('./launchProcessAll/src/launchProcessAll.vue')
    }, {
      path: 'myChecked',
      name: 'myChecked',
      component: () => import('./myChecked/src//myChecked.vue')
    }, {
      path: 'processManager',
      name: 'processManager',
      component: () => import('./processManager/src/processManager.vue')
    }, {
      path: 'processManagerAside',
      name: 'processManagerAside',
      component: () => import('./processManagerAside/src/processManagerAside.vue')
    }, {
      path: 'processManageAll',
      name: 'processManageAll',
      component: () => import('./processManageAll/src/processManageAll.vue')
    }, {
      path: 'editor/:modelId',
      name: 'workflowEditor',
      component: () => import("./editor/workflow-editor.vue"),
      meta: {
        isEditorLayout: true
      }
    }, {
      path: 'workGroup',
      name: 'workGroup',
      component: () => import('./workGroup/src/workGroup.vue')
    },
    ... business
  ]
};
