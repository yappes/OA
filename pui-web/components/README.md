#规范

- 一、组件vue文件内命名要加pui啊！！！
- 二、组件vue及文件夹名称要求一致且命名采用首字母小写后续单词首字母大写的驼峰命名法
- 三、为了方便查看请添加组件声明的数组里的组件名需要按照组件名拼音顺序插入
- 四、scss变量命名规则：$--组件名-颜色字体宽高等css属性名依次用“-”拼接
- 五、为了阅读清晰，请遵循以下格式化规范：
  + 缩进规范 请使用2个空格的长度;
  + 冒号后面跟一个空格；
  + 每个class大括号后面空一行。

#关于如何实现css

高效率写csstip

- 尽量避免使用世袭的选择器（如：.sidebar h3）
- 样式层级尽量低于4级
- 避免使用IDs作为样式钩子
- 避免在样式表中把classes附加到元素上（如：div.header或者h1.title）
- 除非少数情况下避免使用!important吧
- 因为该项目兼容要求是ie10+ 和现代浏览器，所以尽量避免使用flexbox做布局；后续会添加自动添加浏览器前缀插件所以源码里可以不要浏览器前缀。

还有每次写样式要记得考虑你的实现方式是否符合兼容要求，如有疑问可到[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS)或者[caniuse](https://caniuse.com/)查询各浏览器厂商兼容情况
## 关于css命名
使用 BEM 命名规范，理论上讲，每行 css 代码都只有一个选择器。

BEM代表 “块（block）,元素（element）,修饰符（modifier）”,我们常用这三个实体开发组件。

在选择器中，由以下三种符合来表示扩展的关系：

-中划线 ：仅作为连字符使用，表示某个块或者某个子元素的多单词之间的连接记号。

__双下划线：双下划线用来连接块和块的子元素

_单下划线：单下划线用来描述一个块或者块的子元素的一种状态

type-block__element_modifier
具体含义请戳[链接](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)

scss的编写规范:

- @include b(组件名)
- @include e(元素名)
- @include m(修饰名)
- @include when(状态名)

其中前缀pui，组件名，元素名（模块名约定的box、wrapper为常用的，wrapper包含box，box包含具体module），例子请参考aui的dialog组件。
##样式文件介绍
/theme
- /common
 + animate.scss——组件中常用的动画
 + inituseragent.scss——初始化各个浏览器客户端以期表现一致
 + var.scss——pui组件的相关变量
- /mixins
 + config.scss——BEM命名法的配置文件， 此文件只能看不能动哦！
 + function.scss——支持BEM的sass方法
 + mixns.scss——支持BEM的一些混合
 + utils.scss——可以在这里添加一些常用的工具样式
- animate.css—— 第三方的动画库，如有动画需求可从此库参考但不要修改此库，如新增修改请去common文件夹下的animate.scss，具体demo请戳[官网链接](https://daneden.github.io/animate.css/)
- icon.scss——pui组件的icon字体
- icon.html——需要查找的icon的样式名称请在浏览器打开此文件


###已写页面样式的路径：
 1、鼠标滑过右上角消息出现的提示内容：
       文件路径：pui-web/components/message

 2、消息列表页面：
        路径：src/app/business/infoCenterPage.vue；
             src/app/business/infoCenterPage.js

 3、消息详情页面：
        路径：src/app/business/infoDetailPage.vue
             pui-web/components/messageDetail

 4、高级搜索，高级查询，快捷菜单设置，人员选择，设置按钮  的dialog弹窗：
        路径：pui-web/components/listGrid

 5、工作流：
       路径：src/workflow

 