<template>
   <div class="ChooseYear">
     <myHeader title="选择生产年份"/>
        <div class="yearTop from_top">
            <img class="icon" :src="img">
            <span>{{name}}</span> 
            <img :src="httpUrl+'modal/jiantou.png'">
             <span>{{name1}}</span>
        </div>
       <h5>选择生产年份</h5>
      <van-list v-model="loading" :finished="finished" @load="onLoad">
       <div class="chooseContent" v-for="(item,index) in list" :key="index">
          <div class="items" @click="tochooseCar(item.year_pattern,item.vehicle_family_id)"> <p>{{item.year_pattern}}</p></div>
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
      vehicleFamilyId: this.$route.query.id,
      list: [],
      page: 1,
      loading: false,
      finished: false
    };
  },
  components: {
    myHeader,
    [List.name]: List
  },
  created() {
    this.initData();
  },
  mounte() {
    this.initData();
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    tochooseCar(year, id) {
      this.$router.push({
        path: "/ChooseCar",
        query: {
          id: id,
          img: this.$route.query.img,
          name: this.$route.query.name,
          name1: this.$route.query.name1,
          year: year
        }
      });
    },
    onLoad() {
      var _this = this;
      console.log(_this.$route.query.id);
      let id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleYears?platform=weixin&version=1000&vehicle_family_id=" +
            id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            // Toast(response.data.message);
            console.log(response.data.data);
            var list = response.data.data.year_list;
            // _this.list = response.data.data.year_list;
            if (list.length === 0) {
              _this.finished = true;
              _this.loading = false;
              return false;
            } else {
              _this.list = list;
              _this.finished = true;
            }
            _this.loading = false;
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



