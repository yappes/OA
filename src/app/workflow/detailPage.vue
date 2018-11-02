<template>
  <div slot="main">
    <div class="pui-detailPage__header-wrapper">
      <pui-btns-top slot="topBar" ref="btnsTop" back is-watch-scroll></pui-btns-top>
      <div class="pui-detailPage__title">
        <i class="pui-icon-xiangqing1"></i>{{view.title}}
      </div>
    </div>
    <template v-for="group in view.groups">
      <pui-catalog-module :is-detail="true" :key="group.id" :model="group"></pui-catalog-module>
    </template>
    <div v-if="this.this.$route.query.taskId">
      <aui-step align-center>
        <aui-step-item v-for="(item,index) in history" :key="index" :status="item.stepStatus">
          <template slot="description">
            <aui-tooltip class="item" effect="dark" :content="item.message.comment" placement="top-start">
              <div class="show">
                <p class="center">{{item.userName}}</p>
                <p class="center">{{item.time}}</p>
              </div>
            </aui-tooltip>
          </template>
        </aui-step-item>
      </aui-step>
      <aui-form ref="passForm" :model="passForm" :rules="rules">
        <aui-form-item label="审批意见" prop=comment>
          <aui-input class="comment" v-model="passForm.comment" type='textarea' :autosize="{ minRows: 4}" style="width:60%;" placeholder="请输入内容"></aui-input>
        </aui-form-item>
      </aui-form>
      <span slot="footer" class="dialog-footer" style="margin-left:80px">
        <aui-button type="primary" @click="passProcess">通过</aui-button>
        <aui-button :plain="true" v-if="isShow" @click="dialogVisible=true">驳回</aui-button>
      </span>
      <!--驳回-->
      <aui-dialog title="请选择节点" :visible.sync="dialogVisible" :close-on-click-modal="false" style="width:100%;margin:0 auto">
        <aui-form>
          <aui-form-item label="节点:" prop='activityId' label-width="120px">
            <aui-select v-model="activityId" placeholder="请选择节点">
              <aui-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </aui-option>
            </aui-select>
          </aui-form-item>
        </aui-form>
        <span slot="footer" class="dialog-footer">
          <aui-button :plain="true" @click="dialogVisible=false">取 消</aui-button>
          <aui-button type="primary" @click="rejectProcess">确 定</aui-button>
        </span>
      </aui-dialog>
    </div>
  </div>

</template>

<script>
import {
  workflowTaskService,
  workflowProcessService
} from "paas-web-utils/services";
export default {
  props: {
    view: Object
  },
  data() {
    return {
      history: [],
      passForm: {
        comment: ""
      },
      isShow: "",
      rules: {
        comment: [
          { required: true, message: "请输入审批意见", trigger: "blur" }
        ]
      },
      activityId: "",
      dialogVisible: false,
      options: [],
      taskIds: []
    };
  },
  mounted() {
    if (this.$route.query.taskId) {
      workflowTaskService
        .isSignById({ taskId: this.$route.query.taskId })
        .then(data => {
          this.isShow = !data;
        });
      console.log("workflow-detailPage mounted");
      // 获取节点集合
      workflowProcessService
        .findRejectListByTaskId({
          taskId: this.$route.query.taskId
        })
        .then(data => {
          this.options = [];
          for (var i = 0; i < data.length; i++) {
            this.options.push({ label: data[i].name, value: data[i].id });
          }
        });
      workflowTaskService
        .findCommentsByTaskIdOrInstanceId({ taskId: this.$route.query.taskId })
        .then(data => {
          console.log("data", data);
          this.history = data;
          for (let i = 0; i < this.history.length; i++) {
            if (this.history[i].message.examineStatus == "NORMAL") {
              this.history[i].stepStatus = "finish";
            } else if (this.history[i].message.examineStatus == "FAIL") {
              this.history[i].stepStatus = "wait";
            } else if (this.history[i].message.examineStatus == "REJECT") {
              this.history[i].stepStatus = "error";
            } else {
              this.history[i].stepStatus = "process";
            }
            this.history[i].time = this.switchDate(this.history[i].time);
          }
        });
    }
  },
  methods: {
    change() {
      workflowTaskService
        .findCommentsByTaskIdOrInstanceId({ taskId: this.$route.query.taskId })
        .then(data => {
          console.log("data", data);
        });
    },
    // 驳回
    rejectProcess() {
      workflowProcessService
        .rejectTaskById({
          taskId: this.$route.query.taskId,
          activityId: this.activityId,
          comment: this.passForm.comment
        })
        .then(data => {
          this.$aui.message.show({
            message: "驳回成功",
            type: "success"
          });
          this.dialogVisible = false;
        });
    },
    // 通过
    passProcess() {
      this.taskIds = [];
      this.taskIds.push(this.$route.query.taskId);
      console.log(this.taskIds, this.comment);
      workflowProcessService
        .completeTasksByIds({
          taskIds: this.taskIds,
          comment: this.passForm.comment
        })
        .then(data => {
          this.$aui.message.show({
            message: "审核通过",
            type: "success"
          });
          this.agreeDialog = false;
          this.getAllTableData();
        });
    },
    switchDate(date) {
      if (date == null) {
        return;
      }
      let myDate = new Date(date);
      let year = myDate.getFullYear();
      let month = myDate.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = myDate.getDate();
      day = day < 10 ? "0" + day : day;
      let hours = myDate.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = myDate.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let seconds = myDate.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let newDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return newDate;
    }
  }
};
</script>
<style lang='scss'>
@import "~theme/common/var";
@import "~theme/mixins/utils";

.pui-detailPage__header-wrapper {
  @include utils-clearfix;
}

.pui-detailPage__title {
  float: left;
  font-size: $--font-size-largest;
  color: $--color-primary;
  font-weight: $--font-weight-primary;
  .pui-icon-xiangqing1 {
    font-size: inherit;
    font-weight: inherit;
    margin-right: 7px;
  }

  .data {
    width: 100%;
    height: 400px;
  }

  .history {
    margin: 80px;
    width: 60%;
  }
  .show {
    position: relative;
    left: -32px;
    display: block;
    margin: auto 0;
    /* display: block;
  width: 30px; */
  }
  .ability {
    position: relative;
    left: 80px;
  }
}
</style>
