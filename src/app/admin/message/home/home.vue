<template>
  <div class="message-box">
    <pui-container>
      <pui-header>
        <pui-nav-top></pui-nav-top>
      </pui-header>
    </pui-container>
    <div class="content" :style="{minHeight:minHeight}">
      <div class="message-content" :style="{minHeight:minHeight1}">
        <head-menu :flush='flush'></head-menu>
        <div class="message-bottom" :style={minHeight:minHeight}>
          <div class="message-menu-box">
            <div class="message-title">消息列表</div>
            <div class="message-menu">
              <aui-radio-group size="small" type="card" v-model="tabPosition" style="display:inline-block;margin-right:30px;">
                <!-- <aui-radio-button label="top" name="first">全部</aui-radio-button> -->
                <aui-radio-button label="ANNOUNCEMENT" name="公告">公告</aui-radio-button>
                <aui-radio-button label="NOTIFY" name="通知">通知</aui-radio-button>
                <aui-radio-button label="TIP" name="提醒">提醒</aui-radio-button>
                <aui-radio-button label="LETTER" name="私信">私信</aui-radio-button>
              </aui-radio-group>
              <aui-input style="width:300px" size="small" placeholder="请输入标题" prefix-icon="aui-icon-search" v-model="title">
              </aui-input>
            </div>
          </div>
          <div class="button-group">
            <div class="btn-left">
              <aui-button type="primary" size="small" @click="announcementDialog=true">发公告/通知</aui-button>
              <aui-button type="primary" size="small" @click="privateDialog=true">发私信</aui-button>
            </div>
            <div class="btn-right">
              <aui-button type="primary" size="small" class="message-button">全部标记已读</aui-button>
              <aui-button type="primary" size="small" class="message-button">全部标记删除</aui-button>
            </div>
          </div>
          <table class="message-list">
            <tr v-for="item in messageTableData" :key="item.value">
              <td><i :class="item.icon" style="font-size:30px;"></i></td>
              <td style="width:85%">
                <div class="message-list-inf">
                  <p class="message-list-title">{{item.title}}</p>
                  <p class="message-list-auth">{{item.auth}} {{dateFormat(item.time)}}</p>
                </div>
                <p class="message-list-content" v-html='item.content'></p>
              </td>
              <td style="width:100px">
                <span class="message-list-span" @click='readHandler(item)' v-if='item.status==="NOREAD"'>已读</span>
                <span class="message-list-span" @click='flushTable'>删除</span>
              </td>
            </tr>
          </table>
          <pagenation class='pagenation' style="margin:30px 0;"  @page='pageChange' :totalRecord='pageData.totalRecord' :currentPage='pageData.pageNow' :size='pageData.pageSize'></pagenation>
        </div>
      </div>
      <!-- 发公告弹框 -->
      <aui-dialog :show-full-icon="true" title="发公告/通知" :visible.sync="announcementDialog" :modal='true' :close-on-click-modal="false" width="40%">
        <add-notify :formModel='addNotifyModel' ref='addNotify'></add-notify>
        <div slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="announcementDialog=false">取 消</aui-button>
          <aui-button type="primary" @click="submitAdd('addNotify')">确 定</aui-button>
        </div>
      </aui-dialog>
      <!-- 发私信弹框 -->
      <aui-dialog :show-full-icon="true" title="发私信" :visible.sync="privateDialog" :modal='true' :close-on-click-modal="false" width="40%">
        <add-letter :formModel='addLetterModel' ref='addLetter'></add-letter>
        <div slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="privateDialog=false">取 消</aui-button>
          <aui-button type="primary" @click="submitAdd('addLetter')">确 定</aui-button>
        </div>
      </aui-dialog>
    </div>
  </div>
</template>
<script>
import announCement from "./announ-cement.vue";
import addNotify from './components/addNotify.vue'
import addLetter from './components/addLetter.vue'
import headMenu from './components/head-menu.vue'
import pagenation from './components/pagination/pagination'
import noteService from '../service/note-service'
import tipService from '../service/tip-service'
import letterService from '../service/letter-service'
import dateFormat from 'paas-web-utils/common/date'
export default {
  name: "home",
  components: { announCement, addNotify, addLetter, pagenation, headMenu },
  data() {
    return {
      form1: {
        title: "",
        radio: "1",
        content: ""
      },
      form2: {
        title: "",
        radio: "1",
        content: "",
        options: ""
      },
      totalRecord: 12,
      announcementDialog: false,
      privateDialog: false,
      minHeight: "",
      minHeight1: "",
      tabPosition: "ANNOUNCEMENT",
      title: "",
      pageData: {
        totalRecord: 0,
        pageNow: 1,
        pageSize: 10
      },
      messageTableData: [],
        // {
        //   icon:"pui-icon-gong",
        //   value: "1",
        //   title: "测试标题",
        //   auth: "吴某某",
        //   time: "2016-06-16 14:03",
        //   content:
        //     "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
        // },
      addNotifyModel: {
        subject: '',
        type: '',
        content: '',
        tipsType: '',
        senderType: '',
        toAddress: [],
        // toAddress: ['84'],
        attachment: '',
      },
      addLetterModel: {
        attachment: '',
        content: '',
        toAddress: '',
      },
      flush: {
        type: null,
        reload: false,
      },
      minHeight:""
    };
  },
  computed: {
    icon() {
      let type = {
        ANNOUNCEMENT: 'pui-icon-gong',
        NOTIFY: "pui-icon-iconfontcolor34",
        TIP: "pui-icon-jinggaofull",
        LETTER: "pui-icon-mail",
      }
      return type[this.tabPosition]
    }
  },
  mounted() {
    this.getHigt();
    console.log(this.minHeight);
    console.log("window.innerHeight", window.innerHeight);
    this.findAllInPage();
    this.high();
  },
  methods: {
    high() {
      this.minHeight = window.innerHeight - 48 -230 + "px" ;
    },
    dateFormat(timeStamp) {
      return dateFormat.format(timeStamp)
    },
    flushTable() {
      this.$set(this.flush, 'type', this.tabPosition)
      this.$set(this.flush, 'reload', true)
    },
    getHigt() {
      this.minHeight = window.innerHeight - 30 - 48 + "px";
      this.minHeight1 = window.innerHeight - 60 - 48 + "px";
    },
    sendAnnouncement() {
      this.$router.push("/message/sendAnnouncement");
    },
    sendPrivateMessages() {
      this.$router.push("/message/sendPrivateMessages");
    },
    handlePage(pageNow, pageSize, totalRecord) {
      this.pageData = {
        pageNow,
        pageSize,
        totalRecord,
      }
    },
    submitAdd(formName) {
      this.$refs[formName].validate().then(data => {
        if(formName === 'addNotify') {
          this.announcementDialog = false
          //TODO:新增通知/公告接口
          noteService.addNote(this.addNotifyModel).then(data => {
            console.log('新增通知/公告', data)
          })
        }else if(formName === 'addLetter') {
          this.privateDialog = false
          //TODO:新增私信接口
          // this.addLetterModel.createTime = new Date().getTime()
          // console.log(this.addLetterModel)
          letterService.addLetter(this.addLetterModel).then(data=> {
            console.log('新增私信', data)
          }) 
        }
      })
    },
    //查询分页信息
    findAllInPage() {
      let type = this.tabPosition
      if(type === 'ANNOUNCEMENT') {
        this.getNotifyOrAnnouncement('ANNOUNCEMENT')
      }else if (type === 'NOTIFY') {
        this.getNotifyOrAnnouncement('NOTIFY')
      }else if (type === 'TIP') {
        this.getTip()
      }else if (type === 'LETTER') {
        this.getLetter()
      }
    },
    //改变页码
    pageChange(data) {
      let type = data.type;
      this.pageData.pageSize = data.pageSize;
      if (type === "page") {
        this.pageData.pageNow = data.pageNow;
      } else if (type === "size") {
        this.pageData.pageNow = 1;
      }
      this.findAllInPage();
    },
    //获取通知/公告分页数据
    getNotifyOrAnnouncement(type) {
      if(type !== 'NOTIFY' && type !== 'ANNOUNCEMENT') {
        return 
      }
      noteService.findRecieveAllByPage({
        type,
        status: '',
        pageNow: this.pageData.pageNow,
        pageSize: this.pageData.pageSize,
      }).then(res => {
        let data = res.record
        if(!data) {
          this.messageTableData = []
          // this.pageData.totalRecord = 0
        } else{
          this.messageTableData = data.map(d => {
            let item = d.agreeMessage
            return {
              title: item.subject,
              auth: item.sender,
              attachment: item.attachment,
              time: d.createTime,
              content: item.content,
              status: d.status,
              id: item.id,
              icon: this.icon,
            }
          })
          this.handlePage(res.currentPage, res.pageSize, res.totalRecord)
        }
      })
    },
    //获取提醒分页数据
    getTip() {
      tipService.findAllByPage({
        pageNow: this.pageData.pageNow,
        pageSize: this.pageData.pageSize,
      }).then(res => {
        console.log('tip', res)
        this.pageData = {
          pageNow: res.currentPage,
          pageSize: res.pageSize,
          totalRecord: res.totalRecord,
        }
        //TODO:时间转换，通过id拿到用户名
        if(!res.record) {
          this.messageTableData = []
          return 
        }
        this.messageTableData = res.record.map(item => {
          return {
            title: item.subject,
            auth: item.sender,
            time: item.createTime,
            content: item.content,
            attachment: item.attachment,
            id: item.id,
            icon: this.icon,
          }
        })
        this.handlePage(res.currentPage, res.pageSize, res.totalRecord)
      })
    },
    //获取私信分页数据
    getLetter() {
      letterService.findAllByPage({
        pageNow: this.pageData.pageNow,
        pageSize: this.pageData.pageSize,
      }).then(res => {
        console.log('letter', res)
        let dataList = res.record
        if(!dataList) {
          this.messageTableData = []
          return 
        }
        this.messageTableData = dataList.map(item => {
          return {
            title: item.subject,
            auth: item.sender,
            attachment: item.attachment,
            time: item.createTime,
            content: item.content,
            status: item.status,
            id: item.id,
            icon: this.icon,
          }
        })
          this.handlePage(res.currentPage, res.pageSize, res.totalRecord)
      })
    },
    readHandler(row) {
      let id = row.id
      let type = {
        ANNOUNCEMENT: noteService.read,
        NOTIFY: noteService.read,
        TIP: tipService.read,
        LETTER: letterService.read,
      }
      let handler = type[this.tabPosition]
      handler({id}).then(data => {
        console.log('已读', this.tabPosition, data)
        if(data === true) {
          this.findAllInPage()
          this.flushTable()
        }
      })
    },
  },
  watch: {
    tabPosition(val) {
      this.pageData.pageNow = 1
      this.findAllInPage()
      this.flushTable()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
@import "~theme/icon";
.message-top {
  margin-bottom: 10px;
  background: #fff;
  padding: 30px 0;
}
.message-bottom{
  background: #fff;
  padding: 30px;
}
.content {
  background: #eef1f5;
  padding: 15px;
  .message-content {
    // padding-top: 30px;
    padding-bottom: 20px;
    height: 100%;
    // background: #fff;
    .message-header {
      text-align: center;
      border-right: 1px solid #ddd;
      box-sizing: content-box;
      .message-header-title {
        font-size: $--font-size-small;
        color: $--font-color-gray;
        margin: 0;
        cursor: pointer;
      }
    }
    .message-header-content {
      font-size: $--font-size-large;
      margin: 0;
      cursor: pointer;
    }
    .message-menu-box {
      // margin-top: 40px;
      overflow: hidden;
      .message-title {
        font-size: 14px;
        font-weight: bold;
        margin-left: 60px;
        position: relative;
        top: 30px;
      }
      .message-menu {
        float: right;
        margin-right: 70px;
      }
    }
    .button-group {
      margin-top: 20px;
      overflow: hidden;
      .btn-left {
        float: left;
        margin-left: 70px;
        border-radius: 1px;
      }
      .btn-right {
        float: right;
        margin-right: 70px;
        .message-button {
          background: #fff;
          color: #51c5be;
          border: 1px solid #ccc;
          border-radius: 1px;
          &:hover {
            background: #51c5be;
            color: #fff;
          }
        }
      }
    }
    .message-list {
      width: 90%;
      margin: 0 auto;
      table-layout: fixed;
      td {
        padding: 14px;
        border-bottom: 1px solid #ccc;
        .message-list-inf {
          overflow: hidden;
          .message-list-title {
            float: left;
            margin: 0;
            padding: 0;
            font-size: 16px;
          }
          .message-list-auth {
            float: right;
            margin: 0;
            padding: 0;
            color: #999;
          }
        }
        .message-list-content {
          margin: 0;
          padding: 0;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .message-list-span {
          color: #51c5be;
          cursor: pointer;
        }
      }
    }
  }
}
.aui-upload__tip {
  height: 15px;
  line-height: 15px;
}
.message-box /deep/{
  .pui-icon-xiaoxi{
    background: $--nav-quick-menu-color;
    color:black;
  }
}
</style>