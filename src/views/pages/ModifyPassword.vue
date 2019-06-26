<template>
    <div class="ModifyPassword">
      <div class="noticebody">
        <myHeader title="修改密码" @click="goback"/>
      </div>
      <div class="change_content from_top">
        <span>旧密码:</span>
        <input type="password" placeholder="请输入您的原密码" v-model="oldPassword">
      </div>
      <div class="change_content">
        <span>新密码:</span>
        <input type="password" placeholder="请输入您的新密码" v-model="newPassword">
      </div>
      <div class="change_content">
        <span>确认密码:</span>
        <input type="password" placeholder="请确认您的新密码" v-model="ensurePassword">
      </div>
      <div class="keep">
        <button @click="doSure">确定</button>
      </div>
    </div>
</template>

<style scoped>
@import '../../style/common/css/type.css';
</style>

<script>
import myHeader from "@/components/Header";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      oldPassword: "",
      newPassword: "",
      ensurePassword: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    doSure() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/auth/updatePassword?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            password: _this.newPassword,
            ensure_password: _this.ensurePassword,
            older_password: _this.oldPassword
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          window.localStorage.removeItem("token");
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.push({
                path: "login"
              });
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goback() {
      this.$router.push({
        path: "UserIndex"
      });
    }
  }
};
</script>
