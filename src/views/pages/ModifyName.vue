<template>
    <div class="ModifyName">
      <div class="noticebody">
        <myHeader title="修改姓名" />
      </div>
      <div class="change_content from_top">
        <span>姓名:</span>
        <input type="text" placeholder="请输入您的姓名" v-model="changeName" >
      </div>
      <div class="keep">
        <button @click="doSave">保存</button>
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
      changeName: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {},
  methods: {
    doSave() {
      var _this = this;
      var str = _this.changeName;
      if (str.length == 0) {
        Toast("姓名不能为空");
        return;
      }else if (str.length > 7) {
        Toast("名字过长请重新输入");
        return;
      }
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/updateUserInfo?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            name: _this.changeName
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.push({
                path: "UserInfo"
              });
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>


