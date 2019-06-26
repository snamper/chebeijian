<template>
  <div class="GoodsList">
    <div class="searchResult">
      <!-- 头部搜索 -->
      <div class="top-head row">
        <div class="col-xs-1">
          <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        </div>
        <div class="col-xs-9" @click="gosearch()">
          <img :src="httpUrl+'search.png'">
          <input class="search-box" name="q" value="" placeholder="搜索" type="text">
        </div>
        <div class="col-xs-2" @click="gosearchResult()">
          <p>搜索</p>
        </div>
      </div>
      <!-- end 头部搜索 -->
      <!-- 选择车型 -->
      <div class="choose row from_top">
        <div class="col-xs-10" @click="goChooseModels">
          <p>请选择车型</p>
          <!-- <p class="active">车型：<span>一汽大众 奥迪-100 2000年</span></p> -->
        </div>
        <div class="col-xs-2"><img :src="httpUrl+'jtright.png'"></div>
      </div>
      <!-- end 选择车型 -->


      <div class="info">
         <div class="float">
        <div class="shadow"></div>
        <!-- 筛选标题 -->
      <ul class="title">
        <li @click="screen(1)" >
          <p  v-bind:class="defaultClass" >默认</p>
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
            <li @click="gogoodsdetail(item.id)" v-for="(item, index) in goodsList" :key="index">
              <div class="col-xs-4">
                <img :src="item.image_path">
              </div>
              <div class="col-xs-8">
                <h4>{{item.product_name}}</h4>
                <p class="info introduction">
                  {{item.introduction}}
                </p>
                <p class="info">零件号：{{item.product_no}}</p>
                <p class="price" v-if="price_token === null"><span>价格会员可见</span></p>
                <p class="price" v-else><span>￥</span>{{item.user_price}}</p>
              </div>
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
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
import myHeader from "@/components/Header";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      price_token:'',
      goodsList: [],
      product_price_sort: "",
      sales_volume_sort: "",
      httpUrl: domain.iconUrl, //直接通过this访问全局变量
      isEmpty: false,
      koy: this.$route.query.koy,
      list: [],
      loading: false,
      finished: false,
      page: 1,
      defaultClass: "other",
      saledefalut: "",
      pricedefault: "",
      pxlb:'',
      pxlb2:''
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },

  created() {
    this.initData();
  },
  methods: {
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
              sales_volume_sort: _this.sales_volume_sort
            })
          )
          .then(function(response) {
            var goodsList = response.data.data.info;
            console.log(response.data.data.info);
            if (goodsList.length === 0) {
              _this.finished = true;
              _this.loading = false;
              return false;
            }
            if (_this.goodsList && _this.page > 1) {
              _this.goodsList = _this.goodsList.concat(goodsList);
            } else {
              _this.goodsList = goodsList;
            }
            _this.loading = false;
            _this.page++;
          })
          .catch(function(error) {
            console.log(error);
          });
      }, 200);
    },
    initData() {
      var _this = this;
      _this.price_token = window.localStorage.getItem('token');
      // _this.defaultClass = "default";
      axios
        .post(
          _this.apihttpUrl + "api/product/productList?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            product_price_sort: _this.product_price_sort,
            sales_volume_sort: _this.sales_volume_sort,
            product_class_id: _this.$route.query.id
          })
        )
        .then(function(response) {
          _this.goodsList = response.data.data.info;
          if (_this.goodsList.length === 0) {
            _this.isEmpty = true;
          }
          console.log(_this.goodsList);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    gogoodsdetail(id) {
      this.$router.push({ path: "GoodsDetail", query: { id: id } });
    },
    gosearch() {
      this.$router.push({
        path: "Search"
      });
    },
    gosearchResult() {
      this.$router.push({
        path: "searchResult"
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
      _this.initData();
    }
  }
};
</script>