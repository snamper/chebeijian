<template>
  <div class="About">
    <div class="noticebody">
      <myHeader title="关于我们"/>
    </div>
    <div class="about_content from_top">
      <h1>{{title}}</h1>
      <p v-html="content"></p>
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
      title: "",
      content: ""
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
      axios
        .post(
          _this.apihttpUrl + "api/article/detail?platform=weixin&version=1000&id=2c1ca151-bafc-11e8-a022-506b4b387d72",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data.info);
            _this.title = response.data.data.info.title;
            _this.content = response.data.data.info.content;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>