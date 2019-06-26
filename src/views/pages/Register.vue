<template>  
   <div>
     <!-- <myHeader title="注册"/> -->
     <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>注册</p>
      </div>
    </div>
  </header>

    <div class="register">  
       <img class="home_logo" :src="httpUrl+'toplogo.png'"> 
      <div class="phone">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_name.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请输入手机号" type="text" v-model="registerPhone" /></div>
      </div>

       <div class="register_password ">
        <div class="col-xs-8 register-codetxt">
          <div class="col-xs-2"> <img :src="httpUrl+'modal/wx_code.png'" /></div>
          <div class="col-xs-10"> <input placeholder="请输入验证码" type="text" v-model="registerCode" /></div>
        </div>
         <button class="btnCodeDefault btnLight   col-xs-4" @click="getcode()" v-show="sendshow"> 获取验证码 </button>
         <button class="btnCodeDefault  btndefault col-xs-4" v-show="timeshow"> 倒计时{{time}}S </button>
        <!-- <button v-show="sendshow" @click="getCode">获取验证码</button> -->
      </div>

      <div class="password">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_psd.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请输入密码" type="password" v-model="registerPsd" /></div>
      </div>
      
       <div class="password">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_psd.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请确认输入密码" type="password" v-model="ensurePsd" /></div>
      </div>



      <div class="registerText">
          <div class="col-xs-1 regCheckbox"> 
            
            <input type="checkbox"  v-model="checked" id="agree"/>
            <label for="agree" ></label>
          </div>
        <div class="col-xs-11"> 我已阅读并同意
          <span @click="goProtocal">《用户注册协议》</span>
          <!-- <router-link to="/UserAgreement">《用户注册协议》</router-link> -->
          </div>
      </div>


<div class="registerSure">
      <button  @click="doRegister()" :class="checked ?'btnLight':'btndefault'">
        注册
      </button>
        <div class="tologin">
          <router-link to="/Login">已有账号，去登录</router-link> 
        </div>
</div>
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
      checked: false,
      time: 60,
      sendshow: true,
      timeshow: false,
      registerPhone: "",
      registerCode: "",
      registerPsd: "",
      ensurePsd: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      if (window.localStorage.getItem("msg")) {
        var msg = JSON.parse(window.localStorage.getItem("msg"));
        this.registerPhone = msg.phone;
        this.registerPsd = msg.password;
        this.ensurePsd = msg.ensurePsd;
        this.checked = msg.checked;
        this.registerCode = msg.salt;
      }
    },
    goProtocal() {
      window.localStorage.setItem(
        "msg",
        JSON.stringify({
          phone: this.registerPhone,
          password: this.registerPsd,
          ensurePsd: this.ensurePsd,
          checked: this.checked,
          salt: this.registerCode
        })
      );
      console.log(JSON.parse(window.localStorage.getItem("msg")));
      this.$router.push({
        path: "/UserAgreement"
      });
    },

    doRegister() {
      var _this = this;
      if (_this.checked == false) {
        Toast("请勾选注册协议");
        return false;
      } else if (_this.checked == true) {
        axios
          .post(
            _this.apihttpUrl + "api/user/auth/register?platform=weixin&version=1000",
            qs.stringify({
              phone: _this.registerPhone,
              password: _this.registerPsd,
              ensure_password: _this.ensurePsd,
              salt: _this.registerCode
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
      }
    },
    getcode() {
      var _this = this;
      if (_this.registerPhone.length == 0) {
        Toast("请输入手机号");
      } else {
        axios
          .post(
            _this.apihttpUrl + "api/public/sendSms?platform=weixin&version=1000",
            qs.stringify({
              phone: _this.registerPhone,
              type: 1
            })
          )
          .then(function(response) {
            Toast(response.data.message);
            if (response.data.errorCode == 0) {
              _this.sendshow = false;
              _this.timeshow = true;
              // 设置定时器
              var subtractTime = setInterval(() => {
                _this.time--;
                if (_this.time <= 0) {
                  clearInterval(subtractTime);
                  _this.sendshow = true;
                  _this.timeshow = false;
                  _this.time = 60;
                }
              }, 1000);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    onClickLeft() {
      window.localStorage.removeItem("msg");
      this.$router.push({
        path: "Login"
      });
    }
  }
};
</script>





