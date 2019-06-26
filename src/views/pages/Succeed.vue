<template>
  <div class="succeed">
    <div v-if="orderType == 4">
      <!-- 头部导航 -->
      <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>预约状态</p>
      </div>
    </div>
  </header>
  <!-- end 头部导航 -->
      <div class="from_top">
        <div class="succeedcontent">
          <img :src="httpUrl+'modal/succeed.png'" v-if="status == 2" />
          <h2 v-if="status == 2">预约成功</h2>
          <img :src="httpUrl+'modal/failure.png'" v-if="status == 1" />
          <h2 v-if="status == 1">支付失败</h2>
          <div class="content">
            <p>预约保险单号：{{order_no}}</p>
            <p>支付金额：{{total}}</p>
            <p>预约对应车辆：{{license_plate_number}}</p>
            <p>预约车险生效时间：{{insurance_start_date}}~{{insurance_end_date}}</p>
          </div>
          <div class="succeeBtn">
            <button class="upkeep" @click="toUpkeep" v-if="status == 2">去保养</button>
            <button class="upkeep" @click="tohome" v-if="status == 1">返回首页</button>
            <button class="myUpkeep" @click="toMyUpkeep">查看预约单</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="orderType == 1 || orderType == 2 || orderType == 3">
      <!-- 头部导航 -->
      <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>支付状态</p>
      </div>
    </div>
  </header>
  <!-- end 头部导航 -->
      <div class="from_top">
        <div class="succeedcontent">
          <img v-if="orderStatus == 2" :src="httpUrl+'modal/succeed.png'"/>
          <h2 v-if="orderStatus == 2">支付成功</h2>
          <img v-if="orderStatus == 1" :src="httpUrl+'modal/failure.png'"/>
          <h2 v-if="orderStatus == 1">支付失败</h2>
          <div class="succeeBtn">
            <button class="upkeep" @click="tohome">返回首页</button>
            <button class="myUpkeep" @click="toGoodsOrderList">查看订单</button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>



<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      order_no: "",
      insurance_start_date: "",
      insurance_end_date: "",
      total: "",
      license_plate_number: "",
      status: "",
      httpUrl: domain.iconUrl, //直接通过this访问全局变量
      orderType: "",
      orderStatus: ""
    };
  },
  components: {
    myHeader
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "service/pay/getPayOrderInfo?order_no=" +
            _this.$route.query.order_no
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            var orderInfo = response.data.data.info;
            _this.orderType = orderInfo.type;
            _this.orderStatus = orderInfo.status;
            if (_this.orderType == 4) {
              axios
                .post(
                  _this.apihttpUrl + "api/user/userInsuranceOrder/detailOrder?platform=weixin&version=1000&order_no=" +
                    _this.$route.query.order_no,
                  qs.stringify({
                    token: window.localStorage.getItem("token")
                  })
                )
                .then(function(response) {
                  if (response.data.errorCode == 0) {
                    console.log(response.data.data);
                    _this.order_no =
                      response.data.data.info.order_info.order_no;
                    _this.insurance_start_date =
                      response.data.data.info.order_info.insurance_start_date;
                    _this.insurance_end_date =
                      response.data.data.info.order_info.insurance_end_date;
                    _this.total = response.data.data.info.order_info.total;
                    _this.license_plate_number =
                      response.data.data.info.user_vehicle_info.license_plate_number;
                    _this.status = response.data.data.info.order_info.status;
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toUpkeep() {
      this.$router.push({
        path: "/UpkeepStore"
      });
    },
    toMyUpkeep() {
      this.$router.push({
        path: "/CarInsuranceList"
      });
    },
    tohome() {
      this.$router.push({
        path: "/"
      });
    },
    toGoodsOrderList() {
      this.$router.push({
        path: "/GoodsOrderList"
      });
    },
    onClickLeft() {
      window.history.go(-2);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>