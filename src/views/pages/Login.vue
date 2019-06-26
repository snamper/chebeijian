<template>
  <div>
    <div class="loginbody">
      <myHeader title="登录" />

      <div class="login">
        <div class="panel">
          <img class="home_logo" :src="httpUrl+'toplogo.png'">

          <div class="phone">
            <div class="col-xs-1">
              <img :src="httpUrl+'modal/login_name.png'">
            </div>
            <div class="col-xs-11">
              <input placeholder="请输入手机号" type="text" v-model="loginPhone">
            </div>
          </div>
          <div class="password">
            <div class="col-xs-1">
              <img :src="httpUrl+'modal/login_psd.png'">
            </div>
            <div class="col-xs-11">
              <input placeholder="请输入密码" type="password" v-model="loginPsd">
            </div>
          </div>
          <button class="loginBtn" @click="doLogin()">登录</button>
          <div class="login_find">
            <div class="findtext">
              <router-link to="/PasswordFind">忘记密码?</router-link>
            </div>
            <div class="register1 findtext">
              <router-link to="/Register">现在注册</router-link>
            </div>
          </div>
        </div>
        <!-- 第三方登录 -->
        <div class="login_foot">
          <p>第三方登录</p>
          <hr>

            <img :src="httpUrl+'modal/weixin.png'" @click="wxlogin()">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from "@/components/Header";
  import "../../style/common/css/modal.scss";
  import {
    Toast
  } from "vant";
  import axios from "axios";
  import qs from "qs";

  export default {
    components: {
      myHeader,
      [Toast.name]: Toast
    },
    data() {
      return {
        apihttpUrl: domain.testUrl,
        httpUrl: domain.iconUrl,
        loginPhone: "",
        loginPsd: "",
        biaoshi: ''
      };
    },
    creatd() {
      this.initdata();
    },
    methods: {
      initdata() {
        //测试阶段使用
        window.localStorage.removeItem("token");
         window.localStorage.removeItem("PHPREDISKEY");
        
      },
      wxlogin(){
        var _this = this;
        axios
          .get(_this.apihttpUrl + "api/public/generateUuid", {
            params: {
              platform: "weixin",
              version: "1000"
            }
          })
          .then(function (response) {
            if (response.data.errorCode === 0) {
              var biaoshi = response.data.data.uuid
              console.log(biaoshi)
              window.localStorage.setItem("PHPREDISKEY", response.data.data.uuid);

              window.location.href=_this.apihttpUrl + 'api/user/auth/wxlogin?platform=weixin&PHPREDISKEY='+biaoshi

            } else {
              Toast(response.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      doLogin() {
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/auth/accountLogin?platform=weixin&version=1000",
            qs.stringify({
              login_name: _this.loginPhone,
              password: _this.loginPsd,
              // login_captcha: 1111,
              role: 1
            })
          )
          .then(function (response) {
            Toast(response.data.message);
            if (response.data.errorCode == 0) {
              console.log(response.data.data.token);

              window.localStorage.setItem("token", response.data.data.token);

              // 登录成功后
              setTimeout(() => {
                if (
                  _this.$route.query.redirect == null ||
                  decodeURIComponent(_this.$route.query.redirect) === "/UserInfo/"
                ) {
                  // 若未定义重定向网址，则默认跳转到[我的]页面
                  _this.$router.push({
                    path: "/UserIndex"
                  });
                } else if (_this.$route.query.to === "OrderConfirm") {
                  // 若定义了重定向网址，则跳转到重定向指定跳转页面
                  _this.$router.push({
                    path: "OrderConfirm"
                  });
                } else {
                  // 若定义了重定向网址，则跳转到重定向页面
                  _this.$router.push({
                    path: decodeURIComponent(_this.$route.query.redirect)
                  });
                }
              }, 900);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  };
</script>