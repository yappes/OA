<template>
  <div class="pui-user-ctrl">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" width="40%" :visible="isVisible" @hide="handleClose">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="120px" class="pui-user-ctrl__form">
        <pui-col>
          <aui-form-item label="用户账号" prop="accountId">
            <aui-input v-model="reqData.accountId" placeholder="请输入用户账号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="真实姓名" prop="realName">
            <aui-input v-model="reqData.realName" placeholder="请输入姓名"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="手机号" prop="mobile">
            <aui-input v-model="reqData.mobile" placeholder="请输入手机号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="性别" prop="sex">
            <aui-radio-group v-model="reqData.sex">
              <aui-radio :label="1">男</aui-radio>
              <aui-radio :label="0">女</aui-radio>
            </aui-radio-group>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="邮箱" prop="email">
            <aui-input v-model="reqData.email" placeholder="请输入邮箱"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="组织名称" prop="orgCode">
            <pui-dept-selection v-model="reqData.orgCode"></pui-dept-selection>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="上级领导">
            <pui-user-selection v-model="reqData.superiorLeader" :multiple="false"></pui-user-selection>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="角色" prop="roleIds">
            <aui-select v-model="reqData.roleIds" placeholder="请选择" multiple @remove-tag="removeTag">
              <aui-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
              </aui-option>
            </aui-select>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="是否为管理员" prop="isAdmin">
            <aui-radio-group v-model="reqData.isAdmin">
              <aui-radio :label="1">是</aui-radio>
              <aui-radio :label="0">否</aui-radio>
            </aui-radio-group>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="隐藏数据查看" prop="shdEnable">
            <aui-radio-group v-model="reqData.shdEnable">
              <aui-radio :label="1">启用</aui-radio>
              <aui-radio :label="0">禁用</aui-radio>
            </aui-radio-group>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="状态" prop="status">
            <aui-radio-group v-model="reqData.status">
              <aui-radio :label="1">启用</aui-radio>
              <aui-radio :label="0">禁用</aui-radio>
            </aui-radio-group>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="固定电话">
            <aui-input v-model="reqData.telephone" placeholder="请输入固定电话"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="分机号">
            <aui-input v-model="reqData.extCode" placeholder="请输入分机号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="地址">
            <aui-input v-model="reqData.address" placeholder="请输入地址"></aui-input>
          </aui-form-item>
        </pui-col>

        <pui-col>
          <aui-form-item label="QQ">
            <aui-input v-model="reqData.qqId" placeholder="请输入QQ号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="微信">
            <aui-input v-model="reqData.wechatId" placeholder="请输入微信账号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="微博">
            <aui-input v-model="reqData.weiboId" placeholder="请输入微博账号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="描述">
            <aui-input v-model="reqData.userDesc" type="textarea" placeholder="请描述"></aui-input>
          </aui-form-item>
        </pui-col>
      </aui-form>
      <span slot="footer" class="dialog-footer">
        <aui-button :plain="true" @click="handleClose">取消</aui-button>
        <aui-button type="primary" @click="addUser('form')">确定</aui-button>
      </span>
    </aui-dialog>
  </div>
</template>
<script>
import { userService } from "paas-web-utils/services";
export default {
  name: "UserAdd",
  data() {
    //用户账号唯一性验证
    var checkAccountId = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户账户"));
      } else {
        var myreg = /^[a-zA-Z0-9]{3,9}$/;
        if (!myreg.test(value)) {
          callback(new Error("用户账户格式错误"));
        } else {
          let params = {
            accountId: value,
            id: null
          };
          userService.checkAccountId(params).then(data => {
            if (data) {
              callback();
            } else {
              callback(new Error("用户账户已存在"));
            }
          });
        }
      }
    };
    //手机号正则验证
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      }
    };
    //邮箱正则验证
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      } else {
        var myreg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!myreg.test(value)) {
          callback(new Error("请输入正确邮箱"));
        } else {
          callback();
        }
      }
    };
    return {
      reqData: {
        realName: "",
        accountId: "",
        sex: 1,
        mobile: "",
        telephone: "",
        extCode: "",
        address: "",
        email: "",
        qqId: "",
        wechatId: "",
        weiboId: "",
        roleIds: [],
        isAdmin: 0,
        shdEnable: 0,
        status: 1,
        orgId: null,
        orgCode: "",
        superiorLeader: null,
        userDesc: ""
      },
      roles: null,
      rules: {
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { min: 2, message: "至少2个字符", trigger: "blur" }
        ],
        accountId: [
          { required: true, validator: checkAccountId, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        orgCode: [
          { required: true, message: "请选择组织名称", trigger: "change" }
        ],
        isAdmin: [{ required: true, message: "请选择", trigger: "change" }],
        shdEnable: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
      },
      dialogTitle: "添加成员"
    };
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    removeTag() {},
    //查询角色信息
    findRoles() {
      let params = { roleIds: "" };
      userService.findRoles(params).then(data => {
        this.roles = data;
      });
    },
    //保存用户信息
    addUser(formName) {
      let form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          let params = {
            superiorLeader: this.reqData.superiorLeader,
            orgId: null,
            orgCode: this.reqData.orgCode,
            email: this.reqData.email,
            address: this.reqData.address,
            sex: this.reqData.sex,
            mobile: this.reqData.mobile,
            telephone: this.reqData.telephone,
            userDesc: this.reqData.userDesc,
            isAdmin: this.reqData.isAdmin,
            qqId: this.reqData.qqId,
            headPhoto: null,
            accountId: this.reqData.accountId,
            realName: this.reqData.realName,
            roleIds: this.reqData.roleIds.toString(),
            extCode: this.reqData.extCode,
            shdEnable: this.reqData.shdEnable,
            weiboId: this.reqData.weiboId,
            wechatId: this.reqData.wechatId,
            job: null,
            status: this.reqData.status
          };
          userService.addUser(params).then(data => {
            console.log("新增成功");
            this.$emit("initView");
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    },
    //取消 关闭对话框
    handleClose() {
      this.$emit("closeDialog");
      this.$refs.form.resetFields();
    }
  },
  created() {
    this.findRoles();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>


