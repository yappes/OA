import AdvancedSearch from './advancedSearch/index.js';
import Aside from './aside/index.js'
import Avatar from './avatar/index.js'
import BatchImport from './batchImport/index.js'
import BatchTable from './batchTable/index.js'
import Breadcrumb from './breadcrumb/index.js'
import Btn from './btn/index.js'
import BtnsTop from './btnsTop/index.js'
import CatalogModule from './catalogModule/index.js'
import DialogModule from './dialogModule/index.js'
import CatalogScroller from './catalogScroller/index.js'
import ChangePassword from './changePassword/index.js'
import Col from './col/index.js'
import Container from './container/index.js'
import DataSelection from './dataSelection/index.js'
import FieldSelection from './fieldSelection/index.js'
import FormLayout from './formLayout/index.js'
import Header from './header/index.js'
import InputAdaptive from './inputAdaptive/index.js'
import Layout from './layout/index.js'

import ListGrid from './listGrid/index.js'
import ListGridOper from './listGridOper/index.js'
import Main from './main/index.js'
import MainRight from './mainRight/index'
import MainRightAdmin from './mainRightAdmin/index'
import Menu from './menu/index.js'
import NavTop from './navTop/index.js'
import Pagination from './pagination/index.js'
import ProfileBasic from './profileBasic/index.js'
import Steps from './steps/index.js'
import UserSelection from './userSelection/index.js'
import DeptSelection from './deptSelection/index.js'
import NavLeft from './navLeft/index.js'
import NavLeftAdmin from './navLeftAdmin/index.js'
import Message from './message/index.js'
import MessageDetail from './messageDetail/index.js'
import QueryCondition from './queryCondition/index.js'
import CheckPending from '../../src/app/workflow/checkPending/index.js'
import Checked from '../../src/app/workflow/checked/index.js'
import MyChecked from '../../src/app/workflow/myChecked/index.js'
import Drafts from '../../src/app/workflow/drafts/index.js'
import WorkGroup from '../../src/app/workflow/workGroup/index.js'
import LaunchProcess from '../../src/app/workflow/launchProcess/index.js'
import LaunchProcessAside from '../../src/app/workflow/launchProcessAside/index.js'
import ProcessManagerAside from '../../src/app/workflow/processManagerAside/index.js'
import ProcessManager from '../../src/app/workflow/processManager/index.js'
import MainRightAside from './mainRightAside/index.js'
import MainRightDictionary from './mainRightDictionary/index.js'
import CustomQuickMenu from './customQuickMenu/index.js'
import WorkflowPagenation from './workflowPagenation/index.js'
import DashboardAside from './dashboardAside/index.js'
import DashboardHeader from './dashboardHeader/index.js'
import DashboardMain from './dashboardMain/index.js'
import DashboardCommon from './dashboardCommon/index.js'
import MainRightMenu from './mainRightMenu/index.js'
import DashboardUp from './dashboardUp/index.js'
import DashboardDetail from './dashboardDetail/index.js'
import DashboardDetailInter from './dashboardDetailInter/index.js'
import DashboardRight from './dashboardRight/index.js'
import DashboardMenu from './dashboardMenu/index.js'
import DashboardList from './dashboardList/index.js'
import DashboardListCustom from './dashboardListCustom/index.js'
import DashboardListSimple from './dashboardListSimple/index.js'
import DashboardChart from './dashboardChart/index.js'
import DashboardContent from './dashboardContent/index.js'
import DashboardCustomComponent from './dashboardCustomComponent/index.js'
import DashboardCustomText from './dashboardCustomText/index.js'
import DashboardCustomUrl from './dashboardCustomUrl/index.js'

import Address from './address/index.js'
import Money from './money/index.js'

const components = [
  AdvancedSearch,
  Aside,
  Avatar,
  BatchImport,
  BatchTable,
  Breadcrumb,
  CatalogScroller,
  Btn,
  BtnsTop,
  CatalogModule,
  DialogModule,
  ChangePassword,
  Col,
  Container,
  DataSelection,
  FieldSelection,
  FormLayout,
  Header,
  InputAdaptive,
  Layout,
  ListGrid,
  ListGridOper,
  Main,
  MainRight,
  MainRightAdmin,
  Menu,
  NavLeft,
  NavLeftAdmin,
  NavTop,
  Pagination,
  ProfileBasic,
  Steps,
  UserSelection,
  DeptSelection,
  Message,
  MessageDetail,
  QueryCondition,
  CheckPending,
  Checked,
  MyChecked,
  Drafts,
  WorkGroup,
  LaunchProcess,
  LaunchProcessAside,
  ProcessManagerAside,
  ProcessManager,
  MainRightAside,
  MainRightDictionary,
  MainRightMenu,
  CustomQuickMenu,
  WorkflowPagenation,
  DashboardAside,
  DashboardHeader,
  DashboardMain,
  DashboardCommon,
  DashboardUp,
  DashboardDetail,
  DashboardDetailInter,
  DashboardRight,
  DashboardMenu,
  DashboardList,
  DashboardListCustom,
  DashboardListSimple,
  DashboardChart,
  DashboardContent,
  DashboardCustomComponent,
  DashboardCustomText,
  DashboardCustomUrl,
  Address,
  Money,
];

const install = function (Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};


export default {
    name: 'crm-vue',
    version: '2.0',
    install
}
