<template>
    <div class="CarInsuranceList">
      <!-- 头部 -->
      <div class="top-head row listTop " >
        <div class="col-xs-1">
          <img class="back" :src="httpUrl+'modal/goback.png'" @click="onClickLeft">
        </div>
        <div class="col-xs-10 topBtn" >
          <div class="tab">
            <p class="active title" @click="toUpkeep">预约单</p>
            <p @click="toInsurance">保险单</p>
          </div>
       </div>
       <div class="col-xs-1"></div>
      </div>
     <!-- 预约列表 -->
    <div v-if="isHas" class="from_top">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
     <div class="insuranceList" v-for="(order, index) in orderInfo" :key="index">
       <div class="shadow"></div>
        <div class="content1">
          <p>预约保险单号：{{order.order_no}}</p>
          <p>预约对应车辆：{{order.license_plate_number}}</p>
          <p>预约车险生效时间：{{order.insurance_start_date}}~{{order.insurance_end_date}}</p>
        </div>
        <div class="paystatus">
          <p>{{order.create_at}}</p>
          <span>{{order.status_str}}</span>
        </div>
       <div class="price">
         <span>￥{{order.total}}</span>
         <div class="listbtn" v-if="order.status == 1">
            <button class="pay" @click="fukuan(order.id)">去付款</button>
             <button @click="quxiao(order.id)">取消订单</button>
         </div>
         <div class="listbtn" v-if="order.status == 2">
            <button class="pay" @click="baoyang(order.id,order.user_vehicle_id,order.count_user_maintain_order_valid)">去保养</button>
            <button @click="tuikuan(order.id)">退款</button>
         </div>
          <div class="listbtn" v-if="order.status == 5">
            <button class="pay" @click="sc(order.id)">删除</button>
         </div>
       </div>
     </div>
     </van-list>
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
        <button @click="fukuan1(id)">付款</button>
      </div>

    </div>
    <!-- end 付款弹框 -->

    <!-- 取消订单弹窗 -->
    <div class="mask" v-show="show2"></div>
    <div class="popup" v-show="show2">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>确认取消该订单？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show2=flase">取消</button><button class="ensure" @click="quxiao1(id)">确定</button>
      </div>
    </div>

    <!-- 退单弹窗 -->
    <div class="mask" v-show="show3"></div>
    <div class="popup" v-show="show3">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="title">请输入退款原因</p>
        <van-field v-model="b_content" type="textarea" placeholder="请输入" />
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show3=flase">取消</button><button class="ensure" @click="refundMoney(id)">确定</button>
      </div>
    </div>

    <!-- 删除订单弹窗 -->
    <div class="mask" v-show="show4"></div>
    <div class="popup" v-show="show4">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>确认删除该订单？</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show4=flase">取消</button><button class="ensure" @click="sc1(id)">确定</button>
      </div>
    </div>

    <div class="no-data" v-if="isEmpty">
        <img :src="httpUrl+'modal/CarInsuranceList.png'" alt="">
        <p>暂时没有订单哦</p>
    </div>


     <!-- 消息弹框 -->
    <div class="mask" v-show="emptyShow"></div>
    <div class="popup" v-show="emptyShow">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>正在开发中，敬请期待！</p>
      </div>
      <div class="popuo_footer">
        <button class="ensure but" @click="emptyShow=false">确定</button>
      </div>
    </div>

    </div>

</template>



<script>
import "../../style/common/css/modal.scss";
import { List, Toast } from "vant";
import axios from "axios";
import qs from "qs";
export default {
  components: {
    List,
    Toast
  },
  data() {
    return {
      apihttpUrl: domain.testUrl,
      isHas: true,
      isEmpty: false,
      show: false,
      show2: false,
      show3: false,
      show4: false,
      httpUrl: domain.iconUrl,
      loading: false,
      finished: false,
      page: "1",
      orderInfo: [],
      list: [],
      emptyShow: false
    };
  },
  components: {},
  created() {
    this.onLoad();
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/CarInsurance"
      });
    },
    toInsurance() {
      this.emptyShow = true;
      // this.$router.push({
      //   path: "/InsuranceList"
      // });
    },
    toUpkeep() {
      this.isEmpty = false;
      this.isHas = true;
    },
    tuikuan(id) {
      this.show3 = true;
      this.id = id;
      this.onLoad();
    },
    baoyang(id, carid, valid) {
      if (valid == "4") {
        Toast("您的保养次数已用完");
      } else {
        var id = id;
        var carid = carid;
        this.$router.push({
          path: "/UpkeepStore",
          query: {
            order_id: id.toString(),
            car_id: carid.toString()
          }
        });
      }
    },
    refundMoney(id) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id,
            transfer_reason: _this.b_content,
            status: 5
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          console.log(response.data);
          if (response.data.errorCode === 0) {
            _this.show3 = false;
            window.location.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    fukuan(id) {
      this.show = true;
      this.id = id;
    },
    quxiao(id) {
      this.show2 = true;
      this.id = id;
    },
    quxiao1(id) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id,
            cancel_reason: "理由？",
            status: 3
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          console.log(response.data);
          if (response.data.errorCode === 0) {
            _this.show2 = false;
            window.location.reload();
          } else {
            _this.show2 = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    fukuan1(id) {
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id,
            payment_method: 2,
            status: 1
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          console.log(response.data);
          if (response.data.errorCode === 0) {
            window.location.href = response.data.data.pay;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    sc(id) {
      this.show4 = true;
      this.id = id;
    },
    sc1(id) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/updateStatus?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id,
            status: -1
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          console.log(response.data);
          if (response.data.errorCode === 0) {
            _this.show4 = false;
            window.location.reload();
          } else {
            _this.show4 = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onLoad() {
      var _this = this;
      var page = _this.page;
      setTimeout(() => {
        axios
          .post(
            _this.apihttpUrl + "api/user/userInsuranceOrder/?platform=weixin&version=1000&row=15&page=" +
              page,
            qs.stringify({
              token: window.localStorage.getItem("token"),
              is_reservation: 1
            })
          )
          .then(function(response) {
            var orderInfo = response.data.data.info;
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


