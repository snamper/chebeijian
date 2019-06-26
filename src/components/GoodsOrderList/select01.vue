<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list" v-for="(order, index) in orderInfo" :key="index">
        <van-row class="title row">
          <van-col span="18">订单号：{{order.order_no}}</van-col>
          <!-- 订单状态 -->
          <van-col span="6" class="state" v-if="order.status == 1">待付款</van-col>
          <van-col span="6" class="state" v-if="order.status == 5">{{order.status_str}}</van-col>
          <van-col span="6" class="state" v-if="order.is_install == 1 && order.status == 2">待确认</van-col>
          <!-- <van-col span="6" class="state" v-if="order.is_install == 0 && order.status == 2">{{order.deliver_goods_status_str}}</van-col> -->
          <van-col span="6" class="state" v-if="order.is_install == 0 && order.status == 2">待发货</van-col>
          <van-col span="6" class="state" v-if="order.status == 3">待完成</van-col>
          <van-col span="6" class="state" v-if="order.status == 4">{{order.status_str}}</van-col>
          <van-col span="6" class="state" v-if="order.status == 6">退款申请中</van-col>
          <van-col span="6" class="state" v-if="order.status == 7">退款成功</van-col>
          <van-col span="6" class="state" v-if="order.status == 8">退款失败</van-col>
        </van-row>

        <!-- 订单商品 -->
        <div class="goods">
          <ul>
            <li>
              <router-link :to="{path:'GoodsOrderDetail',query:{id:order.id,active:0}}">
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
        <div class="button row" v-if="order.status == '1'">
          <button class="pay" @click="goPay(order.id)">付款</button>
          <button @click="cancel(order.id)">取消订单</button>
        </div>

        <!-- 待确认 -->
        <div class="button row" v-if="order.is_install == 1 && order.status == 2">
          <button class="pay" @click="refund(order.id)">退单</button>
        </div>
        <div class="button row" v-if="order.is_install == 0 && order.deliver_goods_status == 21 && order.status == 2">
          <button class="pay" @click="refund(order.id)">退单</button>
        </div>

        <!-- 待收货 -->
        <div class="button row" v-if="order.is_install == '0' && order.deliver_goods_status == '22'">
          <button class="pay" @click="ensure(order.id)">确认收货</button>
        </div>

        <!-- 待完成 -->
        <div class="button row" v-if="order.is_install == '1' && order.status == '3'">
          <button class="pay" @click="complete(order.id)">确认完成</button>
        </div>

        <!-- 已完成 -->
        <div class="button row" v-if="order.status == '4' && order.is_install == '1' && order.evaluation_info==''">
          <button class="pay" @click="goEvaluate(order.id)">去评价</button>
        </div>

        <!-- 退款 -->
        <div class="button row" v-if="order.status == '6' || order.status == '7'">
          <button class="pay" @click="Reason(order.id)">退款理由</button>
        </div>

        <div class="button row" v-if="order.status == '8'">
          <button v-if="order.is_install == '0'" class="pay" @click="normal(order.id)">正常发货</button>
          <button v-if="order.is_install == '1'" class="pay" @click="normal(order.id)">正常接单</button>
          <button @click="Reason(order.id)">拒绝理由</button>
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
        <button class="cancel" @click="show6=false">取消</button><button class="ensure" @click="refundMoney(id,index)">确定</button>
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

    <!-- 确认收货 -->
    <div class="mask" v-show="show5"></div>
    <div class="popup" v-show="show5">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>请确定是否确定收货？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show5=flase">取消</button><button class="ensure" @click="modify(id)">确定</button>
      </div>
    </div>

    <!-- 确认完成弹窗 -->
    <div class="mask" v-show="show3"></div>
    <div class="popup" v-show="show3">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="two">确认已收到商品<br>并且已安装完成吗？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show3=flase">取消</button><button class="ensure" @click="completeOrder(id)">确定</button>
      </div>
    </div>

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
            _this.apihttpUrl + "api/user/product/order/list?platform=weixin&version=1000&row=2&page=" +
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
    cancelDelete(id) {
      this.show9 = true;
      this.id = id;
    },
    refund(id) {
      this.show6 = true;
      this.id = id;
    },
    goEvaluate(id) {
      this.show4 = true;
      this.id = id;
    },
    complete(id) {
      this.show3 = true;
      this.id = id;
    },
    ensure(id) {
      this.show5 = true;
      this.id = id;
    },
    goPay(id) {
      this.show = true;
      this.id = id;
    },
    modify(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: "23"
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show5 = false;
            window.location.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancelOrder(orderId) {
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
    refundMoney(orderId, index) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: "6",
            return_reason: this.b_content
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show6 = false;
            window.location.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    completeOrder(orderId) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: orderId,
            operate_flag: "4"
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            _this.show3 = false;
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
      var _this = this;
      _this.show8 = true;
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
        })
        .catch(function(error) {
          console.log(error);
        });
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
