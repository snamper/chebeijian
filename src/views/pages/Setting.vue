<template>
    <div class="Setting">
      <div class="noticebody">
        <myHeader title="设置"  />
      </div>
      <div class="from_top">
        <div class="cell_box" @click="toModifyPassword">
          <div class="col-xs-8">修改密码</div>
          <div class="col-xs-3 name"></div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
       <div class="cell_box" @click="toAbout">
          <div class="col-xs-8">关于我们</div>
          <div class="col-xs-3 name"></div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="gray-border"></div>
        <!-- <div class="cell_box" @click="show=!show">
          <div class="col-xs-7 banben">当前版本号 <span>NEW</span></div>
          <div class="col-xs-4 name" >{{version}}</div>
        </div> -->
      </div>
      <div class="mask" v-show="show"></div>
      <div class="popup" v-show="show" >
        <div class="popup_head">
          <p class="popup_title"></p>
        </div>
        <div class="popup_content">
          <p>新版本<span>{{version}}</span></p>
          <p>是否更新？</p>
        </div>
        <div class="popuo_footer">
          <button class="cancel" @click="cancel">取消</button>
          <button class="ensure" @click="ensure">确定</button>
        </div>
      </div>
      <div class="keep">
        <button @click="gologin">退出登录</button>
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
      show: false,
      version: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {
    this.ensure();
  },
  methods: {
    toModifyPassword() {
      this.$router.push({ path: "ModifyPassword" });
    },
    toAbout() {
      this.$router.push({ path: "About" });
    },
    cancel() {
      console.log("点击了取消");
      this.show = false;
    },
    ensure() {
      var _this = this;
      console.log("点击了确认");
      _this.show = false;
      axios
        .post(
          _this.apihttpUrl + "api/config/versionUpdate?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            _this.version = response.data.data.updated.version;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    gologin() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/auth/logout?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("PHPREDISKEY");
            setTimeout(() => {
              _this.$router.push({
                path: "/"
              });
            }, 900);
          } else if (response.data.errorCode == -1) {
            Toast("您已在其他设备登录，请重新登录");
            setTimeout(() => {
              _this.$router.push({
                path: "Login"
              });
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    // goback() {
    //   this.$router.push({
    //     path: "UserIndex"
    //   });
    // }
  }
};
</script>

