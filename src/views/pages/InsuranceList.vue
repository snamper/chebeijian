<template>
  <div class="CarInsuranceList">
    <!-- 头部 -->
    <myHeader title="保险" />

    <div class="InsuranceList from_top">
      <div class="insurance">
        <div class="col-xs-6" @click="gobuy">
          <p>已有预约保险，去购买</p>
          <div class="select" v-if="ismake"></div>
        </div>
        <div class="col-xs-6 two" @click="gopurchase">
          <p>无预约直接购买</p>
          <div class="select" v-if="isnomake"></div>
        </div>
      </div>
      <div class="company">
        <h4>可选择的保险公司</h4>
        <ul>
          <li class="active">
            <div class="select"></div>
            <img :src="httpUrl+'baoxian.jpg'" alt="">
          </li>
          <li>
            <div class="select"></div>
            <img :src="httpUrl+'baoxian.jpg'" alt="">
          </li>
        </ul>
        <p class="top">1.使用预约保险，成功购买保险后，预约金额直接退回原账户</p>
        <p>2.预约保险，提前享受保养服务</p>
      </div>
    </div>

    <!-- 预约单弹框 -->
    <div class="CarInsurance list">
      <van-popup v-model="InsuranceList" position="bottom" :overlay="true" class="carshow popup-car">
        <div class="timetop car">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">
            选择预约单
          </div>
          <div class="col-xs-1" @click="InsuranceList=false">
            <img :src="httpUrl+'modal/timeClose.png'" />
          </div>
        </div>
        <div class="content">
          <ul>
            <li v-for="(item, index) in list" :key="index" @click="dianji(item.id)">
              <p class="title">预约单号：{{item.order_no}}</p>
              <p>车牌号：{{item.license_plate_number}}<span>￥{{item.total}}</span></p>
            </li>
          </ul>
        </div>
      </van-popup>
    </div>

    <!-- 选择车辆弹框 -->
    <div class="CarInsurance list">
      <van-popup v-model="carshow" position="bottom" :overlay="true" class="carshow popup-car">
        <div class="timetop car">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">
            选择车辆
          </div>
          <div class="col-xs-1" @click="carshow=false">
            <img :src="httpUrl+'modal/timeClose.png'" />
          </div>
        </div>
        <van-picker class="carnumber" :columns="carlist" @change="onChange" />
      </van-popup>
    </div>

<myFooter />
  </div>

</template>



<script>
import "../../style/common/css/modal.scss";
import { DatetimePicker, Popup, Picker, Toast, RadioGroup, Radio } from "vant";
import axios from "axios";
import qs from "qs";
import myHeader from "@/components/Header";
import myFooter from "@/components/Footer";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      ismake: false,
      isnomake: false,
      carshow: false,
      InsuranceList: false,
      httpUrl: domain.iconUrl,
      carlist: [""],
      idlist: [""],
      list: []
    };
  },
  components: {
    myHeader,
    myFooter,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Toast.name]: Toast,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  created() {
    this.initData();
    this.initData1();
  },
  methods: {
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/vehicle/list?platform=weixin&version=1000&page=1&row=30",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            var list = response.data.data.info;
            for (var i = 0; i < list.length; i++) {
              _this.carlist.push(list[i].license_plate_number);
              _this.idlist.push(list[i].id);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    initData1() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/zhongAnInsCanUsedReservation?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            _this.list = response.data.data.list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    dianji(id) {
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/zhongAnInsRc4?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            type: 1,
            reservation_order_id: id
          })
        )
        .then(function(response) {
          console.log(response.data);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            window.location.href =
              "https://c.zhongan.com/insure/index.html?flowId=FJ29882123312557bc51&bizContent=" +
              response.data.data.bizContent;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //车牌的改变
    onChange(picker, value, index) {
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/zhongAnInsRc4?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            type: 2,
            user_vehicle_id: this.idlist[index]
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            window.location.href =
              "https://c.zhongan.com/insure/index.html?flowId=FJ29882123312557bc51&bizContent=" +
              response.data.data.bizContent;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    gobuy() {
      this.ismake = true;
      this.isnomake = false;
      this.InsuranceList = true;
    },
    gopurchase() {
      this.isnomake = true;
      this.ismake = false;
      this.carshow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>