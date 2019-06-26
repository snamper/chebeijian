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
          <p>完成保养时间：{{order.update_at}} </p>
        </div>
        <div class="button row" v-if="order.is_evaluation == '0'">
          <button class="pay" @click="cancel(order.id)">去评价</button>
        </div>

        <div class="title evaluation" v-if="order.is_evaluation == '1' ">
          <div class="col-xs-5">
            <p>评价</p>
          </div>
          <div class="col-xs-7">
            <div class="five-star">
              <div class="zhezhao"></div>
              <van-rate v-model="order.evaluation_star/2" :size="22" :count="5" color="#FF2407" void-color="#DBDBDB" />
            </div>
          </div>
        </div>

      </div>
    </van-list>

    <!-- 去评价弹窗 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="title">请评价</p>
        <div class="five-star">
          <van-rate v-model="star" :size="32" :count="5" color="#FF2407" void-color="#DBDBDB" @change="xinxin()" />
        </div>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show=flase">取消</button>
        <button class="ensure" @click="evaluation(id)">确定</button>
      </div>
    </div>

    <div class="no-data" v-if="isEmpty">
      <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
      <p>暂时没有订单哦</p>
    </div>

  </div>
  <!-- end 待保养 -->
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import { Toast, List, Rate } from 'vant'

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      show: false,
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
              status: 4,
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
    cancel(id) {
      this.show = true
      this.id = id
    },
    //评分
    xinxin() {
      this.list.gcp_id = this.star
    },
    evaluation(orderId) {
      var _this = this
      axios
        .post(
          _this.apihttpUrl + 'api/user/userMaintainOrder/evaluationOrder?platform=weixin&version=1000',
          qs.stringify({
            token: window.localStorage.getItem('token'),
            order_id: orderId,
            star: _this.star * 2,
          })
        )
        .then(function(response) {
          if (_this.star == 0) {
            Toast('评星不能为空')
            return false
          }
          if (response.data.errorCode === 0) {
            Toast(response.data.message)
            _this.show = false
          } else {
            Toast(response.data.message)
            _this.show = false
          }
          console.log(_this.star)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
  },
}
</script>
