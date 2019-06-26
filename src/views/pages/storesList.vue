<template>

  <div class="storesList">
    <myHeader title="安装服务列表" />
    <div class="store from_top">
      <ul>
        <li v-for="(item,index) in recommendList" :key="index">
          <div class="row">
            <router-link :to="{path:'storesDetail',query:{id:item.id}}">
            <div class="col-xs-3">
              <img :src="item.door_head_image_path">
            </div>
            <div class="col-xs-9">
              <h4>{{item.company_name}}</h4>
              <p class="info">{{item.select_federation_store_service_name}}</p>
              <div class="five-star">
                <van-rate v-model="item.score /2" :size="12" :count="5" viod-color="#DBDBDB" color="#FF2407" />
              </div>
              <p class="contact">
                <img :src="httpUrl+'tel.png'">
                <span>{{item.register_telephone}}</span>
              </p>

            </div>
            </router-link>
          </div>
          <div class="shadow"></div>
        </li>

      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import myHeader from "@/components/Header";
import axios from "axios";
import qs from "qs";
import { Toast, List, Rate } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      recommendList: [],
      start2: "3"
    };
  },
  components: {
    myHeader,
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate,
    store_service_name: ""
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化门店l列表
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            // console.log(response.data.data.info);
            // _this.recommendList = response.data.data.info;

            let list = response.data.data.info;

            for (let i = 0; i < list.length; i++) {
              let serviceName =
                response.data.data.info[i].select_federation_store_service_name;
              list[i].select_federation_store_service_name = "";
              list[i].select_federation_store_service_name = serviceName
                .split(",")
                .join("|");
            }
            _this.recommendList = list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>