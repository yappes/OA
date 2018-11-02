<template>
    <div class="pui-message">
        <dl class="pui-message__group">
            <!-- <dt>您有{{messageCount}}条信息</dt> -->
            <dt>
                <aui-tabs v-model="activeName" @tab-click="handleClick">
                    <aui-tab-pane label="公告" name="NOTIFY"></aui-tab-pane>
                    <aui-tab-pane label="通知" name="ANNOUNCEMENT"></aui-tab-pane>
                    <aui-tab-pane label="提醒" name="TIP"></aui-tab-pane>
                    <aui-tab-pane label="私信" name="LETTER"></aui-tab-pane>
                </aui-tabs>
            </dt>
            <template v-if='messageData'>
              <dd v-for="(item, index) in messageData[activeName]" :key="item.id + activeName + index">
                <div class="pui-message__item">
                  <i class="aui-icon-share"></i>
                  <span class="pui-message__content1">{{item.content}}</span>
                </div>
              </dd>
              <dd @click="toHome">查看更多</dd>
            </template>
        </dl>

    </div>
</template>
<script>
import data from "./data.ts";
import noteService from '../../../../src/app/admin/message/service/note-service.js'
import tipService from '../../../../src/app/admin/message/service/tip-service.js'
import letterService from '../../../../src/app/admin/message/service/letter-service.js'
export default {
  name: "PuiMessage",
  data() {
    return {
      // messageList: [],
      activeName: "NOTIFY",
      // message: undefined,
    }
  },
  methods:{
    toHome(){
      this.$router.push('/message/home')
    },
    handleClick(tab){
    },
    //查询应用内通知公告Top5的信息集合（收到的）
    findNotifyOrAnnouncement(type) {
      return noteService.findRecieveTop5({
        type,
        status: 'NOREAD',
      }).then(data => {
        // console.log('findRecieveTop5', type, data)
        let messageList = data.map(item => {
          return item.agreeMessage
        })
        return Promise.resolve(messageList)
      })
    },
    //查询所有提醒
    findAllTip() {
      return tipService.findAll().then(data => {
        // console.log('tipService.findAll', data)
        let messageList = this.top_5(data)
        return Promise.resolve(messageList)
      })
    },
    //查询未读的私信
    findAllLetter() {
      return letterService.findAll({
        status: 'NOREAD',
      }).then(data => {
        // console.log('letterService.findAll', data)
        let messageList = this.top_5(data)
        return Promise.resolve(messageList)
      })
    },
    findAll(type) {
      let promises = [this.findNotifyOrAnnouncement('NOTIFY'), this.findNotifyOrAnnouncement('ANNOUNCEMENT'), this.findAllTip(), this.findAllLetter()]
      Promise.all(promises).then(datas => {
        let messageData = {
          NOTIFY: datas[0],
          ANNOUNCEMENT: datas[1],
          TIP: datas[2],
          LETTER: datas[3],
        }
        //将消息数据存储到vuex
        // this.$store.commit('messageTop/change', messageData)
      })
    },
    //截取前5条显示
    top_5(items) {
      return items.filter((item, index) => {
        return index < 5
      })
    }
  },
  computed: {
    //从vuex获取数据,数据再app.vue的mounted中调用接口获取
    //methods中的调用接口方法并没有使用
    messageData() {
      return this.$store.state.messageTop.message
    }
  },
  mounted() {
    // //vuex获取的数据无效时，再调用接口
    // if(!this.messageData) {
    //   // this.findAll(this.activeName)
    // }
  }
};
</script>

<style  lang="scss" scoped>
@import "./message.scss";
.pui-message__group /deep/ {
    .aui-tabs__nav-wrap{
        padding-left: 10px
    }
}

</style>

