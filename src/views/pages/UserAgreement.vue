<template>
   <div>
     <myHeader title="用户注册协议"/>
    <div class="user_agreement from_top">
     <h5>{{title}}</h5>
     <p v-html="content"></p>
    </div>
   </div>
</template>



<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      title:'',
      content:''
    };
  },
  components: {
    myHeader
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/article/detail?platform=weixin&version=1000&id=2c1b6662-bafc-11e8-a022-506b4b387d72",
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

<style lang="scss" scoped>
</style>



