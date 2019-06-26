<template>
  <div class="OrderConfirm">
    <div class="GoodsOrderDetail">
      <div class="noticebody">
        <header class="app-header navbar">
          <div class="top-head row">
            <div class="col-xs-12">
              <img class="back" :src="httpUrl+'/goback.png'" @click="onClickLeft">
              <p>订单确认</p>
            </div>
          </div>
        </header>
      </div>
      <div class="panel from_top">
        <!-- 未选择门店地址显示 -->
        <div class="address" v-if="addressShow">
          <div class="col-xs-1">
            <img :src="httpUrl+'dizhi.png'">
          </div>
          <div class="col-xs-11" @click="toAddress">
            <p class="info">
              收货人：{{address_list.contact_name}}
              <span>{{address_list.contact_phone}}</span>
            </p>
            <p>收货地址：{{address_list.province_name}}{{address_list.city_name}}{{address_list.district_name}}{{address_list.address}}</p>
          </div>
        </div>
        <!-- end 未选择门店地址显示 -->
        <!-- 选择了门店地址显示 -->
        <div class="address two" v-if="noAddressShow">
          <div class="col-xs-1">
            <img :src="httpUrl+'dizhi.png'">
          </div>
          <div class="col-xs-11">
            <p class="info">收货地址为安装门店地址</p>
          </div>
        </div>
        <!-- end 选择了门店地址显示 -->
        <!-- 未设置地址显示 -->
        <div class="address two" v-if="noaddress">
          <div class="col-xs-1">
            <img :src="httpUrl+'dizhi.png'">
          </div>
          <div class="col-xs-8">
            <p class="info">您还没有收货地址</p>
          </div>
          <div class="col-xs-3" @click="toAddress">
            <p>去添加</p>
          </div>
          <img class="right" :src="httpUrl+'jtright.png'">
        </div>
        <!-- end 未设置地址显示 -->
        <!-- 订单商品 -->
        <div v-for="(item,index) in products_list" :key="index">
          <div class="GoodsOrderList">
            <div class="tab-wrapper">
              <div class="goods">
                <ul>
                  <li>
                    <div class="col-xs-3">
                      <img :src="item.image_path">
                    </div>
                    <div class="col-xs-9">
                      <p>{{item.product_name}}</p>
                      <p class="info">零件号：{{item.product_no}}</p>
                      <p class="price">
                        ￥{{item.user_price}}
                        <span class="steper">
                          <span>x{{item.pay_num}}</span>
                        </span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- end 订单商品 -->
          <!-- 选择了门店安装服务显示 -->
          <div class="install" v-if="item.is_install==1">
            <div class="bot">
              <p>
                安装服务
                <span>¥{{item.install_price}}</span>
              </p>
            </div>
          </div>
          <div class="title store" v-if="item.is_install==1">
            <p class="gostore" @click="choseStore">
              {{item.federation_store_info.company_name}}
              <i>
                <img :src="httpUrl+'jtright.png'">
              </i>
            </p>
          </div>
          <div class="gray-border" style="height:0.28rem;" v-if="item.is_install!=1"></div>
        </div>
        <!-- end 选择了门店安装服务显示 -->
        <!-- 发票 -->
        <div>
          <div class="install two">
            <p>
              发票
              <label>
                <input class="mui-switch" type="checkbox" v-model="checked">
              </label>
            </p>
          </div>
          <div class="title choose" @click="goInvoiceList" v-if="checked && !noInvoice">
            <p class="gostore">
              发票抬头
              <span>{{invoice_list.invoice_title}}</span>
              <i>
                <img :src="httpUrl+'jtright.png'">
              </i>
            </p>
          </div>
          <div class="title choose" @click="goInvoiceList" v-if="noInvoice">
            <p class="gostore">
              您还没有发票
              <span>去添加</span>
              <i>
                <img :src="httpUrl+'jtright.png'">
              </i>
            </p>
          </div>
        </div>
        <!-- end 发票 -->
        <!-- 商品价格总计 -->
        <div class="title invoice">
          <p class="combined">
            商品总计
            <span>{{productNum}}件</span>
          </p>
          <p class="combined">
            商品总价
            <span>¥{{productTotal.toFixed(2)}}</span>
          </p>
          <!-- 选择了门店显示 -->
          <p class="combined" v-if="installTotal>0">
            安装费
            <span>¥{{installTotal.toFixed(2)}}</span>
          </p>
          <p>
            总计
            <span>¥{{orderTotal.toFixed(2)}}</span>
          </p>
        </div>
        <!-- end 商品价格总计 -->
      </div>
      <!-- end 订单信息 -->
      <!-- 底部按钮操作 -->
      <div class="GoodsOrderList">
        <div class="tab-wrapper footer">
          <div class="button row">
            <button @click="tijiao">提交订单</button>
          </div>
        </div>
      </div>
      <!-- end 底部按钮操作 -->
    </div>
    <!-- 付款弹框 -->
    <div class="mask" v-show="show"></div>
    <div class="popup pay" v-show="show">
      <div class="popup_head">
        <img :src="httpUrl+'close.png'" @click="show=false">
      </div>
      <!-- <div class="popup_content">
        <div class="col-xs-1">
          <img :src="httpUrl+'zhifubao.png'">
        </div>
        <div class="col-xs-11">
          <p>支付宝支付</p>
        </div>
        <div class="radiobox">   
          <input type="radio" id="quest01-chose02" name="quest01" checked="checked" />
           <span></span>
        </div>
      </div>-->
      <div class="popup_content">
        <div class="col-xs-1">
          <img :src="httpUrl+'weixin.png'">
        </div>
        <div class="col-xs-11">
          <p>微信支付</p>
        </div>
        <div class="radiobox">
          <input type="radio" name="quest01" checked="checked">
          <span></span>
        </div>
      </div>

      <div class="button">
        <button @click="wechatPay">付款</button>
      </div>
    </div>
    <!-- end 付款弹框 -->
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import myHeader from "@/components/Header";
import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      show: false,
      checked: false,
      ordergood: "",
      productTotal: 0,
      orderTotal: 0,
      addressShow: true,
      noAddressShow: false,
      noaddress: false,
      noInvoice: true,
      installTotal: 0,
      address_list: [],
      invoice_list: [],
      products_list: [],
      is_user_select_address: 0,
      httpUrl: domain.iconUrl,
      productNum: 0,
      companyname: "",
      companyid: ""
    };
  },
  components: {
    myHeader,
    [Toast]: Toast
  },
  created() {
    console.log(window.localStorage.getItem("ensureOrderData"));
    this.initData();
  },
  methods: {
    goInvoiceList() {
      this.$router.push({
        path: "InvoiceList",
        query: { orderFrom: "orderFrom" }
      });
    },
    choseStore() {
      var _this = this;
      var id = _this.companyid;
      this.$router.push({
        path: "storesDetail",
        query: { id: id }
      });
    },
    // 初始化数据
    initData() {
      // 判断用户是否选择发票
      if (this.$route.query.invoiceId) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.totalPrice = 0;
      var _this = this;
      // 从发票返回订单页判断
      if (_this.$route.query.Check == 1) {
        _this.checked = true;
      }
      // 获取缓存数据
      var ensureOrderData = JSON.parse(
        window.localStorage.getItem("ensureOrderData")
      ); // 将获取到的字符串类型转换成对象类型
      _this.ordergood = ensureOrderData;
      // window.localStorage.setItem("totalPrice",_this.totalPrice)
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/product/order/page?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            products: window.localStorage.getItem("ensureOrderData")
          })
        )
        .then(function(response) {
          console.log(response.data.data);
          if (response.data.errorCode === 0) {
            // 默认地址
            // 默认发票
            _this.invoice_list = response.data.data.invoice_list[0];
            _this.products_list = response.data.data.product_list;
            if (response.data.data.product_list[0].federation_store_info) {
              _this.companyname =
                response.data.data.product_list[0].federation_store_info.company_name;
              var companyname = _this.companyname;

              axios
                .post(
                  _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000&company_name=" +
                    companyname
                )
                .then(function(response) {
                  var storeInfo = response.data.data.info[0];
                  _this.companyid = storeInfo.id;
                })
                .catch(function(error) {
                  console.log(error);
                });
            }

            _this.orderTotal = parseFloat(response.data.data.order_total) ;
            _this.productTotal = parseFloat(response.data.data.product_total);
            _this.installTotal = parseFloat(response.data.data.install_total);
            // 计算商品总数
            var productList = response.data.data.product_list;
            for (var i = 0; i < productList.length; i++) {
              _this.productNum += parseInt(productList[i].pay_num);
            }

            _this.is_user_select_address =
              response.data.data.is_user_select_address;
            // 判断是否需要选择地址
            if (response.data.data.is_user_select_address == 1) {
              _this.address_list = response.data.data.address_list[0];
              _this.addressShow = true;
              _this.noAddressShow = false;
              // 判断用户是否有地址
              if (response.data.data.address_list.length == 0) {
                _this.noaddress = true;
                _this.addressShow = false;
              } else {
                _this.addressShow = true;
                _this.noaddress = false;
              }
            } else {
              _this.addressShow = false;
              _this.noAddressShow = true;
              _this.noaddress = false;
            }
            // 判断用户是都有发票
            if (response.data.data.invoice_list.length == 0) {
              _this.checked = false;
              _this.noInvoice = true;
            } else {
              _this.noInvoice = false;
            }
          } else {
            Toast(response.data.message.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 前往地址列表
    toAddress() {
      this.$router.push({
        path: "AddressList",
        query: { orderFrom: "orderFrom" }
      });
    },
    tijiao(){
      var _this = this;
      if(_this.noaddress == true){
        Toast('请添加收货地址')
      }else if(_this.checked == true && _this.noInvoice==true){
        Toast('请添加发票')
      }else{
        _this.show=true;
      }
    },
    wechatPay() {
      var _this = this; 
      console.log(window.localStorage.getItem("token"))
      console.log(window.localStorage.getItem("ensureOrderData"))
      console.log(_this.address_list.id)
      console.log(window.localStorage.getItem("operation_source"))
      // 当有地址情况下
      if (_this.is_user_select_address == 1) {
        // 没选择发票
        if (_this.checked == false) {
          axios
            .post(
              _this.apihttpUrl + "api/user/product/order/create?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                products: window.localStorage.getItem("ensureOrderData"),
                address_id: _this.address_list.id,
                opening_type: 0,
                invoice_id: "",
                payment_method: 2,
                operation_source: window.localStorage.getItem("operation_source")
              })
            )
            .then(function(response) {
              console.log(response.data.data);
              if (response.data.errorCode === 0) {
                window.localStorage.removeItem("operation_source");
                Toast(response.data.message.message);
                // _this.payMent(response.data.data.order_info.order_id);
                console.log(response.data.data.pay_info.pay);
                window.location.href = response.data.data.pay_info.pay;
              } else {
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          // 选择发票
          axios
            .post(
              _this.apihttpUrl + "api/user/product/order/create?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                products: window.localStorage.getItem("ensureOrderData"),
                address_id: _this.address_list.id,
                opening_type: _this.invoice_list.opening_type,
                invoice_id: _this.invoice_list.id,
                payment_method: 2,
                operation_source: window.localStorage.getItem("operation_source")
              })
            )
            .then(function(response) {
              console.log(response.data.data);
              if (response.data.errorCode === 0) {
                window.localStorage.removeItem("operation_source");
                Toast(response.data.message.message);
                console.log(response.data.data.pay_info.pay);
                window.location.href = response.data.data.pay_info.pay;
              } else {
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      } else {
        // 没选择发票
        if (_this.checked == false) {
          axios
            .post(
              _this.apihttpUrl + "api/user/product/order/create?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                products: window.localStorage.getItem("ensureOrderData"),
                opening_type: "",
                invoice_id: "",
                payment_method: 2,
                operation_source: window.localStorage.getItem("operation_source")
              })
            )
            .then(function(response) {
              console.log(response.data.data);
              if (response.data.errorCode === 0) {
                window.localStorage.removeItem("operation_source");
                Toast(response.data.message.message);
                console.log(response.data.data.pay_info.pay);
                window.location.href = response.data.data.pay_info.pay;
              } else {
                // Toast(response.data.message.message);
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          //选择发票
          axios
            .post(
              _this.apihttpUrl + "api/user/product/order/create?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                products: window.localStorage.getItem("ensureOrderData"),
                opening_type: _this.invoice_list.opening_type,
                invoice_id: _this.invoice_list.id,
                payment_method: 2,
                operation_source: window.localStorage.getItem("operation_source")
              })
            )
            .then(function(response) {
              console.log(response.data.data);
              if (response.data.errorCode === 0) {
                window.localStorage.removeItem("operation_source");
                Toast(response.data.message.message);
                console.log(response.data.data.pay_info.pay);
                window.location.href = response.data.data.pay_info.pay;
              } else {
                // Toast(response.data.message.message);
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    },
    onClickLeft() {
      if (this.$route.query.invoiceId) {
        window.history.go(-3);
      } else {
        window.history.go(-1);
      }
    },
    // 获取详细支付信息
    payMent(orderNo) {
      axios
        .get(
          _this.apihttpUrl + "service/pay/getPayOrderInfo?order_no=" +
            orderNo
        )
        .then(function(response) {
          console.log(response);
          if (response.data.errorCode === 0) {
            Toast(response.data.message.message);
          } else {
            Toast(response.data.message.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>