<template>
  <div class="pui-form-layout" style="width: 100%">
    <aui-form :model="formModel" :rules="rules" ref="form">
      <pui-col class="pui-form-layout__items" :full="true" v-show="taskId">
        <aui-form-item class="pui-form-layout__form-item" label="审批意见" prop="comment" :status-icon="false" label-width="160px">
          <aui-input class="pui-form-item__content" v-model="formModel.comment" type='textarea' :autosize="{ minRows: 4}" style="width:60%;" placeholder="请输入内容"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col class="pui-form-layout__items" :full="true" v-show="taskId">
        <aui-form-item class="pui-form-layout__form-item" label="是否通过" prop="isAgree" :status-icon="false" label-width="160px">
          <aui-radio v-model="formModel.isAgree" :label="true">通过</aui-radio>
          <aui-radio v-model="formModel.isAgree" :label="false">不通过</aui-radio>
        </aui-form-item>
      </pui-col>
      <pui-col class="pui-form-layout__items" v-show="!formModel.isAgree && !isSign">
        <aui-form-item class="pui-form-layout__form-item" label="驳回位置" prop="activityId" :status-icon="false" label-width="160px">
          <aui-select v-model="formModel.activityId" placeholder="请选择驳回位置">
            <aui-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
      </pui-col>
      <pui-col class="pui-form-layout__items" :full="true" v-show="taskId">
        <aui-form-item style="text-align: center">
          <aui-button type="primary" @click="agree">提交</aui-button>
        </aui-form-item>
      </pui-col>
    </aui-form>
    <pui-col class="pui-form-layout__items" :full="true" v-show="taskId && history.length > 0">
      <hr>
    </pui-col>
    <pui-col class="pui-form-layout__items" v-if="history.length > 0" :full="true">
      <div style="margin: 0 20px;">
        <aui-step align-center>
          <aui-step-item v-for="(item,index) in history" :key="index" :status="item.stepStatus" :description="item.time">
            <template slot="title">
              <aui-tooltip class="item" effect="dark" :content="item.message.comment" placement="top-start">
                <span class="show">
                  {{item.userName}}
                </span>
              </aui-tooltip>
            </template>
          </aui-step-item>
        </aui-step>
      </div>
    </pui-col>
  </div>
</template>

<script>
import {
  workflowTaskService,
  workflowProcessService
} from "paas-web-utils/services";
export default {
  name: "workflowDetail",
  data() {
    return {
      formModel: {
        comment: "",
        activityId: "",
        isAgree: true
      },
      history: [],
      rules: {
        comment: [
          { required: true, message: "请输入审批意见", trigger: "blur" }
        ]
      },
      options: [],
      taskIds: [],
      isSign: false
    };
  },
  computed: {
    taskId() {
      return this.$route.query.taskId;
    },
    processInstanceId() {
      return this.$route.query.processInstanceId;
    }
  },
  mounted() {
    this.initSorkflowStep();
  },
  methods: {
    initSorkflowStep() {
      if (this.taskId) {
        workflowTaskService.isSignById({ taskId: this.taskId }).then(data => {
          this.isSign = data;
        });
        // 获取流程可驳回的节点集合
        workflowProcessService
          .findRejectListByTaskId({
            taskId: this.taskId
          })
          .then(data => {
            this.options = [];
            for (var i = 0; i < data.length; i++) {
              this.options.push({ label: data[i].name, value: data[i].id });
            }
          });
      }
      workflowTaskService
        .findCommentsByTaskIdOrInstanceId({
          taskId: this.taskId,
          instanceId: this.processInstanceId
        })
        .then(data => {
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
            this.history[i].time = switchDate(this.history[i].time);
          }
        });
    },
    // 通过
    agree() {
      if (!this.formModel.isAgree && !this.isSign) {
        this.notAgree();
      }
      this.taskIds = [];
      this.taskIds.push(this.$route.query.taskId);
      let params = {
        taskIds: this.taskIds,
        comment: this.formModel.comment
      };
      if (this.isSign && !this.formModel.isAgree) {
        params.variables = {
          examineStatus: "FAIL"
        };
      }
      workflowProcessService.completeTasksByIds(params).then(data => {
        this.$aui.message.show({
          message: "审核通过",
          type: "success"
        });
        this.$router.back();
      });
    },
    // 驳回
    notAgree() {
      workflowProcessService
        .rejectTaskById({
          taskId: this.$route.query.taskId,
          activityId: this.formModel.activityId,
          comment: this.formModel.comment
        })
        .then(data => {
          this.$aui.message.show({
            message: "驳回成功",
            type: "success"
          });
          this.$router.back();
        });
    }
  }
};

const switchDate = function(date) {
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
};
</script>

