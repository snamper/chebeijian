<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list" v-for="(order, index) in orderInfo" :key="index">
        <van-row class="title row">
          <van-col span="18">订单号：{{order.order_no}}</van-col>
          <!-- 订单状态 -->
          <van-col span="6" class="state" v-if="order.status == 6">退款申请中</van-col>
          <van-col span="6" class="state" v-if="order.status == 7">退款成功</van-col>
          <van-col span="6" class="state" v-if="order.status == 8">退款失败</van-col>
        </van-row>

        <!-- 订单商品 -->
        <div class="goods">
          <ul>
            <li>
              <router-link :to="{path:'GoodsOrderDetail',query:{id:order.id,active:7}}">
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

        <!-- 退款 -->
        <div class="button row">
          <button v-if="order.status == '6' || order.status == '7'" class="pay" @click="Reason(order.id)">退款理由</button>
        </div>

        <div class="button row" v-if="order.status == '8'">
          <button v-if="order.is_install == '0'" class="pay" @click="normal(order.id)">正常发货</button>
          <button v-if="order.is_install == '1'" class="pay" @click="normal(order.id)">正常接单</button>
          <button @click="Reason(order.id)">拒绝理由</button>
        </div>


      </div>
    </van-list>

    <!-- 退款理由弹窗 -->
    <div class="mask" v-show="show7"></div>
    <div class="popup" v-show="show7">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="two" v-if="status == '6' || status == '7'">您的退款理由<br>{{returnReason}}</p>
        <p class="two" v-if="status == '8'">拒绝退款理由<br>{{returnReason}}</p>
      </div>
      <div class="popuo_footer">
        <button class="ensure but" @click="show7=false">确定</button>
      </div>
    </div>

    <!-- 正常发货弹框 -->
    <div class="mask" v-show="show8"></div>
    <div class="popup" v-show="show8">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p v-if="is_install == '0'">请确定是否正常发货？</p>
        <p v-if="is_install == '1'">请确定是否正常接单？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show8=flase">取消</button><button class="ensure" @click="normalOrder(id)">确定</button>
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
      show7: false,
      show8: false,
      orderInfo: "",
      r_content: "",
      b_content: "",
      loading: false,
      finished: false,
      page: "1",
      list: [],
      httpUrl: domain.iconUrl,
      returnReason: "",
      status: "",
      is_install: ""
    };
  },
  methods: {
    onLoad() {
      var _this = this;
      var page = _this.page;
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + "api/user/product/order/list?platform=weixin&version=1000&status=refund&row=15&page=" +
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
    onChange(picker, value, index) {
      this.Toast(`当前值：${value}, 当前索引：${index}`);
    },
    Reason(id) {
      var _this = this;
      _this.show7 = true;
      _this.id = id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/info?platform=weixin&version=1000&order_id=" +
            id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          var orderInfo = response.data.data.info;
          _this.is_install = orderInfo.is_install;
          _this.status = orderInfo.status;
          if (_this.status == "6" || _this.status == "7") {
            _this.returnReason =
              orderInfo.status_info[6].directions.return_reason;
          } else if (_this.status == "8") {
            _this.returnReason =
              orderInfo.status_info[8].directions.refuse_reason;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    normal(id) {
      this.show8 = true;
      this.id = id;
    },
    normalOrder(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: "REFUND_FAILED_SHIPPING"
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show8 = false;
            window.location.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>