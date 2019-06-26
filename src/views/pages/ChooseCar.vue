<template>
  <div class="ChooseCar">
    <myHeader title="选择车型"/>
    <div class="yearTop from_top">
      <img class="icon" :src="img">
      <span>{{name}}</span>
      <img :src="httpUrl+'modal/jiantou.png'">
      <span>{{name1}}</span>
    </div>
    <div class="divcar">
      <span>{{year}}年</span>
      <img :src="httpUrl+'modal/carsearch-detail.png'">
      <p>选择车型</p>
    </div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="chooseContent" v-for="item in list" :key="item">
        <div class="items" @click="tochooseCar(item.vehicle_model_id,item.vehicle_model_name)">
          <p>{{item.vehicle_model_name}}</p>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import axios from "axios";
import qs from "qs";
import { Toast, List } from "vant";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      img: this.$route.query.img,
      name: this.$route.query.name,
      name1: this.$route.query.name1,
      year: this.$route.query.year,
      list: [],
      loading: false,
      finished: false
    };
  },
  components: {
    myHeader,
    [List.name]: List
  },
  created() {
    this.init();
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    onLoad() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleModes?platform=weixin&version=1000&vehicle_family_id=" +
            _this.$route.query.id +
            "&vehicle_year=" +
            _this.$route.query.year,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // _this.list = response.data.data.vehicle_modes.info;
          console.log(response.data.data.vehicle_modes.info);
          // console.log(response.data.message.message);
          var list = response.data.data.vehicle_modes.info;
          if (list.length === 0) {
            _this.finished = true;
            _this.loading = false;
            return false;
          } else {
            _this.list = list;
            _this.finished = true;
          }
          _this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    tochooseCar(id, name) {
      this.$router.push({
        path: "/searchResult",
        query: {
          id: id,
          koy: window.localStorage.getItem("q"),
          name: this.$route.query.name,
          name1: this.$route.query.name1,
          year: this.$route.query.year,
          name2: name
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>



