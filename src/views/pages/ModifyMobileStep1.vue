<template>
    <div class="ModifyMobile">
      <div class="noticebody">
        <myHeader title="修改手机号" />
      </div>
      <div class="change_content from_top">
        <span>手机号:</span>
        <input type="text" placeholder="请输入您的新手机号" v-model="changPhone">
      </div>
      <div class="keep">
        <button @click="toModifyMobileStep2">保存</button>
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
      httpUrl: domain.iconUrl,
      changPhone: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    toModifyMobileStep2() {
      var _this = this;
      var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (phoneReg.test(_this.changPhone)) {
        if (_this.changPhone == window.localStorage.getItem("phone")) {
          Toast("不能与原手机一致");
        } else {
          this.$router.push({
            path: "ModifyMobileStep2",
            query: {
              phone: _this.changPhone
            }
          });
        }
      } else {
        Toast("请输入正确手机号");
        return false;
      }
    }
  }
};
</script>


