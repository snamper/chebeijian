<template>

  <div class="GoodsOrderDetail">
    <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>订单详情</p>
      </div>
    </div>
  </header>

    <div class="panel from_top">

      <!-- 头部订单状态 -->
      <div class="title top">

          <!-- 待付款 -->
          <p v-if="status == 1">
          <img :src="httpUrl+'status1.png'">
          <span>待付款</span>
          </p>

          <!-- 已取消 -->
          <p v-if="status == 5">
          <img :src="httpUrl+'status5.png'">
          <span>{{status_str}}</span>
          </p>

          <!-- 待确认 -->
          <p v-if="is_install == 1 && status == 2">
          <img :src="httpUrl+'status2.png'">
          <span>待确认</span>
          </p>

          <!-- 待发货 -->
          <p v-if="deliver_goods_status == 21 && status == 2 && is_install== 0">
          <img :src="httpUrl+'status3.png'">
          <span>{{deliver_goods_status_str}}</span>
          </p>

          <!-- 待收货 -->
          <p v-if="status == 2 && deliver_goods_status == 22 && is_install== 0">
          <img :src="httpUrl+'status4.png'">
          <!-- <span>{{deliver_goods_status_str}}</span> -->
          <span>待收货</span>
          </p>

          <!-- 待完成 -->
          <p v-if="status == 3">
          <img :src="httpUrl+'status3.png'">
          <span>待完成</span>
          </p>

          <!-- 已完成 -->
          <p v-if="status == 4">
          <img :src="httpUrl+'status6.png'">
          <span>{{status_str}}</span>
          </p>

          <!-- 退款申请中 -->
          <p v-if="status == 6">
          <img :src="httpUrl+'status7.png'">
          <span>退款申请中</span>
          </p>

          <!-- 退款成功 -->
          <p v-if="status == 7">
          <img :src="httpUrl+'status8.png'">
          <span>退款成功</span>
          </p>

          <!-- 退款失败 -->
          <p v-if="status == 8">
          <img :src="httpUrl+'status7.png'">
          <span>退款失败</span>
          </p>

      </div>
      <!-- end 头部订单状态 -->

      <!-- 未选择门店地址显示 -->
      <div class="address" v-if="is_install == 0">
        <div class="col-xs-1">
          <img :src="httpUrl+'dizhi.png'">
        </div>
        <div class="col-xs-11">
          <p class="info">收货人：{{contact_name}}<span>{{contact_phone}}</span></p>
          <p>收货地址：{{address}}</p>
        </div>
      </div>
      <!-- end 未选择门店地址显示 -->

      <!-- 选择了门店地址显示 -->
      <div class="address two" v-if="is_install == 1">
        <div class="col-xs-1">
          <img :src="httpUrl+'dizhi.png'">
        </div>
        <div class="col-xs-11">
          <p class="info">收货地址为安装门店地址</p>
        </div>
      </div>
      <!-- end 选择了门店地址显示 -->

      <!-- 订单商品 -->
      <div class="GoodsOrderList">
        <div class="tab-wrapper">
          <div class="goods" @click="goDetail()">
            <ul>
              <li>
                <div class="col-xs-3">
                  <img :src="product_image">
                </div>
                <div class="col-xs-9">
                  <p>{{product_name}}</p>
                  <p class="info">零件号：{{product_no}}</p>
                  <p class="price">￥{{product_unit_price}}<span>数量：{{pay_num}}</span></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- end 订单商品 -->

      <!-- 选择了门店安装服务显示 -->
      <div v-if="is_install == 1" @click="gostoresDetail">
      <div class="install">
        <p>安装服务 <span>¥{{install_price}}</span></p>
      </div>
      <div class="title store">
        <p class="gostore">{{company_name}} <span><img :src="httpUrl+'jtright.png'"></span></p>
      </div>
      </div>
      <!-- end 选择了门店安装服务显示 -->

      <!-- 发票 -->
      <div class="title invoice" v-if="opening_type == 0">
        <p>发票 <span>无</span></p>
      </div>
      <div class="title invoice" v-if="opening_type != 0">
        <p>发票 <span>{{invoice_title}}</span></p>
      </div>
      <!-- end 发票 -->

      <!-- 商品价格总计 -->
      <div class="title invoice">
        <p class="combined">商品总计 <span>{{pay_num}}件</span></p>
        <p class="combined">商品总价 <span>¥{{product_total_price}}</span></p>
        <!-- 选择了门店显示 -->
        <p class="combined" v-if="is_install == 1">安装费 <span>¥{{install_price}}</span></p>
        <p>总计 <span>¥{{total}}</span></p>
      </div>
      <!-- end 商品价格总计 -->

      <!-- 订单信息 -->
      <div class="title invoice">
        <p class="combined">订单编号：{{order_no}} </p>
        <p class="combined">{{status_update_at}} </p>
        <p class="combined">{{payment_at}} </p>
        <p class="combined">{{delieve_at}} </p>
        <p class="combined">{{collect_at}} </p>
        <p class="combined">{{complete_at}} </p>
      </div>
      <!-- end 订单信息 -->

      <!-- 已完成订单评价显示 -->
      <div class="title evaluation" v-if="evaluationStart > 0 ">
        <div class="col-xs-5">
          <p>评价</p>
        </div>
        <div class="col-xs-7">
          <div class="five-star">
            <div class="zhezhao"></div>
            <van-rate v-model="start2" :size="22" :count="5" viod-color="#DBDBDB" color="#FF2407" />
          </div>
        </div>
      </div>
      <!-- end 已完成订单评价显示 -->

    </div>
    <!-- end 订单信息 -->


    <!-- 底部按钮操作 -->
    <div class="GoodsOrderList">

      <!-- 待付款 -->
      <div class="tab-wrapper footer" v-if="status == '1'">
        <div class="button row">
          <button class="pay" @click="goPay(id)">付款</button>
          <button @click="cancel(id)">取消订单</button>
        </div>
      </div>

      <!-- 待确认 -->
      <div class="tab-wrapper footer" v-if="status == '2'">
      <div class="button row">
          <button class="pay" @click="refund(id)">退单</button>
      </div>
    </div>

      <!-- 待收货 -->
      <div class="tab-wrapper footer" v-if="deliver_goods_status == '22'">
      <div class="button row">
          <button class="pay" @click="ensure(id)">确认收货</button>
      </div>
    </div>

      <!-- 待确认 -->
      <div class="tab-wrapper footer" v-if="is_install == '1' && status == '3'">
      <div class="button row">
          <button class="pay" @click="complete(id)">确认完成</button>
      </div>
    </div>

      <!-- 已完成 -->
      <div class="tab-wrapper footer" v-if="status == '4' && is_install == '1' && evaluation_info==''">
      <div class="button row">
          <button class="pay" @click="goEvaluate(id)">去评价</button>
      </div>
    </div>

    <!-- 退款 -->
      <div class="tab-wrapper footer" v-if="status == '6' || status == '7'">
      <div class="button row">
          <button class="pay" @click="gotuikuan(id)">退款理由</button>
      </div>
    </div>

    <div class="tab-wrapper footer" v-if="status == '8'">
      <div class="button row">
          <button class="pay" @click="normal(id)" v-if="is_install == '0'">正常发货</button>
          <button class="pay" @click="normal(id)" v-if="is_install == '1'">正常接单</button>
          <button @click="gotuikuan(id)">拒绝理由</button>
      </div>
    </div>

    </div>

    <!-- end 底部按钮操作 -->



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
        <button class="cancel" @click="show2=flase">取消</button><button class="ensure" @click="cancelOrder(id)">确定</button>
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
        <button class="cancel" @click="show6=flase">取消</button><button class="ensure" @click="refundMoney(id)">确定</button>
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
        <button class="cancel" @click="show4=flase">取消</button>
        <button class="ensure" @click="evaluation(id)">确定</button>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";
import qs from "qs";
import myHeader from "@/components/Header";
import { Toast, List, Rate } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      star: "",
      start2: "",
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
      status_str: "",
      deliver_goods_status: "",
      deliver_goods_status_str: "",
      status: "",
      is_install: "",
      company_name: "",
      address: "",
      contact_name: "",
      contact_phone: "",
      product_image: "",
      product_name: "",
      product_no: "",
      product_unit_price: "",
      pay_num: "",
      install_price: "",
      opening_type: "",
      invoice_title: "",
      product_total_price: "",
      total: "",
      order_no: "",
      status_update_at: "",
      payment_at: "",
      delieve_at: "",
      collect_at: "",
      complete_at: "",
      evaluationStart: "",
      evaluation_info: "",
      returnReason: "",
      id: "",
      httpUrl: domain.iconUrl,
      companyid: "",
      create_at: ""
    };
  },
  components: {
    myHeader,
    [List.name]: List,
    [Toast.name]: Toast,
    [Rate.name]: Rate
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      var id = this.$route.query.id;
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
          console.log(1);
          console.log(response.data.data.info);
          console.log(1);
          _this.status_str = orderInfo.status_str;
          _this.evaluation_info = orderInfo.evaluation_info;
          _this.evaluationStart = orderInfo.evaluation_info.star;
          _this.start2 = orderInfo.evaluation_info.star / 2;
          _this.deliver_goods_status = orderInfo.deliver_goods_status;
          _this.deliver_goods_status_str = orderInfo.deliver_goods_status_str;
          _this.is_install = orderInfo.is_install;
          _this.company_name = orderInfo.company_name;
          _this.create_at = orderInfo.create_at;
          var company_name = _this.company_name;
          axios
            .post(
              _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000&company_name=" +
                company_name
            )
            .then(function(response) {
              var storeInfo = response.data.data.info[0];
              _this.companyid = storeInfo.id;
            })
            .catch(function(error) {
              console.log(error);
            });
          _this.address =
            orderInfo.province_name +
            orderInfo.city_name +
            orderInfo.district_name +
            orderInfo.address;
          _this.contact_name = orderInfo.contact_name;
          _this.contact_phone = orderInfo.contact_phone;
          _this.product_image = orderInfo.product_image;
          _this.product_name = orderInfo.product_name;
          _this.product_no = orderInfo.product_no;
          _this.product_unit_price = orderInfo.product_unit_price;
          _this.pay_num = orderInfo.pay_num;
          _this.install_price = orderInfo.install_price;
          _this.opening_type = orderInfo.opening_type;
          _this.invoice_title = orderInfo.invoice_title;
          _this.total = orderInfo.total;
          _this.product_total_price =
            orderInfo.product_unit_price * orderInfo.pay_num;
          _this.order_no = orderInfo.order_no;
          _this.status = orderInfo.status;
          if (_this.status == "6" || _this.status == "7") {
            _this.returnReason =
              orderInfo.status_info[6].directions.return_reason;
          } else if (_this.status == "8") {
            _this.returnReason =
              orderInfo.status_info[8].directions.refuse_reason;
          }
          var ordertime = response.data.data.info.status_info;

          console.log(ordertime);
          if (_this.is_install === "0") {
            if (ordertime[1].status === "1") {
              _this.status_update_at =
                "创建时间：" + response.data.data.info.create_at;
              // _this.status_update_at = "创建时间：" + _this.create_at;
            }
            if (ordertime[2].status === "2") {
              _this.payment_at = "付款时间：" + ordertime[2].create_at;
            }
            if (ordertime[22].status === "22") {
              _this.delieve_at = "发货时间：" + ordertime[22].create_at;
            }
            if (ordertime[23].status === "23") {
              _this.collect_at = "收货时间：" + ordertime[23].create_at;
            }
            if (ordertime[4].status === "4") {
              _this.complete_at = "确认完成时间：" + ordertime[4].create_at;
            }
          } else {
            if (ordertime[1].status === "1") {
              _this.status_update_at =
                "创建时间：" + response.data.data.info.create_at;
              // _this.status_update_at = "创建时间：" + _this.create_at;
            }
            if (ordertime[2].status === "2") {
              _this.payment_at = "付款时间：" + ordertime[2].create_at;
            }
            if (ordertime[4].status === "4") {
              _this.complete_at = "确认完成时间：" + ordertime[4].create_at;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancel() {
      this.show2 = true;
    },
    cancelDelete() {
      this.show9 = true;
    },
    refund() {
      this.show6 = true;
    },
    goEvaluate() {
      this.show4 = true;
    },
    gotuikuan() {
      this.show7 = true;
    },
    complete() {
      this.show3 = true;
    },
    ensure() {
      this.show5 = true;
    },
    goPay() {
      this.show = true;
    },
    normal() {
      this.show8 = true;
    },
    normalOrder(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    },
    modify(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    cancelOrder(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    refundMoney(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    completeOrder(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    toPay(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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

    goReadReview(id) {
      var id = _this.$route.query.id;
      this.$router.push({
        path: "/reviews/list",
        query: { order_id: id }
      });
    },
    //评分
    xinxin(id) {
      this.list.gcp_id = this.star;
    },
    evaluation(id) {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/evaluation?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            order_id: id,
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
    onClickLeft() {
      var _this = this;
      var active = _this.$route.query.active;
      this.$router.push({
        path: "GoodsOrderList",
        query: { active: active }
      });
    },
    gostoresDetail() {
      var _this = this;
      var id = _this.companyid;
      this.$router.push({
        path: "storesDetail",
        query: { id: id }
      });
    }
  }
};
</script>