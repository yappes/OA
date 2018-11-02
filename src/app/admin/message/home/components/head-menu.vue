<template>
  <div class="message-top">
    <aui-row>
      <aui-col :span="6">
        <div class="message-header">
          <p class="message-header-title">我的公告</p>
          <p class="message-header-content">{{announcementNum}}个公告</p>
        </div>
      </aui-col>
      <aui-col :span="6">
        <div class="message-header">
          <p class="message-header-title">我的通知</p>
          <p class="message-header-content">{{notifyNum}}个通知</p>
        </div>
      </aui-col>
      <aui-col :span="6">
        <div class="message-header">
          <p class="message-header-title">我的提醒</p>
          <p class="message-header-content">{{tipNum}}个提醒</p>
        </div>
      </aui-col>
      <aui-col :span="6">
        <div class="message-header" style="border-right:none;">
          <p class="message-header-title">我的私信</p>
          <p class="message-header-content">{{letterNum}}条私信</p>
        </div>
      </aui-col>
    </aui-row>
  </div>
</template>

<script>
import noteService from '../../service/note-service'
import tipService from '../../service/tip-service'
import letterService from '../../service/letter-service'
export default {
  props: {
    flush: {
      type: Object,
      // default: () => {
      //   return {
      //     type: undefined,
      //     reload: false,
      //   }
      // }
    }
  },
  data() {
    return {
      noread: {
        announcement: [],
        notify: [],
        tip: [],
        letter: [],
      },
    }
  },
  computed: {
    notifyNum() {
      return this.noread.notify.length
    },
    announcementNum() {
      return this.noread.announcement.length
    },
    tipNum() {
      return this.noread.tip.length
    },
    letterNum() {
      return this.noread.letter.length
    },
  },
  watch: {
    'flush.reload'(val) {
      if(val) {
        console.log('检测到flush.reload', val)
        let type = this.flush.type
        this.loadData(type)
      }
    }
  },
  methods: {
    loadData(type) {
      let gua = {
        ANNOUNCEMENT: this.announcement,
        NOTIFY: this.notify,
        TIP: this.tip,
        LETTER: this.letter,
      }
      let handler = gua[type]
      if(!handler) {
        return 
      }
      // console.log('loadData flush', type)
      handler().then(() => {
        this.$set(this.flush, 'reload', false)
      }).catch(() => {
        this.$set(this.flush, 'reload', false)
        throw err(`刷新 ${type} 失败`)
      })
    },
    announcement() {
      return noteService.findRecieveAll({
        type: 'ANNOUNCEMENT',
        status: 'NOREAD',
      }).then(res => {
        console.log('ANNOUNCEMENT', res)
        this.noread.announcement = this.noreadhendler(res)
      })
    },
    notify() {
      // console.log('guaga')
      return noteService.findRecieveAll({
        type: 'NOTIFY',
        status: 'NOREAD',
      }).then(res => {
        console.log('NOTIFY', res)
        this.noread.notify = this.noreadhendler(res)
      })
    },
    tip() {
      return tipService.findAll({
        status: "NOREAD",
      }).then(res => {
        console.log('tip', res)
        this.noread.tip = this.noreadhendler(res)
      })
    },
    letter() {
      return letterService.findAll({
        status: "NOREAD",
      }).then(res => {
        console.log('letter', res)
        this.noread.letter = this.noreadhendler(res)
      })
    },
    //TODO:拿到的数据就只有已读的，可以删掉此步
    noreadhendler(items) {
      return items.filter(item => {
        return item.status === 'NOREAD'
      })
    }
  },
  mounted() {
    this.announcement()
    this.notify()
    this.tip()
    this.letter()
  },

}
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


