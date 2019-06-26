<template>
  <div>
     <myHeader title="找回密码"/>

    <div class="enter_password from_top">   
      <div class="password">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_psd.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请输入密码" type="password" v-model="password"/></div>
      </div>
      <div class="sed_password">
        <div class="col-xs-1"> <img :src="httpUrl+'/modal/login_psd.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请再次输入密码" type="password" v-model="surePassword" /></div>
      </div>
      <button class="enterBtn" @click="doSubmit()">
        确定
      </button>
     
    </div>     
  </div> 
</template>

<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      password: "",
      surePassword: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    doSubmit() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/auth/findPassword?platform=weixin&version=1000",
          qs.stringify({
            phone: _this.$route.query.phone,
            password: _this.password,
            ensure_password: _this.surePassword,
            salt: _this.$route.query.code
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.push({
                path: "/login"
              });
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      // this.$router.push({
      //   path: "/login"
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>






