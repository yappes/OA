<template>
  <div class="pui-form-layout" style="width: 100%">
    <aui-form :model="formModel" :rules="rules" ref="form">
      <pui-col class="pui-form-layout__items">
        <aui-form-item class="pui-form-layout__form-item" label="流程标题" prop="title" :status-icon="false" label-width="160px">
          <aui-input class="pui-form-item__content" v-model="formModel.title" placeholder="请输入流程标题"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col class="pui-form-layout__items">
        <aui-form-item class="pui-form-layout__form-item" label="所属工作组" prop="groupId" :status-icon="false" label-width="160px">
          <aui-select v-model="formModel.groupId" placeholder="请选择工作组" :disabled="type === 'edit'">
            <aui-option v-for="item in workGroup" :key="item.groupId" :label="item.label" :value="item.groupId"></aui-option>
          </aui-select>
        </aui-form-item>
      </pui-col>
      <pui-col class="pui-form-layout__items">
        <aui-form-item class="pui-form-layout__form-item" label="重要等级" prop="level" :status-icon="false" label-width="160px">
          <aui-select v-model="formModel.level" placeholder="请选择重要等级" :disabled="type === 'edit'">
            <aui-option v-for="item in levelData" :key="item.level" :label="item.label" :value="item.level"></aui-option>
          </aui-select>
        </aui-form-item>
      </pui-col>
    </aui-form>
  </div>
</template>

<script>
import { workflowAuthService } from "paas-web-utils/services";
export default {
  name: "workflowForm",
  data() {
    return {
      workGroup: [],
      formModel: {
        title: undefined,
        groupId: undefined,
        level: undefined
      },
      rules: {
        title: [{ required: true, message: "流程标题不能为空" }]
      }
    };
  },
  computed: {
    type() {
      return this.query.type;
    },
    query() {
      return this.$route.query;
    },
    levelData() {
      return [
        {
          label: "普通",
          level: "GENERAL"
        },
        {
          label: "重要",
          level: "MAJOR"
        },
        {
          label: "紧急",
          level: "URGENT"
        }
      ];
    }
  },
  mounted() {
    this.getWorkGroup();
    if (this.type == "edit") {
      this.formModel.title = this.query.title;
      this.formModel.level = this.query.level;
      this.formModel.groupId = this.query.groupId;
    }
  },
  methods: {
    getWorkGroup() {
      workflowAuthService.findGroupsByUserId().then(data => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({});
          arr[i].label = data[i].groupName;
          arr[i].groupId = data[i].groupId;
        }
        this.workGroup = arr;
      });
    },
    getSubimt() {
      return this.formModel;
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(function(bool, msg) {
          if (bool) {
            resolve(bool);
          } else {
            reject(msg);
          }
        });
      });
    }
  }
};
</script>
