<template>
  <div class="storesDetail from_top">
    <myHeader title="门店推荐"/>
    <div class="advert">
      <van-swipe :autoplay="5000">
        <van-swipe-item v-for="(item, index) in banner" :key="index">
          <img v-lazy="item">
        </van-swipe-item>
      </van-swipe>
      <img v-if="istrue" :src="httpUrl+'zanwu.jpg'">
    </div>
    <div class="info row">
      <div class="evaluation title">
        <div class="col-xs-10">
          <h2>{{company_name}}</h2>
          <div class="five-star">
            <div class="zhezhao"></div>
            <van-rate v-model="score" :size="12" :count="5" viod-color="#DBDBDB" color="#FF2407"/>
          </div>
        </div>
        <div class="col-xs-2">
          <a :href="'tel:'+contact_phone">
            <img :src="httpUrl+'phone.png'">
          </a>
        </div>
      </div>
      <p class="time top">
        <img :src="httpUrl+'time.png'">
        <span>营业时间：{{business_hours_start}}~{{business_hours_end}}</span>
      </p>

      <div class="adress">
        <div class="col-xs-10">
          <p class="time">
            <img :src="httpUrl+'address.png'">
            <span>{{companyaddress}}</span>
          </p>
        </div>
        <div class="col-xs-2">
          <p class="time">
            <span class="navigation" @click="navigation(lnglat,company_name)">去导航</span>
          </p>
        </div>
      </div>

      <div class="service">
        <h4>服务项目</h4>
        <div class="label">
          <i id="SS"></i>
        </div>
      </div>

      <div class="detail">
        <h4>门店详情</h4>
        <div class="panel" v-html="introduction"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";
import qs from "qs";
import myHeader from "@/components/Header";
import { Toast, List, Rate } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      company_name: "",
      contact_phone: "",
      business_hours_start: "",
      business_hours_end: "",
      address: "",
      services: "",
      introduction: "",
      score: "",
      companyaddress: "",
      storeid: "",
      lnglat: "",
      banner: [],
      istrue: false
    };
  },
  components: {
    myHeader,
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      var id = this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/federationStore/info?platform=weixin&version=1000&federation_store_id=" +
            id
        )
        .then(function(response) {
          var storeInfo = response.data.data.info;
          //console.log(response.data.data.info);
          _this.storeid = storeInfo.id;
          _this.company_name = storeInfo.company_name;
          var companyname = _this.company_name;
          axios
            .post(
              _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000&company_name=" +
                companyname
            )
            .then(function(response) {
              // console.log(response);
              var storeInfo = response.data.data.info[0];
              //console.log(response.data.data.info);
              _this.companyaddress =
                storeInfo.province_name +
                storeInfo.city_name +
                storeInfo.district_name +
                storeInfo.address;
            })
            .catch(function(error) {
              console.log(error);
            });
          _this.lng = storeInfo.lng;
          _this.lat = storeInfo.lat;
          _this.lnglat = _this.lng + "," + _this.lat;
          _this.banner = storeInfo.store_pictures_path_arr;
          console.log(_this.banner);
          if (_this.banner.length == 0) {
            _this.istrue = true;
          }
          _this.contact_phone = storeInfo.contact_phone;
          _this.business_hours_start = storeInfo.business_hours_start.substr(
            0,
            5
          );
          _this.business_hours_end = storeInfo.business_hours_end.substr(0, 5);
          _this.address = storeInfo.address;
          _this.introduction = storeInfo.introduction;
          _this.score = storeInfo.score / 2;
          var services = storeInfo.services;
          var s = services.split(",");
          for (var i = 0; i < s.length; i++) {
            SS.insertAdjacentHTML("afterEnd", "<span>" + s[i] + "</span>");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goDetail() {
      this.$router.push({
        path: "storesDetail"
      });
    },
    navigation(lnglat, company_name) {
      var lnglat = lnglat;
      var name = company_name;
      window.location.href =
        "http://mo.amap.com/share/index/lnglat=" + lnglat + "&name=" + name;
    }
  }
};
</script>