<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list" v-for="(order, index) in orderInfo" :key="index">
      <van-row class="title row">
        <van-col span="18">订单号：{{order.order_no}}</van-col>
        <!-- 订单状态 -->
        <van-col span="6" class="state" v-if="order.status == 4">{{order.status_str}}</van-col>
      </van-row>

        <!-- 订单商品 -->
      <div class="goods">
        <ul>
          <li>
            <router-link :to="{path:'GoodsOrderDetail',query:{id:order.id,active:6}}">
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

      <!-- 已完成 -->
      <div class="button row" v-if="order.status == '4' && order.is_install == '1' && order.evaluation_info==''">
        <button class="pay" @click="goEvaluate(order.id)">去评价</button>
      </div>

      <!-- end 按钮操作 -->
      </div>
    </van-list>


    <!-- 去评价弹窗 -->
    <div class="mask" v-show="show4"></div>
    <div class="popup" v-show="show4">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="title">请评价</p>
        <div class="five-star">
          <van-rate v-model="star" :size="32" :count="5" color="#FF2407" void-color="#DBDBDB" @change="xinxin()"/>
        </div>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show4=false">取消</button>
        <button class="ensure" @click="evaluation(id)">确定</button>
      </div>
    </div>



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
            _this.apihttpUrl + "api/user/product/order/list?platform=weixin&version=1000&status=4&row=15&page=" +
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
    goEvaluate(id) {
      this.show4 = true;
      this.id = id;
    },
    onChange(picker, value, index) {
      this.Toast(`当前值：${value}, 当前索引：${index}`);
    },
    //评分
    xinxin() {
      this.list.gcp_id = this.star;
    },
    evaluation(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/evaluation?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            star: _this.star * 2
          })
        )
        .then(function(response) {
          if (_this.star == 0) {
            Toast("评星不能为空");
            return false;
          }
          if (response.data.errorCode === 0) {
            Toast(response.data.message);
            _this.show4 = false;
            window.location.reload();
          } else {
            Toast(response.data.message);
            _this.show4 = false;
          }
          console.log(_this.star);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
