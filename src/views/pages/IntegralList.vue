<template>
    <div class="IntegralList">
      <div class="noticebody">
        <myHeader title="积分" />
      </div>
      <div class="InList_header from_top">
        <div class="avator col-xs-2">
            <img :src="httpUrl+'type/integral.png'" alt="">
          </div>
          <div class="info col-xs-8">
            <p class="name">我的积分</p>
            <p class="count">{{integral}}</p>
          </div>
      </div>
      <div class="gray-border"></div>
      <div class="list_content">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div class="list_item" v-for="(item,index) in integralList" :key="index">
          <div class="col-xs-9">
            <p>订单编号:{{item.directions.order_no}}</p>
            <p class="time">{{item.create_at}}</p>
          </div>
          <div class="col-xs-3">
            <p>积分: <span>+{{item.integral}}</span></p>
          </div>
        </div>
        </van-list>
      </div>

   



    </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import myHeader from "@/components/Header";
import { Toast, List } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      integral: "",
      integralList: "",
      page: "1",
      loading: false,
      finished: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date()
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast,
    [List.name]: List
  },
  created() {},
  methods: {
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },

    onLoad() {
      var _this = this;
      var page = _this.page;
      axios
        .post(
          _this.apihttpUrl + "api/user/integral/index?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            // console.log(response.data.data);
            _this.integral = response.data.data.user_integral;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      //获取积分列表
      axios
        .post(
          _this.apihttpUrl + "api/user/integral/list?platform=weixin&version=1000&rows=15&page=" +
            page,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            // _this.integralList = response.data.data.info;
            var List = response.data.data.info;

            if (List.length === 0) {
              _this.finished = true;
              _this.loading = false;
              return false;
            }

            if (_this.integralList) {
              console.log(_this.integralList);
              _this.integralList = _this.integralList.concat(List);
            } else {
              _this.integralList = List;
            }
            _this.loading = false;
            _this.page++;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>


