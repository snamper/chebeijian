<template>
   <div>
    
     <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>绑定手机号</p>
      </div>
    </div>
  </header>

    <div class="wechat_login">   
      <img class="home_logo" :src="httpUrl+'toplogo.png'"> 
      <div class="wx_phone">
        <div class="col-xs-1"> <img :src="httpUrl+'modal/login_name.png'" /></div>
        <div class="col-xs-11"> <input placeholder="请输入手机号" type="text" v-model="wxPhone"/></div>
      </div>

      <div class="wx_password ">
        <div class="col-xs-8 wx-codetxt">
          <div class="col-xs-2"> <img :src="httpUrl+'modal/wx_code.png'" /></div>
          <div class="col-xs-10"> <input placeholder="请输入验证码" type="text" v-model="wxCode"/></div>
        </div>
        <button class="wx_code col-xs-4" @click="getcode()" v-show="sendshow"> 获取验证码 </button>
        <button class="register_code col-xs-4" v-show="timeshow"> 倒计时{{time}}S </button>
      </div>
      <button class="wx_loginBtn" @click="Binding()">
        绑定并登录
      </button>
      
     <!-- 温馨提示 -->
     <div class="wx-loginfoot">
       <p>温馨提示</p>
       <hr>
       <h5> 绑定手机号后，下次登录可以直接使用微信登录，无需 再次绑定；在“个人信息”中可解除微信绑定。</h5>
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
      time: 60,
      sendshow: true,
      timeshow: false,
      wxPhone: "",
      wxCode: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {
    this.initData();
    if (this.$route.query.is_need_binding == 1) {
      window.localStorage.setItem(
        "is_need_binding",
        this.$route.query.is_need_binding
      );
      // window.localStorage.setItem(
      //   "wx_user_info",
      //   this.$route.query.wx_user_info
      // );
      this.$router.push({
        path: "/WeChatLogin"
        // wx_user_info: this.$route.query.wx_user_info
      });
    } else if (this.$route.query.is_need_binding == 0) {
      //解除绑定是使用
      window.localStorage.setItem(
        "is_need_binding",
        this.$route.query.is_need_binding
      );

      window.localStorage.setItem("token", this.$route.query.token);
      this.$router.push({
        path: "/UserIndex"
      });
    }
  },

  mounted() {
    if (this.$route.query.is_need_binding == 1) {
      window.localStorage.setItem(
        "is_need_binding",
        this.$route.query.is_need_binding
      );
      // window.localStorage.setItem(
      //   "wx_user_info",
      //   this.$route.query.wx_user_info
      // );
      this.$router.push({
        path: "/WeChatLogin"
        // wx_user_info: this.$route.query.wx_user_info
      });
      // 部分手机下获取不到user_id 处理方法
    } else if (this.$route.query.is_need_binding == 0) {
      // this.show2 = false;
      window.localStorage.setItem(
        "is_need_binding",
        this.$route.query.is_need_binding
      );
      window.localStorage.setItem("token", this.$route.query.token);
      this.$router.push({
        path: "/UserIndex"
      });
    }
  },

  watch: {
    // is_need_binding为0时已经绑定，为1是没有绑定需要绑定
    $route(to, from) {
      if (to.query.is_need_binding == 1) {
        window.localStorage.setItem(
          "is_need_binding",
          this.$route.query.is_need_binding
        );
        // window.localStorage.setItem(
        //   "wx_user_info",
        //   this.$route.query.wx_user_info
        // );
        // this.show2 = true;
        this.$router.push({
          path: "/WeChatLogin"
          // wx_user_info: this.$route.query.wx_user_info
        });
        // this.user_id = this.$route.query.user_id;
      } else if (to.query.is_need_binding == 0) {
        window.localStorage.setItem(
          "is_need_binding",
          this.$route.query.is_need_binding
        );
        window.localStorage.setItem("token", to.query.token);
        this.$router.push({
          path: "/UserIndex"
        });
      }
    }
  },

  methods: {
    initData() {},
    Binding() {
      var _this = this;
      var baioshi = window.localStorage.getItem("PHPREDISKEY")
      console.log(baioshi)
      axios.defaults.withCredentials = true;
      axios
        .post(
          _this.apihttpUrl + "api/user/auth/binDingPhone?platform=weixin&version=1000&PHPREDISKEY="+baioshi,
          qs.stringify({
            phone: _this.wxPhone,
            salt: _this.wxCode
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            window.localStorage.setItem("token", response.data.data.token);

            window.localStorage.setItem("is_need_binding", 0);

            setTimeout(() => {
              _this.$router.push({
                path: "/UserIndex"
              });
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    getcode() {
      var _this = this;
      if (_this.wxPhone.length == 0) {
        Toast("请输入手机号");
      } else {
        axios
          .post(
            _this.apihttpUrl + "api/public/sendSms?platform=weixin&version=1000",
            qs.stringify({
              phone: _this.wxPhone,
              type: 2
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
      // if (decodeURIComponent(_this.$route.query.from) === "/login") {
      //   this.$router.push({
      //     path: "/login"
      //   });
      // } else if (decodeURIComponent(_this.$route.query.from) === "/UserInfo") {
      //   this.$router.push({
      //     path: "/UserInfo"
      //   });
      // }
      if (window.localStorage.getItem("token")) {
        this.$router.push({
          path: "/UserInfo"
        });
      } else {
        window.history.go(-2);
      }
    }
  }
};
</script>



