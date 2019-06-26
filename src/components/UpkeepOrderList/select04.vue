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
      </div>
    </van-list>

    <div class="no-data" v-if="isEmpty">
      <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
      <p>暂时没有订单哦</p>
    </div>

  </div>
  <!-- end 已取消 -->
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import { Toast, List, Rate } from 'vant'

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      star: '',
      list: '',
      gcp_id: [],
      isEmpty: false,
      orderInfo: '',
      loading: false,
      finished: false,
      page: '1',
      list: [],
      httpUrl: domain.iconUrl,
    }
  },
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate,
  },
  created() {},
  methods: {
    onLoad() {
      var _this = this
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + 'api/user/userMaintainOrder/?platform=weixin&version=1000',
            qs.stringify({
              token: window.localStorage.getItem('token'),
              status: 5,
            })
          )
          .then(function(response) {
            var orderInfo = response.data.data.info
            if (response.data.errorCode === 0) {
              _this.orderInfo = orderInfo
              if (orderInfo.length === 0) {
                _this.isEmpty = true
              }
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }, 200)
    },
  },
}
</script>
