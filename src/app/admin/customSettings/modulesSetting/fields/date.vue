<template>
  <div class="pui-admin-date">
    <aui-card class="pui-admin-date__statement-box-card">
      <div class="item">
        默认值当前时间的编码参数规范：
        <ul class="format-box">
          <li>$YY:年</li>
          <Li>$MN:月</Li>
          <li>$DD:日</li>
          <li>$HH:时</li>
          <li>$MM:分</li>
        </ul>
        <br/>如：$YY-$MN-$DD $HH:$MM 生成后为：2015-05-22 01:01
      </div>
    </aui-card>
    <aui-form :model="form" :rules="rules" :ref="formRefName" label-width="130px">
      <pui-col>
        <aui-form-item label="字段名称" prop="columnName">
          <aui-input v-model="form.columnName"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="字段编码" prop="columnCode">
          <aui-input v-model="form.columnCode"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col :minWidth="400">
        <aui-form-item label="显示位置" prop="displayPosition">
          <aui-checkbox-group v-model="form.displayPosition">
            <aui-checkbox label="1">列表</aui-checkbox>
            <aui-checkbox label="2">新增</aui-checkbox>
            <aui-checkbox label="3">修改</aui-checkbox>
            <aui-checkbox label="4">详情</aui-checkbox>
          </aui-checkbox-group>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="只读范围" prop="readonlyScope">
          <aui-checkbox-group v-model="form.readonlyScope">
            <aui-checkbox label="0">新增页面</aui-checkbox>
            <aui-checkbox label="1">编辑页面</aui-checkbox>
          </aui-checkbox-group>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="日期类型" prop="dateType">
          <aui-select v-model="form.dateType">
            <aui-option v-for="item in dateTypeOpt" :key="item.value" :label="item.label" :value="item.value">
            </aui-option>
          </aui-select>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="是否唯一" prop="isUnique">
          <aui-switch v-model="form.isUnique"></aui-switch>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" placeholder="请输入模块描述" v-model="form.description"></aui-input>
        </aui-form-item>
      </pui-col>
    </aui-form>
  </div>
</template>

<script>
  import config from './mixins.js'
  
  export default {
    name: "Date",
    data() {
      return {
        rules: {
          columnName: [{
              required: true,
              message: "请输入字段名称",
              trigger: "blur"
            },
            {
              min: 3,
              max: 15,
              message: "长度在 3 到 15 个字符",
              trigger: "blur"
            }
          ],
          columnCode: [{
              required: true,
              message: "请输入字段名称",
              trigger: "blur"
            },
            {
              min: 3,
              max: 15,
              message: "长度在 3 到 15 个字符",
              trigger: "blur"
            }
          ]
        },
        dateTypeOpt: [{
            label: "日期+时间",
            value: "DATETIME"
          },
          {
            label: "日期",
            value: "DATE"
          },
          {
            label: "时间",
            value: "TIME"
          },
          {
            label: "年",
            value: "YEAR"
          },
          {
            label: "月",
            value: "MONTH"
          }
        ],
        form: {
          moduleCode: "",
          columnName: "",
          columnCode: "",
          displayPosition: [],
          readonlyScope: [],
          colMark: "DATE",
          dateType: "",
          description: ""
        }
      };
    },
    mixins: [config],
    created: function() {
      this.addBusListener();
    }
  };
</script>

<style lang="scss" scoped>
  .pui-admin-date__statement {
    .pui-admin-date__statement-box-card {
      margin-bottom: 20px;
      .item {
        padding-left: 20px;
      }
      .format-box {
        padding-left: 20px;
        &>li {
          list-style-type: decimal;
        }
      }
    }
  }
</style>
