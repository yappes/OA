<template>
  <div class="pui-user-ctrl">
    <aui-dialog :close-on-click-modal="false" :title="dialogTitle" width="40%" :visible="isVisible" @hide="handleClose">
      <aui-form :model="reqData" :rules="rules" ref="form" label-width="120px" class="pui-user-ctrl__form">
        <pui-col>
          <aui-form-item label="用户账号" prop="accountId">
            <aui-input v-model="reqData.accountId" disabled></aui-input>
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
            <pui-dept-selection v-model="reqData.orgCode" placeholder="请输入组织名称"></pui-dept-selection>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="上级领导">
            <pui-user-selection v-model="reqData.superiorLeader" :multiple="false"></pui-user-selection>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="角色" prop="roleIds">
            <aui-select v-model="reqData.roleIds" placeholder="请选择" multiple>
              <aui-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
              </aui-option>
            </aui-select>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="是否为管理员" prop="isAdmin">
            <aui-radio-group v-model="reqData.isAdmin">
              <aui-radio :label="0">否</aui-radio>
              <aui-radio :label="1">是</aui-radio>
            </aui-radio-group>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="隐藏数据查看" prop="shdEnable">
            <aui-radio-group v-model="reqData.shdEnable">
              <aui-radio :label="0">禁用</aui-radio>
              <aui-radio :label="1">启用</aui-radio>
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
            <aui-input v-model="reqData.wechatId" placeholder="请输入微信号"></aui-input>
          </aui-form-item>
        </pui-col>
        <pui-col>
          <aui-form-item label="微博">
            <aui-input v-model="reqData.weiboId" placeholder="请输入微博号"></aui-input>
          </aui-form-item>
        </pui-col>

        <pui-col>
          <aui-form-item label="描述">
            <aui-input v-model="reqData.userDesc" type="textarea" placeholder="请输入模块描述"></aui-input>
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
  name: "UserEdit",
  data() {
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
        sex: "",
        mobile: "",
        telephone: "",
        extCode: "",
        address: "",
        email: "",
        qqId: "",
        wechatId: "",
        weiboId: "",
        roleIds: [],
        isAdmin: "",
        shdEnable: "",
        status: "",
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
      dialogTitle: "编辑用户信息",
      ActiveUserInfo: null
    };
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object
    }
  },
  methods: {
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
            id: this.ActiveUserInfo.id,
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
          userService.editUser(params).then(data => {
            console.log("编辑成功");
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
    },
    //获取当前编辑的用户信息
    getUserInfo() {
      this.dialogTitle = "编辑用户信息";
      this.ActiveUserInfo = this.editRow;
      let params = {
        accountId: this.ActiveUserInfo.accountId,
        userId: this.ActiveUserInfo.userId,
        userCode: this.ActiveUserInfo.userCode,
        extCode: this.ActiveUserInfo.extCode
      };
      userService.userDetail(params).then(data => {
        console.log(data)
        this.reqData.realName = data.realName;
        this.reqData.accountId = data.accountId;
        this.reqData.sex = data.sex;
        this.reqData.mobile = data.mobile;
        this.reqData.telephone = data.telephone;
        this.reqData.extCode = data.extCode;
        this.reqData.address = data.address;
        this.reqData.email = data.email;
        this.reqData.qqId = data.qqId;
        this.reqData.wechatId = data.wechatId;
        this.reqData.weiboId = data.weiboId;
        if(data.roleIds){
          let roleIdsArr = data.roleIds.split(",");
          this.reqData.roleIds = roleIdsArr.map(function(data) {
            return +data;
          });
          this.reqData.roleIds.forEach((v, k) => {
            if (v == 0) {
              this.reqData.roleIds.splice(k, 1);
            }
          });
        }else{
          this.reqData.roleIds = [];
        }
        if(data.isAdmin){
          this.reqData.isAdmin = data.isAdmin;
        }else{
          this.reqData.isAdmin = 0;
        }
        this.reqData.shdEnable = data.shdEnable;
        this.reqData.status = data.status;
        this.reqData.orgId = data.orgId;
        this.reqData.orgCode = data.orgCode;
        this.reqData.superiorLeader = data.superiorLeader;
        this.reqData.userDesc = data.userDesc;
        console.log(this.reqData);
      });
    }
  },
  created() {
    this.getUserInfo();
    this.findRoles();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
// .pui-department-add {
//   .formStyle {
//     width: 100%;
//     display: flex;
//     .aui-form-item {
//       width: 50%;
//     }
//   }
// }
</style>


