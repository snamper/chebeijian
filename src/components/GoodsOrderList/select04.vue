<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list" v-for="(order, index) in orderInfo" :key="index" v-if="order.status != 6">
      <van-row class="title row">
        <van-col span="18">订单号：{{order.order_no}}</van-col>
        <!-- 订单状态 -->
        <van-col span="6" class="state" v-if="order.is_install == 0 && order.status == 2">{{order.deliver_goods_status_str}}</van-col>
      </van-row>

        <!-- 订单商品 -->
      <div class="goods">
        <ul>
          <li>
            <router-link :to="{path:'GoodsOrderDetail',query:{id:order.id,active:3}}">
            <div class="col-xs-4">
              <img :src="order.product_image">
            </div>
            <div class="col-xs-8">
              <h4>{{order.product_name}}</h4>
              <p class="info">零件号：{{order.product_no}}</p>
              <p class="price"><span>￥</span>{{order.product_unit_price}}<span class="number">×{{order.pay_num}}</span></p>
            </div>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- end 订单商品 -->
      <!-- 门店及价格 -->
      <div class="store row" v-if="order.is_install == '1'">
        <div class="col-xs-7">
          <p>{{order.company_name}}</p>
        </div>
        <div class="col-xs-5">
          <p>安装费：<span>¥{{order.install_price}}</span></p>
        </div>
      </div>
      <!-- end 门店及价格 -->

      <!-- 合计价格 -->
      <div class="total row">
        <p>共一件商品 合计：<span>￥{{order.total}}</span></p>
      </div>
      <!-- end 合计价格 -->
      <!-- 退单 -->
      <div class="button row">
        <button class="pay" @click="refund(order.id)">退单</button>
      </div>

    </div>
    </van-list>

    <!-- 退单弹窗 -->
    <div class="mask" v-show="show6"></div>
    <div class="popup" v-show="show6">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="title">请输入退单原因</p>
        <van-field v-model="b_content" type="textarea" placeholder="请输入" />
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show6=false">取消</button><button class="ensure" @click="refundMoney(id)">确定</button>
      </div>
    </div>

    <div class="no-data" v-if="isEmpty">
        <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
        <p>暂时没有订单哦</p>
    </div>


  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import { Toast, List, Rate } from 'vant'

export default {
  name: 'select01',
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate,
  },
  data() {
    return {
      apihttpUrl: domain.testUrl,
      star: '',
      list: '',
      gcp_id: [],
      isEmpty: false,
      show: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      orderInfo: '',
      r_content: '',
      b_content: '',
      loading: false,
      finished: false,
      page: '1',
      list: [],
      httpUrl: domain.iconUrl,
    }
  },
  methods: {
    onLoad() {
      var _this = this
      var page = _this.page
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + 'api/user/product/order/list?platform=weixin&version=1000&deliver_goods_status=21&row=15&page=' +
              page,
            qs.stringify({
              token: window.localStorage.getItem('token'),
            })
          )
          .then(function(response) {
            var orderInfo = response.data.data.info
            console.log(response.data.data.info)
            //当数据为空且只有一页数据时，显示为空样式
            if (orderInfo.length === 0 && page == 1) {
              _this.isEmpty = true
            }
            if (orderInfo.length === 0) {
              _this.finished = true
              _this.loading = false
              return false
            }
            if (_this.orderInfo) {
              _this.orderInfo = _this.orderInfo.concat(orderInfo)
            } else {
              _this.orderInfo = orderInfo
            }
            _this.loading = false
            _this.page++
          })
          .catch(function(error) {
            console.log(error)
          })
      }, 200)
    },
    onChange(picker, value, index) {
      this.Toast(`当前值：${value}, 当前索引：${index}`)
    },
    refund(id) {
      this.show6 = true
      this.id = id
    },
    refundMoney(orderId) {
      var _this = this
      axios
        .post(
          _this.apihttpUrl + 'api/user/product/order/updateStatus?platform=weixin&version=1000',
          qs.stringify({
            token: window.localStorage.getItem('token'),
            order_id: orderId,
            operate_flag: '6',
            return_reason: this.b_content,
          })
        )
        .then(function(response) {
          Toast(response.data.message)
          if (response.data.errorCode === 0) {
            _this.show6 = false
            window.location.reload()
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
  },
}
</script>
