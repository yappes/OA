<template>
  <div class="pui-admin-auto-encode">
    <aui-card class="pui-admin-auto-encode__statement-box-card">
      <div class="item">自动编码编码参数规范：
        <ul class="format-box">
          <li>$YY:&nbsp;&nbsp;&nbsp;年</li>
          <li>$MN:&nbsp;&nbsp;&nbsp;月</li>
          <li>$DD:&nbsp;&nbsp;&nbsp;日</li>
          <li>$HH:&nbsp;&nbsp;&nbsp;时</li>
          <li>$MM:&nbsp;&nbsp;&nbsp;分</li>
          <li>$COL[字段物理编码code]: 物理字段编码（即真实字段名）</li>
          <li>$VLEN[长度]: 自动增长值编号长度 $VLEN[5]</li>
        </ul>
        <br>如：ME_$YY/$MN/$DD-$VLEN[4]&nbsp;&nbsp;生成后为：ME_2015/05/22-0001 带根据某个字段值，生成相应规则的自动编码：ME_$COL[s_type]_$YY/$MN/$DD-$VLEN[4]
        <br>注：除自动编码规范的参数外，其它字符则会被看成固定连接字符，如上面实例中的"ME_"、"/"、"-"
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
            <aui-checkbox label="1">查询</aui-checkbox>
            <aui-checkbox label="3">修改</aui-checkbox>
            <aui-checkbox label="4">详情</aui-checkbox>
          </aui-checkbox-group>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="编码格式" prop="codeFomatter">
          <aui-input v-model="form.codeFomatter"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="字段输入提示" prop="fieldIptPrompt">
          <aui-input v-model="form.fieldIptPrompt"></aui-input>
        </aui-form-item>
      </pui-col>
      <pui-col>
        <aui-form-item label="描述" prop="description">
          <aui-input type="textarea" :rows="2" v-model="form.description"></aui-input>
        </aui-form-item>
      </pui-col>
    </aui-form>
  </div>
</template>

<script>
import config from "./mixins.js";

export default {
  name: "AutoEncode",
  data() {
    return {
      rules: {
        columnName: [
          {
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
        columnCode: [
          {
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
        codeFomatter: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur"
          }
        ]
      },
      form: {
        columnType: "varchar",
        columnCode: "",
        columnName: "",
        displayPosition: [],
        showColVal: "",
        fieldIptPrompt: "",
        readonlyScope: [],
        colMark: "AUTOCODE",
        isRuleCode: "",
        codeFomatter: "", //todo自定义的“编码格式"属性 需要查问
        description: ""
      }
    };
  },
  mixins: [config],
  methods: {},
  created: function() {
    this.addBusListener();
  }
};
</script>

<style lang="scss" scoped>
.pui-admin-date__statement {
  .format-box {
    padding-left: 20px;
  }
  .pui-admin-auto-encode__statement-box-card {
    margin-bottom: 20px;
    .item {
      padding-left: 20px;
    }
  }
}
</style>
