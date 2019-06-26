<template>
  <div class="cartList">
    <div class="noticebody">
      <header class="app-header navbar">
        <div class="top-head row">
          <div class="col-xs-12">
            <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
            <p>购物车</p>
            <div class="editor">
              <span @click="isEditor = !isEditor">{{isEditor ? '完成' : '编辑'}}</span>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div>
      <div class="listBox" v-for="(item, index) in cartList" :key="index">
        <div class="list-item">
          <div class="col-xs-1">
            <div class="checkboxGroup">
              <div class="info">
                <div class="checkbox">
                  <input
                    type="checkbox"
                    v-model="selectList"
                    :id="item.id"
                    :value="index"
                    name="selectList"
                    @click="checkboxChange($event)"
                  >
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-3 cover" @click="gogoodsdetail(item.product_id)">
            <img :src="item.product_image_path" alt>
          </div>
          <div class="col-xs-8 text">
            <p class="name" @click="gogoodsdetail(item.product_id)">{{item.product_name}}</p>
            <p class="model">零件号:{{item.product_no}}</p>
            <p class="price">￥{{item.product_user_price}}</p>
            <span class="steper">
              <button @click="bindMinus(index, item.id, item.product_id)">-</button>
              <input
                type="text"
                :id="item.id"
                :name="item.product_id"
                :value="item.pay_num"
                @input="changeInput"
              >
              <button @click="bindPlus(index, item.id, item.product_id)">+</button>
            </span>
          </div>
        </div>
        <div class="gray-border" style="height:0.28rem;" v-if="!item.federation_store_id"></div>
        <div class="infoww" v-if="item.federation_store_id">
          <p>
            安装服务
            <span>¥{{item.product_city_install_price_1}}</span>
          </p>
          <!-- <p v-if="item.select_store_level==2">安装服务<span>¥{{item.product_city_install_price_2}}</span></p>
          <p v-if="item.select_store_level==3">安装服务<span>¥{{item.product_city_install_price_3}}</span></p>-->
          <p class="store">{{item.company_name}}</p>
        </div>
        <div class="gray-border" style="height:0.28rem;" v-if="item.federation_store_id"></div>
      </div>
    </div>
    <!-- 空购物车 -->
    <div class="nodata" v-if="isEmpty">
      <img :src="httpUrl+'cartNodata.png'" alt>
      <p>你的购物车还是空的哦~</p>
      <button @click="goindex">去采购</button>
    </div>
    <!-- 底部导航 -->
    <div class="bottom_total">
      <div class="col-xs-12">
        <div class="col-xs-3 checkAll">
          <div class="info" @click="swapCheck">
            <div class="checkbox other">
              <input type="checkbox" v-model="checked">
              <span></span>
            </div>
            <p>全选</p>
          </div>
        </div>
        <div class="col-xs-9 doButton" v-if="!isEditor">
          <!-- toFixed(2)去小数点后两位 -->
          <p class="totalPrice">
            总计:
            <span>￥{{totalPrice.toFixed(2)}}</span>
          </p>
          <button class="doEdit" @click="doPay()">付款</button>
        </div>
        <div class="col-xs-9 doButton" v-if="isEditor">
          <button class="doDele" @click="handleRemove()">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import axios from "axios";
import qs from "qs";
import { Dialog, Toast } from "vant";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      isEmpty: false,
      isEditor: false,
      num: "1",
      cartList: [],
      selectList: [],
      checked: false,
      httpUrl: domain.iconUrl,
      chose: [],
      product: []
    };
  },
  computed: {
    // 计算总价变化
    totalPrice() {
      var total = 0;
      var _this = this;
      _this.chose.splice(0);
      for (var i = 0; i < _this.selectList.length; i++) {
        var index = this.selectList[i];
        var item = this.cartList[index];
        if (item.length != 0) {
          total +=
            item.product_user_price * item.pay_num +
            item.product_city_install_price_1 * item.pay_num;

          _this.chose[index] = _this.cartList[index];
        } else {
          continue;
        }
        // 判断当前选中状态
        // 若全部选中，则全选点亮
        // 反之，全选取消
        if (this.selectList.length === this.cartList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      }
      return total;
    }
  },
  components: {
    [Dialog]: Dialog
  },
  created() {
    this.iniData();
  },
  methods: {
    checkboxChange: function(e) {
      console.log(e);
      if (this.cartList.length == 1) {
        if (e.target.checked == true) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      }
    },
    goindex() {
      this.$router.push({
        path: "index"
      });
    },
    gogoodsdetail(id) {
      this.$router.push({ path: "GoodsDetail", query: { id: id } });
    },
    // 全选
    swapCheck() {
      var selectList = document.getElementsByName("selectList");
      var len = selectList.length;
      if (this.checked) {
        for (var i = 0; i < len; i++) {
          var item = selectList[i];
          item.checked = false;
        }
        this.checked = false;
        this.selectList = [];
      } else {
        for (i = 0; i < len; i++) {
          item = selectList[i];
          if (item.checked === false) {
            item.checked = true;
            this.selectList.push(parseInt(selectList[i].value));
          }
        }
        this.checked = true;
      }
    },
    // 返回上一级页面
    onClickLeft() {
      window.history.go(-1);
    },
    /*点击减号 */
    bindMinus(index, id, pId) {
      var goods = this.cartList[index];
      if (goods.pay_num <= 1) {
        return;
      } else {
        goods.pay_num--;
      }
      var num = goods.pay_num;
      var _this = this;
      _this.changeNum(id, num, pId);
    },
    /*点击加号 */
    bindPlus(index, id, pId) {
      var goods = this.cartList[index];
      goods.pay_num++;
      var num = goods.pay_num;
      var _this = this;
      _this.changeNum(id, num, pId);
    },
    // 监听输入框
    changeInput(e) {
      var _this = this;
      var id = e.target.id;
      var pid = e.target.name;
      var num = e.target.value;
      for (let i = 0; i < _this.cartList.length; i++) {
        if (_this.cartList[i].id == id) {
          _this.cartList[i].pay_num = num;
        } else {
        }
      }
      _this.changeNum(id, num, pid);
    },
    // 初始化列表数据
    iniData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/shoppingCart/list?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          console.log(response.data.data.info);
          if (response.data.errorCode === 0) {
            _this.cartList = response.data.data.info;
            var list = response.data.data.info;
            for (var i = 0; i < list.length; i++) {
              if (list[i].select_store_level == 1) {
                _this.cartList[i].product_city_install_price_1 ==
                  list.product_city_install_price_1;
              } else if (list[i].select_store_level == 2) {
                _this.cartList[i].product_city_install_price_1 ==
                  list.product_city_install_price_2;
              } else if (list[i].select_store_level == 3) {
                _this.cartList[i].product_city_install_price_1 ==
                  list.product_city_install_price_3;
              } else {
                _this.cartList[i].product_city_install_price_1 = "";
              }
            }
            // 判断购物车是否为空
            if (response.data.data.info.length === 0) {
              _this.isEmpty = true;
            } else {
              _this.isEmpty = false;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 改变步进器数值
    changeNum(id, num, pId) {
      var goodsList = [];
      goodsList.push({
        id: id,
        pay_num: num,
        product_id: pId
      });
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/shoppingCart/batchUpdate?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            json_str: JSON.stringify(goodsList)
          })
        )
        .then(function(response) {})
        .catch(function(error) {
          console.log(error);
        });
    },
    // 删除操作
    handleRemove() {
      Dialog.confirm({
        title: "确认删除所选商品？"
      })
        .then(() => {
          // on confirm
          console.log("你点击了确认");
          if (this.selectList.length > 0) {
            var _this = this;
            for (var i = 0; i < _this.selectList.length; i++) {
              var index = this.selectList[i];
              var item = this.cartList[index];
              var id = item.id;
              axios
                .post(
                  _this.apihttpUrl + "api/user/shoppingCart/delete?platform=weixin&version=1000",
                  qs.stringify({
                    token: window.localStorage.getItem("token"),
                    id: id
                  })
                )
                .then(function(response) {
                  if (response.data.errorCode === 0) {
                    _this.iniData();
                  } else {
                    Toast(response.data.message.message);
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
            _this.selectList = [];
          } else {
            Toast("请选择至少一个商品");
          }
        })
        .catch(() => {
          // on cancel
          console.log("你点击了取消");
        });
    },
    doPay() {
      var _this = this;
      if (_this.selectList.length > 0) {
        for (var i = 0; i < _this.selectList.length; i++) {
          var index = _this.selectList[i];
          var item = _this.cartList[index];
          var id = item.id;
          // 判断是否是安装商品
          _this.product.splice(0);
          _this.chose.forEach(element => {
            _this.cartList.forEach(good => {
              // 判断当前商品是否是安装商品
              var is_install;
              if (good.federation_store_id) {
                is_install = "1";
              } else {
                is_install = "0";
              }
              if (good.id === element.id) {
                _this.product.push({
                  product_id: good.product_id,
                  product_name: good.product_name,
                  pay_num: good.pay_num,
                  federation_store_id: good.federation_store_id,
                  is_install: is_install,
                  // 操作来源必传
                  operation_source: "shopping_cart"
                });
              }
            });
          });
        }
        console.log(_this.product);
        axios
          .post(
            _this.apihttpUrl + "api/user/product/order/verify?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token"),
              products: JSON.stringify(_this.product)
            })
          )
          .then(function(response) {
            if (response.data.errorCode === 0) {
              window.localStorage.setItem("operation_source", "shopping_cart");
              window.localStorage.setItem(
                "ensureOrderData",
                JSON.stringify(_this.product)
              );
              _this.$router.push({
                path: "OrderConfirm"
                // query: { operation_source: "shopping_cart" }
              });
            } else {
              Toast(response.data.message.message);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        Toast("请选择至少一个商品");
      }
    }
  }
};
</script>
