<template>
  <div class="searchResult">
    <!-- 头部搜索 -->
    <div class="top-head row">
      <div class="col-xs-1">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
      </div>
      <div class="col-xs-11">
        <img :src="httpUrl+'search.png'">
        <input v-if="haveid" class="search-box" name="q" value="" placeholder="" type="text" v-model="koy2" @click="search">
        <input v-else class="search-box" name="q" value="" placeholder="" type="text" v-model="koy" @click="search">
      </div>
      <!-- <div class="col-xs-2" @click="search">
        <p>搜索</p>
      </div>-->
    </div>
    <!-- end 头部搜索 -->
    <!-- 选择车型 -->
    <div class="from_top choose row" @click="goChooseModels">
      <div class="col-xs-10">
        <p v-if="!name">请选择车型</p>
        <p class="active" v-else>
          车型：
          <span>{{name1}} {{name2}}-{{name3}} {{year}}年</span>
        </p>
      </div>
      <div class="col-xs-2">
        <img :src="httpUrl+'jtright.png'">
      </div>
    </div>
    <!-- end 选择车型 -->
    <div class="info">
      <div class="float">
        <div class="shadow"></div>
        <!-- 筛选标题 -->
        <ul class="title">
          <li @click="screen(1)">
            <p v-bind:class="defaultClass">默认</p>
          </li>
          <li v-bind:class="saledefalut" class="sales" v-if="pxlb" @click="screen(2)">
            <p>销量</p>
          </li>
          <li v-bind:class="saledefalut" class="sales" v-else @click="screen(3)">
            <p>销量</p>
          </li>
          <li v-bind:class="pricedefault" class="sales" v-if="pxlb2" @click="screen(4)">
            <p>价格</p>
          </li>
          <li v-bind:class="pricedefault" class="sales" v-else @click="screen(5)">
            <p>价格</p>
          </li>
        </ul>
      </div>
      <!-- end 筛选标题 -->
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div class="detail row">
          <ul class="goods">
            <li @click="gogoodsdetail(item.id)" v-for="(item, index) in goods_list" :key="index">
              <img :src="item.image_path">
              <h4>{{item.product_name}}</h4>
              <p class="info">零件号：{{item.product_no}}</p>
              <p class="price" v-if="price_token === null">
                <span>价格会员可见</span>
              </p>
              <p class="price" v-else>
                <span>￥</span>
                {{item.user_price}}
              </p>
            </li>
          </ul>
        </div>
      </van-list>
    </div>

    <!-- 无数据 -->
    <div class="info" v-if="isEmpty">
      <div class="no-data">
        <img :src="httpUrl+'no-data.png'">
        <p>暂无商品</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import myHeader from "@/components/Header";
  import axios from "axios";
  import qs from "qs";
  import {
    Cell,
    CellGroup,
    List
  } from "vant";
  export default {
    data() {
      return {
        apihttpUrl: domain.testUrl,
        price_token: "",
        koy: this.$route.query.koy,
        koy2: this.$route.query.koy2,
        haveid: "",
        isEmpty: false,
        goods_list: [],
        product_price_sort: '',
        sales_volume_sort: '',
        name: 0,
        name1: this.$route.query.name,
        name2: this.$route.query.name1,
        name3: this.$route.query.name2,
        year: this.$route.query.year,
        list: [],
        loading: false,
        finished: false,
        page: 1,
        httpUrl: domain.iconUrl,
        defaultClass: "other",
      };
    },
    components: {
      myHeader,
      Cell,
      CellGroup,
      List
    },
    created() {
      this.initData();
    },
    methods: {
      search() {
        this.$router.push({
          path: "Search"
        });
      },
      onClickLeft() {
        window.history.go(-1);
      },
      goChooseModels() {
        this.$router.push({
          path: "ChooseModels"
        });
      },
      gogoodsdetail(id) {
        this.$router.push({
          path: "GoodsDetail",
          query: {
            id: id
          }
        });
      },
      onLoad() {
        var _this = this;
        var page = _this.page;
        if (_this.$route.query.name) {
          _this.name = 1;
        }
        setTimeout(() => {
          axios
            .post(
              _this.apihttpUrl + "api/product/productList?platform=weixin&version=1000&row=1&page=" +
              page,
              qs.stringify({
                token: window.localStorage.getItem("token"),
                vehicle_model_id: _this.$route.query.id,
                key_word: _this.$route.query.koy,
                product_price_sort: _this.product_price_sort,
                sales_volume_sort: _this.sales_volume_sort,
                product_class_id: _this.$route.query.class_id
              })
            )
            .then(function (response) {
              var goods_list = response.data.data.info;
              if (goods_list.length === 0) {
                _this.finished = true;
                _this.loading = false;
                return false;
              }
              if (_this.goods_list && _this.page > 1) {
                _this.goods_list = _this.goods_list.concat(goods_list);
              } else {
                _this.goods_list = goods_list;
              }
              _this.loading = false;
              _this.page++;
            })
            .catch(function (error) {
              console.log(error);
            });
        }, 200);
      },
      initData() {
        var _this = this;
        var page = _this.page;
        if (_this.$route.query.name) {
          _this.name = 1;
        }
          axios
            .post(
              _this.apihttpUrl + "api/product/productList?platform=weixin&version=1000&row=1&page=" +
              page,
              qs.stringify({
                token: window.localStorage.getItem("token"),
                vehicle_model_id: _this.$route.query.id,
                key_word: _this.$route.query.koy,
                product_price_sort: _this.product_price_sort,
                sales_volume_sort: _this.sales_volume_sort,
                product_class_id: _this.$route.query.class_id
              })
            )
            .then(function (response) {
              var goods_list = response.data.data.info;
              _this.goods_list = goods_list;
              if (goods_list.length === 0) {
                _this.isEmpty = true;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
      },
      screen(sum) {
        var _this = this;
        // if (_this.defaultClass == "default") {
        //   _this.saledefalut = "defalut";
        //   // _this.sales_volume_sort = "";
        //   // }
        if (sum == "1") {
        _this.product_price_sort = "";
        _this.sales_volume_sort = "";
        _this.defaultClass = "other";
        _this.saledefalut = "";
        _this.pricedefault = "";
      } else if (sum == "2") {
        _this.sales_volume_sort = 1;
        _this.saledefalut = "down";
        _this.defaultClass = "default";
        _this.pricedefault = "";
        _this.product_price_sort = "";
        _this.pxlb= '';
        _this.pxlb2= '';
      } else if (sum == "3") {
        _this.sales_volume_sort = 0;
        _this.saledefalut = "up";
        _this.defaultClass = "default";
         _this.pricedefault = "";
         _this.product_price_sort = "";
         _this.pxlb= 1;
         _this.pxlb2= '';
      } else if (sum == "4") {
        _this.product_price_sort = 1;
        _this.pricedefault = "down";
        _this.defaultClass = "default";
        _this.saledefalut = "";
        _this.sales_volume_sort = "";
        _this.pxlb2= '';
        _this.pxlb= '';
      } else if (sum == "5") {
        _this.product_price_sort = 0;
        _this.pricedefault = "up";
        _this.defaultClass = "default";
        _this.saledefalut = "";
        _this.sales_volume_sort = "";
        _this.pxlb2 = 1;
        _this.pxlb= '';
      }
        _this.page = 1;
        _this.initData();
      }
    }
  };
</script>