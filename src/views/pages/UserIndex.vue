<template>
    <div class="userIndex">
      <div class="ui_top">
        <div class="ui_nav">
          <div class="row">
            <div class="msg" @click="toMsg">
                <img :src="httpUrl+'type/msg.png'" alt="">
            </div>
            <div class="setting" @click="toSetting">
                <img :src="httpUrl+'type/setting.png'" alt="">
            </div>
          </div>
        </div>
        <div class="ui_info" @click="toUserInfo">
          <div class="avator col-xs-4">
            <img :src="userImg" alt="">
          </div>
          <div class="info col-xs-8">
            <p class="name">{{userName}}</p>
            <p class="phone">{{phone}}</p>
          </div>
        </div>
      </div>
      <div class="ui_bottom">
        <div class="cell_box" @click="toCart">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_04.png'" alt=""></div>
          <div class="col-xs-11">购物车</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toCollect">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_07.png'" alt=""></div>
          <div class="col-xs-11">我的收藏</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toCarList">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_09.png'" alt=""></div>
          <div class="col-xs-11">车辆信息</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toInvoiceList">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_11.png'" alt=""></div>
          <div class="col-xs-11">发票管理</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toAddressList">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_13.png'" alt=""></div>
          <div class="col-xs-11">地址管理</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toIntegralList">
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_15.png'" alt=""></div>
          <div class="col-xs-11">积分管理</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
      </div>
       <myFooter/>
        <!-- 消息弹框 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>敬请期待！</p>
      </div>
      <div class="popuo_footer">
        <button class="ensure but" @click="show=false">确定</button>
      </div>
    </div>
    </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import myFooter from "@/components/Footer";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      userName: "请设置用户名",
      phone: "1756489237",
      userImg: "",
      show: false
    };
  },
  components: {
    myFooter,
    [Toast.name]: Toast
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      // _this.phone = window.localStorage.getItem("phone");
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode === -1) {
            _this.$router.push("/login");
          }
          if (response.data.errorCode == 0) {
            console.log(response.data.data.info);
            var info = response.data.data.info;
            if(info.name==info.phone){
              _this.userName = '未设置';
            }else{
              _this.userName = info.name;
            }
            _this.phone = info.phone;
            _this.userImg = info.avatar_path;
            window.localStorage.setItem("phone", info.phone);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 路由跳转
    // 设置
    toSetting() {
      this.$router.push({ path: "Setting" });
    },
    // 消息
    toMsg() {
      this.show = true;
      // this.$router.push({ path: "Notice" });
    },
    // 用户信息
    toUserInfo() {
      this.$router.push({ path: "UserInfo" });
    },
    // 购物车
    toCart() {
      this.$router.push({ path: "CartList" });
    },
    // 收藏
    toCollect() {
      this.$router.push({ path: "CollectList" });
    },
    // 车辆管理
    toCarList() {
      this.$router.push({ path: "CarList" });
    },
    // 发票管理
    toInvoiceList() {
      this.$router.push({ path: "InvoiceList" });
    },
    // 地址列表
    toAddressList() {
      this.$router.push({ path: "AddressList" });
    },
    // 积分管理
    toIntegralList() {
      this.$router.push({ path: "IntegralList" });
    }
  }
};
</script>
