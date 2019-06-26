<template>
   <div>
     <myHeader title="找回密码"/>
    <div class="password_find from_top">   
      <img class="home_logo" :src="httpUrl+'toplogo.png'"> 
      <div class="pf_phone">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_name.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请输入手机号" type="text" v-model="phone"/></div>
      </div>

      <div class="pf_password ">
        <div class="col-xs-8 pf-codetxt">
          <div class="col-xs-2"> <img :src="httpUrl+'modal/wx_code.png'" /></div>
          <div class="col-xs-10"> <input placeholder="请输入验证码" type="text" v-model="code" /></div>
        </div>
        <button class="pf_code col-xs-4" @click="getcode()" v-show="sendshow"> 获取验证码 </button>
        <button class="register_code col-xs-4" v-show="timeshow"> 倒计时{{time}}S </button>
      </div>
      <button class="pf_loginBtn" @click="doNext()">
        下一步
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
      time: 60,
      sendshow: true,
      timeshow: false,
      phone: "",
      code: "",
      ensoreCode: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    doNext() {
      var _this = this;
      if (_this.phone == "") {
        Toast("请输入手机号");
      } else if (_this.code == "") {
        Toast("请输入验证码");
      } else if (_this.code !== _this.ensoreCode) {
        Toast("请输入正确的验证码");
      } else {
        this.$router.push({
          path: "/EnterPassword",
          query: {
            phone: _this.phone,

            code: _this.code
          }
        });
      }
    },

    getcode() {
      var _this = this;
      if (_this.phone.length == 0) {
        Toast("请输入手机号");
      } else {
        axios
          .post(
            _this.apihttpUrl + "api/public/sendSms?platform=weixin&version=1000",
            qs.stringify({
              phone: _this.phone,
              type: 4
            })
          )
          .then(function(response) {
            Toast(response.data.message);
            if (response.data.errorCode == 0) {
              _this.ensoreCode = response.data.data.salt;
              console.log(response.data.data.salt);
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>



