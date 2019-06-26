<template>
  <!-- 待接单 -->
  <div>
    <van-list @load="onLoad">
    <div class="list" v-for="(order, index) in orderInfo" :key="index">
      <p>保养单号：{{order.order_no}}<span>{{order.status_str}}</span></p>
      <p>对应保险单号：{{order.user_insurance_order_no}}</p>
      <p>车牌号：{{order.license_plate_number}}</p>
      <div class="store">
        <p><img :src="httpUrl+'mendian.png'"><span>{{order.federation_store_company_name}}</span></p>
        <p><img :src="httpUrl+'dianhua.png'"><span>{{order.federation_store_contact_phone}}</span></p>
        <p><img :src="httpUrl+'dizhi2.png'"><span>{{order.province_name}}{{order.city_name}}{{order.district_name}}{{order.federation_store_address}}</span></p>
      </div>
      <div class="time">
        <p>预计保养时间：{{order.estimated_maintenance_time.substring(0,10)}}</p>
        <p>订单提交时间：{{order.create_at}} </p>
      </div>
      <div class="button row">
        <button @click="cancel(order.id)">取消保养</button>
      </div>
    </div>
    </van-list>


    <!-- 取消保养弹窗 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>确认取消保养？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show=flase">取消</button><button class="ensure" @click="cancelOrder(id)">确定</button>
      </div>
    </div>

    <div class="no-data" v-if="isEmpty">
        <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
        <p>暂时没有订单哦</p>
    </div>

  </div>
  <!-- end 待接单 -->
</template>

<script>
import axios from "axios";
import qs from "qs";
import { Toast, List, Rate } from "vant";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      show: false,
      star: "",
      list: "",
      gcp_id: [],
      isEmpty: false,
      orderInfo: "",
      loading: false,
      finished: false,
      page: "1",
      list: [],
      httpUrl: domain.iconUrl
    };
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate
  },
  created() {},
  methods: {
    onLoad() {
      var _this = this;
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + "api/user/userMaintainOrder/?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token"),
              status: 2
            })
          )
          .then(function(response) {
            var orderInfo = response.data.data.info;
            if (response.data.errorCode === 0) {
              _this.orderInfo = orderInfo;
              if (orderInfo.length === 0) {
                _this.isEmpty = true;
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }, 200);
    },
    cancel(id) {
      this.show = true;
      this.id = id;
    },
    cancelOrder(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userMaintainOrder/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: orderId,
            status: 5
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
