# paas-web-desktop

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 常用命令

##### 部署

```bash
npm run build && scp -r ./dist/* root@139.198.3.73:/opt/html/preview/
```

##### 打包

```bash
npm run build
cd dist
tar -zcvf paas-web_v4.0.1.tar.gz ./

```

### AUI-WEB 文档内容

`http://localhost:8081/aui-web/aui-docs`

### 基于 Vue2.0 和 ECharts 封装的图表组件

`https://v-charts.js.org/#/`

### VSCode 推荐插件

* `Auto Close Tag`
* `Auto Rename Tag`
* `Beautify`
* `ESLint`
* `Git Blame`
* `gitignore`
* `GitLens`
* `JavaScript(ES6)`
* `markdownlint`
* `npm`
* `Path Intellisense`
* `Prettier`
* `TODO Highlight`
* `Vetur`
* `Vue 2 Snippets`
* `Vue VSCode Snippets`

### 更新日志

> v4.2.1

* 解决4.2.0版本若干bug问题
* 新增任务中心、可后台处理任务，并与工作流对接
* 新增面板中心(dashboard)：可视化灵活主页定制，支持多种面板展示类型
* 工作流设计器优化：流程变更处理、数据差异化显示等
* 优化后台自定义配置功能
* 后端服务更新包含文件中心、授权中心

> v4.1.0

* 重构样式结构
* 兼容IE11以上
* 抽取渲染规则库
* 使用Vuex管理数据
* 对接后端服务优化
* 优化服务请求方式
* 简化扩展开发模式，更容易上手
* 迁移基础组件使用AUI-WEB
* 抽取通用业务组件
* 优化渲染效率


### 已写页面样式的路径

 1、鼠标滑过右上角消息出现的提示内容：
       文件代码路径：pui-web/components/message
       页面路径：http://localhost:8081/#/demo/list

 2、消息列表页面：
        文件代码路径：src/app/business/infoCenterPage.vue；
             src/app/business/infoCenterPage.js
        
        页面显示路径：http://localhost:8081/#/demo/infoCenter

 3、消息详情页面：
        文件代码路径：src/app/business/infoDetailPage.vue
             pui-web/components/messageDetail

        页面显示路径：http://localhost:8081/#/demo/infoDetail


 4、高级搜索，高级查询，快捷菜单设置，人员选择，设置按钮  的dialog弹窗：
        文件代码路径：pui-web/components/listGrid

        页面显示路径：http://localhost:8081/#/demo/list

 5、工作流：
       文件代码路径：src/app/workflow
                  src/app/business/home.vue
                  src/app/business/home.js
      
       页面显示路径：http://localhost:8081/#/demo/home
