<template>
    <div class="ModifyMobile">
      <div class="noticebody">
        <myHeader title="修改手机号" />
      </div>
      <div class="newMobile from_top">
        新号码: <span>{{newPhone}}</span>
        <div class="saleBox">
            <button v-show="sendshow" @click="getCode">获取验证码</button>
            <button class="time" v-show="timeshow">倒计时{{time}}S</button>
          </div>
      </div>
      <div class="change_content">
        <span>验证码:</span>
        <input type="text" placeholder="请输入验证码" v-model="code">
      </div>
      <div class="keep">
        <button @click="doSave()">保存</button>
      </div>
      <div class="mask" v-show="show" @click="show=!show"></div>
      <div class="popup" v-show="show" >
        <div class="popup_head">
          <p class="popup_title"></p>
        </div>
        <div class="popup_content">
          <img :src="httpUrl+'type/chenggong.png'" alt="">
          <p>修改成功</p>
        </div>
        <div class="popuo_footer">
        <button class="ensure but" @click="toUserInfo" >确定</button>
        </div>
      </div>
    </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
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
      httpUrl: domain.iconUrl,
      time: 60,
      sendshow: true,
      timeshow: false,
      show: false,
      newPhone: this.$route.query.phone,
      code: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    // 获取短信验证码
    getCode() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/public/sendSms?platform=weixin&version=1000",
          qs.stringify({
            phone: _this.newPhone,
            type: 3
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
    },
    doSave() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/updatePhone?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            phone: _this.newPhone,
            salt: _this.code
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            _this.show = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 用户信息
    toUserInfo() {
      setTimeout(() => {
        this.$router.push({
          path: "UserInfo"
        });
      }, 900);
    }
  }
};
</script>
