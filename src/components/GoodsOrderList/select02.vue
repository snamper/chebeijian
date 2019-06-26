<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list" v-for="(order, index) in orderInfo" :key="index">
      <van-row class="title row">
        <van-col span="18">订单号：{{order.order_no}}</van-col>
        <!-- 订单状态 -->
        <van-col span="6" class="state" v-if="order.status == 1">待付款</van-col>
      </van-row>

        <!-- 订单商品 -->
      <div class="goods">
        <ul>
          <li>
            <router-link :to="{path:'GoodsOrderDetail',query:{id:order.id,active:1}}">
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

      <!-- 按钮操作 -->

      <!-- 待支付 -->
      <div class="button row">
        <button class="pay" @click="goPay(order.id)">付款</button>
        <button @click="cancel(order.id)">取消订单</button>
      </div>


      <!-- end 按钮操作 -->
      </div>
    </van-list>

      <!-- 取消订单弹窗 -->
    <div class="mask" v-show="show2"></div>
    <div class="popup" v-show="show2">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="title">请输入取消原因</p>
        <van-field v-model="r_content" type="textarea" placeholder="请输入" />
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show2=false">取消</button><button class="ensure" @click="cancelOrder(id)">确定</button>
      </div>
    </div>


    <!-- 付款弹框 -->
    <div class="mask" v-show="show"></div>
    <div class="popup pay" v-show="show">
      <div class="popup_head">
        <img :src="httpUrl+'close.png'" @click="show=false">
      </div>

      <div class="popup_content">
        <div class="col-xs-1">
          <img :src="httpUrl+'weixin.png'">
        </div>
        <div class="col-xs-11">
          <p>微信支付</p>
        </div>
        <div class="radiobox">   
          <input type="radio" name="quest01" checked="checked" />
          <span></span>
        </div>
      </div>

      <div class="button">
        <button @click="toPay(id)">付款</button>
      </div>

    </div>
    <!-- end 付款弹框 -->


    <div class="no-data" v-if="isEmpty">
        <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
        <p>暂时没有订单哦</p>
    </div>


  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { Toast, List, Rate } from "vant";

export default {
  name: "select01",
  components: {
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate
  },
  data() {
    return {
      apihttpUrl: domain.testUrl,
      star: "",
      list: "",
      gcp_id: [],
      isEmpty: false,
      show: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      orderInfo: "",
      r_content: "",
      b_content: "",
      loading: false,
      finished: false,
      page: "1",
      list: [],
      httpUrl: domain.iconUrl
    };
  },
  methods: {
    onLoad() {
      var _this = this;
      var page = _this.page;
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + "api/user/product/order/list?platform=weixin&version=1000&status=1&row=15&page=" +
              page,
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            var orderInfo = response.data.data.info;
            console.log(response.data.data.info);
            //当数据为空且只有一页数据时，显示为空样式
            if (orderInfo.length === 0 && page == 1) {
              _this.isEmpty = true;
            }
            if (orderInfo.length === 0) {
              _this.finished = true;
              _this.loading = false;
              return false;
            }
            if (_this.orderInfo) {
              _this.orderInfo = _this.orderInfo.concat(orderInfo);
            } else {
              _this.orderInfo = orderInfo;
            }
            _this.loading = false;
            _this.page++;
          })
          .catch(function(error) {
            console.log(error);
          });
      }, 200);
    },
    cancel(id) {
      this.show2 = true;
      this.id = id;
    },
    goPay(id) {
      this.show = true;
      this.id = id;
    },

    cancelOrder(orderId, index) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: "5",
            cancel_reason: this.r_content
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show2 = false;
            window.location.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toPay(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: 1,
            payment_method: 2
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            window.location.href = response.data.data.pay.pay;
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      // this.$router.push({
      //   path: "/Failure"
      // });
    },
    onChange(picker, value, index) {
      this.Toast(`当前值：${value}, 当前索引：${index}`);
    }
  }
};
</script>
