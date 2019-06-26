<template>
  <div class="GoodsDetail">
    <header class="app-header navbar">
      <div class="top-head row">
        <div class="col-xs-12">
          <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
          <p>商品详情</p>
          <!-- 分享 -->
          <img class="share" :src="httpUrl+'share.png'" @click="show2=true">
        </div>
      </div>
    </header>
    <!-- 商品图片轮播展示 -->
    <div class="advert from_top">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in goodsInfo.show_images_arr" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
     <!-- 商品图片轮播展示 -->

    <div class="title">
      <h4>{{goodsInfo.product_name}}</h4>
      <p class="info">{{goodsInfo.introduction}}</p>
      <div class="col-xs-10">
        <p>零件号：{{goodsInfo.product_no}}</p>
        <p class="price">¥{{goodsInfo.user_price}}</p>
      </div>
      <div class="col-xs-2" @click="addCollect()" v-if="noCollect">
        <img :src="httpUrl+'type/noheart.png'" alt="">
        <p>收藏</p>
      </div>
      <div class="col-xs-2" @click="delCollect()" v-if="isCollect">
        <img :src="httpUrl+'type/heart.png'" alt="">
        <p>已收藏</p>
      </div>

    </div>
    <div class="shadow"></div>

    <div class="specification">
      <p class="OrderConfirm">购买数量
        <span class="steper">
          <button @click="bindMinus()">-</button>
          <input type="text" :value="pay_num">
          <button @click="bindPlus()">+</button>
        </span>
      </p>
    </div>
    <div class="specification bot" v-if="install">
      <p class="OrderConfirm">门店安装
        <label><input class="mui-switch" type="checkbox" v-model="checked" ></label>
      </p>
    </div>
    <div v-if="this.$route.query.company_name">
    <!-- 选择的店铺 -->
    <div class="specification" v-if="checked">
      <div class="col-xs-2">
        <img :src="storeInfo.door_head_image_path" alt="">
      </div>
      <div class="col-xs-10">
        <p>{{storeInfo.company_name}}</p>
        <p><img :src="httpUrl+'address.png'" alt=""><span>{{storeInfo.province_name}}{{storeInfo.city_name}}{{storeInfo.district_name}}{{storeInfo.address}}</span></p>
      </div>
    </div>
    <div class="specification" v-if="checked">
      <p class="OrderConfirm">安装费用：<span class="price">¥{{installPrice}}</span>
      </p>
    </div>
    </div>
    <div class="specification two" v-if="checked">
      <p class="OrderConfirm" @click="goChooseStore">
        当前共有{{federation_store.length}}家门店提供安装服务
        <span><img data-v-086081d3="" :src="httpUrl+'jtright.png'" alt=""></span>
      </p>
    </div>
    <div class="shadow"></div>


    <div class="tab-wrapper">

      <!-- 订单状态tab -->
      <ul class="tab-menu row">
        <li v-for="(item,index) in tabs" :key="index"
        @click="toggleTabs(index)"
        :class="{active:index==nowIndex}">{{item.name}}</li>
      </ul>
      <!-- end 订单状态tab -->

      <div class="tab-content">

        <!-- 商品内容 -->
        <div class="main">
          <!-- 商品参数 -->
          <div class="divTab" v-show="nowIndex===0">
            <div class="detail">
              <p>替换件：{{goodsInfo.replacement_product_no}} </p>
              <p>编码模块：{{goodsInfo.module_coding}}</p>
              <p>层次：{{goodsInfo.gradation}}</p>
              <p>规格：{{goodsInfo.specification}} </p>
              <p>款式：{{goodsInfo.style}} </p>
              <p>备注：{{goodsInfo.remarks}} </p>
              <p>长度：{{goodsInfo.length}}</p>
              <p>高度：{{goodsInfo.height}}</p>
              <p>毛重：{{goodsInfo.gross_weight}}</p>
              <p>净重：{{goodsInfo.net_weight}}</p>
              <p>认证标志：{{goodsInfo.certification_flag}}</p>
              <p>包装规格：{{goodsInfo.packing_specification}}</p>
            </div>
          </div>
          <!-- 详细信息 -->
          <div class="divTab" v-show="nowIndex===1">
            <div class="detail" v-html="goodsInfo.content">
            </div>
          </div>
          <!-- 适配车型 -->
          <div class="divTab" v-show="nowIndex===2">
            <div class="detail">
              <div class="cartHead">
                <ul>
                  <li>品牌</li>
                  <li>车系</li>
                  <li>年款</li>
                  <li>车型</li>
                </ul>
              </div>
              <div class="cartListItem">
                <ul v-for="(item,index) in cartModel" :key="index">
                  <li>{{item.vehicle_model.brand_name}}</li>
                  <li>{{item.vehicle_model.family_name}}</li>
                  <li>{{item.vehicle_model.yearPattern}}</li>
                  <li>{{item.vehicle_model.vehicleName}}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        <!-- end 商品内容 -->
      </div>
    </div>

    <div class="footer">
      <div class="col-xs-4">
        <div class="col-xs-6" @click="show3=true">
          <p><img data-v-086081d3="" :src="httpUrl+'zixun.png'" alt=""></p>
          <p>电话咨询</p>
        </div>
        <div class="col-xs-6" @click="show4=true">
          <p><img data-v-086081d3="" :src="httpUrl+'kefu.png'" alt=""></p>
          <p>在线客服</p>
        </div>
      </div>
      <div class="col-xs-8">
        <div class="col-xs-6" @click="addCar">
          <button class="cart">加入购物车</button>
        </div>
        <div class="col-xs-6" @click="goOrderConfirm">
          <button class="buy">立即购买</button>
        </div>
      </div>

    </div>

    <!-- 加入购物车弹窗 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <img :src="httpUrl+'type/chenggong.png'" alt="">
        <p>添加到购物车成功</p>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show=false">继续采购</button><button class="ensure" @click="goCartList">去购物车结算</button>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <div class="mask" @click="show2=!show2" v-show="show2"></div>

    <div class="OrderConfirm">
      <div class="popup share" v-show="show2">
        <img :src="httpUrl+'share5.png'" alt="">
      </div>
    </div>

    <!-- 拨打电话弹窗 -->
    <div class="mask" v-show="show3"></div>
    <div class="call">
    <div class="popup" v-show="show3">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="two">拨打咨询电话？</p>
        <p>400-1024-5323</p>
      </div>
      <div class="popuo_footer">
         <a href="tel:400-1024-5323">
        <button class="ensure but" @click="show3=false">确定</button>
         </a>
      </div>
      </div>
    </div>

    <!-- 在线咨询弹窗 -->
    <div class="mask" v-show="show4"></div>
    <div class="call">
    <div class="popup" v-show="show4">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p class="two">拨打咨询电话？</p>
        <p>0553-2875777</p>
      </div>
      <div class="popuo_footer">
         <a href="tel:0553-2875777">
        <button class="ensure but" @click="show4=false">确定</button>
         </a>
      </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import myHeader from "@/components/Header";
import wx from "weixin-js-sdk";
import { Swipe, SwipeItem, install } from "vant";
import axios from "axios";
import qs from "qs";
// 引用vant轻提示
import { Toast } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      show: false,
      show2: false,
      show3: false,
      show4: false,
      nowIndex: 0, //默认第一个tab为激活状态
      tabs: [
        {
          name: "商品参数"
        },
        {
          name: "详细信息"
        },
        {
          name: "适配车型"
        }
      ],
      pay_num: "1",
      iscur: 0,
      checked: false,
      goodsInfo: {},
      federation_store: [],
      storeInfo: {},
      cartModel: [],
      noCollect: true,
      isCollect: false,
      install: true,
      installPrice: "0.00"
    };
  },
  components: {
    myHeader,
    Toast,
    [Swipe]: Swipe,
    [SwipeItem]: SwipeItem
  },
  created() {
    this.initData();
    this.getCarModel();
  },
  methods: {
    /*点击减号 */
    bindMinus() {
      if (this.pay_num <= 1) {
        return;
      } else {
        this.pay_num--;
        console.log(this.pay_num);
      }
    },
    /*点击加号 */
    bindPlus() {
      this.pay_num++;
      console.log(this.pay_num);
    },
    onClickLeft() {
      window.history.go(-1);
    },
    goCartList() {
      this.$router.push({ path: "CartList" });
    },
    // 立即购买方法
    goOrderConfirm() {
      var _this = this;
      // 判断该商品是否有库存
      if (_this.goodsInfo.stock > 0) {
        // 判断安装状态是否为选中
        // 没选中
        if (_this.checked == false) {
          var product = [];
          product.push({
            product_id: _this.goodsInfo.id,
            product_name: _this.goodsInfo.product_name,
            pay_num: _this.pay_num,
            federation_store_id: "",
            is_install: "0",
            operation_source: "product_info"
          });
          axios
            .post(
              _this.apihttpUrl + "api/user/product/order/verify?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                products: JSON.stringify(product)
              })
            )
            .then(function(response) {
              console.log(response.data);
              if (response.data.errorCode === 0) {
                window.localStorage.setItem("operation_source", "product_info");
                window.localStorage.setItem(
                  "ensureOrderData",
                  JSON.stringify(product)
                );
                _this.$router.push({
                  path: "OrderConfirm"
                  // query: { operation_source: "product_info" }   //考虑未登录状态跳转回来路由问题，将其本地存储
                });
              } else if (response.data.errorCode === -1) {
                window.localStorage.setItem("operation_source", "product_info");
                Toast("请先登录");
                setTimeout(() => {
                  _this.$router.replace({
                    path: "/login",
                    query: {
                      redirect: _this.$router.currentRoute.fullPath,
                      to: "OrderConfirm"
                    }
                  });
                }, 1000);
              } else {
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          // 安装状态选中
          // 选中状态下判断路由中是否有门店id
          if (_this.$route.query.company_name) {
            var product = [];
            product.push({
              product_id: _this.goodsInfo.id,
              product_name: _this.goodsInfo.product_name,
              pay_num: _this.pay_num,
              federation_store_id: _this.storeInfo.id,
              is_install: _this.goodsInfo.is_install,
              operation_source: "product_info"
            });
            axios
              .post(
                _this.apihttpUrl + "api/user/product/order/verify?platform=weixin&version=1000",
                qs.stringify({
                  token: window.localStorage.getItem("token"),
                  products: JSON.stringify(product)
                })
              )
              .then(function(response) {
                console.log(response.data);
                if (response.data.errorCode === 0) {
                  window.localStorage.setItem(
                    "operation_source",
                    "product_info"
                  );
                  window.localStorage.setItem(
                    "ensureOrderData",
                    JSON.stringify(product)
                  );
                  _this.$router.push({
                    path: "OrderConfirm"
                    // query: { operation_source: "product_info" }
                  });
                } else if (response.data.errorCode === -1) {
                  window.localStorage.setItem(
                    "operation_source",
                    "product_info"
                  );
                  Toast("请先登录");
                  setTimeout(() => {
                    _this.$router.replace({
                      path: "/login",
                      query: {
                        redirect: _this.$router.currentRoute.fullPath,
                        to: "OrderConfirm"
                      }
                    });
                  }, 1000);
                } else {
                  Toast(response.data.message.message);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            // 若没有门店id,则提示去选择
            Toast("请您选择安装门店");
          }
        }
      } else {
        // 如果无库存，提示
        Toast("商品库存不足");
      }
    },
    // 跳转选择门店页面方法，需要带商品id参数。
    goChooseStore() {
      this.$router.push({
        path: "ChooseStore",
        query: { id: this.$route.query.id }
      });
    },
    // 改变tab方法
    toggleTabs: function(index) {
      this.nowIndex = index;
    },
    // 初始化页面数据
    initData() {
      var id = this.$route.query.id;
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/product/productInfo?platform=weixin&version=1000&id=" +
            id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode === 0) {
            _this.goodsInfo = response.data.data.info;
            // 初始化可供选择的门店数
            _this.federation_store = response.data.data.federation_store;
            console.log(response.data.data);
            if (_this.goodsInfo.select_is_user_collection == 1) {
              _this.noCollect = false;
              _this.isCollect = true;
            } else {
              _this.noCollect = true;
              _this.isCollect = false;
            }
            // 判断是否是安装商品，自动选择安装按钮状态
            if (response.data.data.info.is_install == 1) {
              _this.checked = true;
            } else {
              _this.checked = false;
            }
            // 判断是否为安装
            // if (_this.goodsInfo.is_install == 0) {
            //   _this.install = false;
            //   _this.checked = false;
            // } else {
            //   _this.install = true;
            // }
            // 判断如果商品安装列表为空的话，隐藏安装按钮
            if (_this.federation_store == "") {
              _this.install = false;
              _this.checked = false;
            } else {
              _this.install = true;
            }
            // console.log(_this.goodsInfo.select_is_user_collection);
            // 若路由中有门店id，初始化显示门店
            _this.getStoreInfo();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 添加到购物车方法
    addCar() {
      var _this = this;
      // 判断安装按钮是否为选中状态
      // 是
      if (_this.checked == true) {
        // 则路由中必须有门店id
        if (this.$route.query.company_name) {
          axios
            .post(
              _this.apihttpUrl + "api/user/shoppingCart/add?platform=weixin&version=1000",
              qs.stringify({
                id: "",
                product_id: _this.$route.query.id,
                pay_num: _this.pay_num,
                federation_store_id: _this.storeInfo.id,
                token: window.localStorage.getItem("token")
              })
            )
            .then(function(response) {
              console.log(response.data.message);
              if (response.data.errorCode === 0) {
                // 显示加入购物车成功弹窗
                _this.show = true;
              } else if (response.data.errorCode === -1) {
                Toast("请先登录");
                _this.$router.push({
                  path: "/login",
                  query: {
                    redirect: _this.$router.currentRoute.fullPath
                  }
                });
              } else {
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          // 若没有门店id,则提示去选择
          Toast("请选择安装门店");
        }
      } else {
        // 若安装按钮为未选中
        axios
          .post(
            _this.apihttpUrl + "api/user/shoppingCart/add?platform=weixin&version=1000",
            qs.stringify({
              id: "",
              product_id: _this.$route.query.id,
              pay_num: _this.pay_num,
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            console.log(response.data.data);
            if (response.data.errorCode === 0) {
              _this.show = true;
            } else if (response.data.errorCode === -1) {
              Toast("请先登录");
              setTimeout(() => {
                _this.$router.push({
                  path: "/login",
                  query: {
                    redirect: _this.$router.currentRoute.fullPath
                  }
                });
              }, 1000);
            } else {
              Toast(response.data.message.message);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    // 获取推荐门店信息
    getStoreInfo() {
      // 从路由中获取门店名称
      var name = this.$route.query.company_name;
      if (name) {
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/product/getFederationStoreByProductId?platform=weixin&version=1000&company_name=" +
              name +
              "&product_id=" +
              _this.$route.query.id,
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            console.log(response.data.data);
            if (response.data.errorCode === 0) {
              _this.storeInfo = response.data.data.info[0];
              // 判断门店等级,对应商品安装价格

              if (_this.storeInfo.select_store_level == 1) {
                _this.installPrice = _this.goodsInfo.city_install_price_1;
              } else if (_this.storeInfo.select_store_level == 2) {
                _this.installPrice = _this.goodsInfo.city_install_price_2;
              } else {
                _this.installPrice = _this.goodsInfo.city_install_price_3;
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    // 获取适配车型
    getCarModel() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/product/getVehicleMsgByProductId?platform=weixin&version=1000&id=" +
            _this.$route.query.id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            _this.cartModel = response.data.data.vehicles;
            console.log(_this.cartModel);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //收藏商品
    addCollect() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userCollection/add?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            product_id: _this.$route.query.id
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            Toast("收藏成功");
            _this.noCollect = false;
            _this.isCollect = true;
          } else if (response.data.errorCode == -1) {
            Toast("请先登录");
            setTimeout(() => {
              _this.$router.push({
                path: "/login",
                query: {
                  redirect: _this.$router.currentRoute.fullPath
                }
              });
            }, 1000);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 收藏
    delCollect() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userCollection/delete?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: _this.$route.query.id
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            Toast("取消收藏成功");
            _this.noCollect = true;
            _this.isCollect = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 分享
    share(num) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/product/share?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            share_url: location.href.split("#")[0],
            id: _this.$route.query.id
          })
        )
        .then(function(response) {
          console.log(response.data.data);
          if (response.data.errorCode == 0) {
            wx.config({
              debug: true,
              appId: response.data.data.share_parameter.app_id, // 必填，公众号的唯一标识
              timestamp: response.data.data.share_parameter.time_stamp, // 必填，生成签名的时间戳
              nonceStr: response.data.data.share_parameter.nonce_str, // 必填，生成签名的随机串
              signature: response.data.data.share_parameter.signature, // 必填，签名
              jsApiList: [
                "onMenuShareAppMessage",
                "onMenuShareTimeline",
                "onMenuShareQQ",
                "onMenuShareQZone"
              ] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {
              //分享给朋友
              wx.onMenuShareAppMessage({
                title: response.data.data.title,
                desc: response.data.data.content,
                link:
                  location.href.split("#")[0] + location.href.split("#/")[1],
                imgUrl: response.data.data.image,
                type: "", // 分享类型,music、video或link，不填默认为link
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // 用户确认分享后执行的回调函数
                  console.log("分享给朋友成功返回的信息为:", res);
                  wx.showToast({
                    title: res,
                    icon: "none",
                    duration: 1500,
                    mask: false
                  });
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  console.log("取消分享给朋友返回的信息为:", res);
                }
              });
              //分享到朋友圈
              wx.onMenuShareTimeline({
                title: response.data.data.title,
                desc: response.data.data.content,
                link:
                  location.href.split("#")[0] + location.href.split("#/")[1],
                imgUrl: response.data.data.image,
                type: "", // 分享类型,music、video或link，不填默认为link
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // 用户确认分享后执行的回调函数
                  console.log("分享到朋友圈成功返回的信息为:", res);
                  wx.showToast({
                    title: res,
                    icon: "none",
                    duration: 1500,
                    mask: false
                  });
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  console.log("取消分享到朋友圈返回的信息为:", res);
                }
              });
              //分享到QQ
              wx.onMenuShareQQ({
                title: response.data.data.title,
                desc: response.data.data.content,
                link:
                  location.href.split("#")[0] + location.href.split("#/")[1],
                imgUrl: response.data.data.image,
                type: "", // 分享类型,music、video或link，不填默认为link
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // 用户确认分享后执行的回调函数
                  console.log("分享到QQ好友成功返回的信息为:", res);
                  wx.showToast({
                    title: res,
                    icon: "none",
                    duration: 1500,
                    mask: false
                  });
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  console.log("取消分享给QQ好友返回的信息为:", res);
                }
              });
              //分享到QQ空间
              wx.onMenuShareQZone({
                title: response.data.data.title,
                desc: response.data.data.content,
                link:
                  location.href.split("#")[0] + location.href.split("#/")[1],
                imgUrl: response.data.data.image,
                type: "", // 分享类型,music、video或link，不填默认为link
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // 用户确认分享后执行的回调函数
                  console.log("分享到QQ空间成功返回的信息为:", res);
                  wx.showToast({
                    title: res,
                    icon: "none",
                    duration: 1500,
                    mask: false
                  });
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  console.log("取消分享到QQ空间返回的信息为:", res);
                }
              });
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
