<template>

  <div class="indexbody">

    <!-- 轮播图 -->
    <div class="banner">
      <p style="position: absolute;top: 0;right: 13px;z-index: 999; color:red">内测版本</p>
      <!--测试版本提示-->
      <van-swipe :autoplay="5000">
        <van-swipe-item v-for="(item, index) in banner" :key="index">
          <img :src="item.image" @click="gogoodsdetail(item.uri)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- end 轮播图 -->

    <!-- 搜索 -->
    <div class="search">
      <div class="fl" @click="gosearch()">
        <img class="logo" :src="httpUrl+'toplogo.png'">
        <img :src="httpUrl+'search.png'">
        <input class="search-box" name="q" value="" placeholder="搜索" type="text">
      </div>
      <div class="fr" @click="goNotice()">
        <img :src="httpUrl+'notice.png'">
        <!-- <p class="notice" v-if="role">{{role}}</p> -->
      </div>
    </div>
    <!-- end 搜索 -->

    <!-- 3个服务图片 -->
    <div class="service">
      <!-- <img :src="httpUrl+'service3.png'" @click="baoxian()"> -->
      <img :src="httpUrl+'service3.png'" @click="goNotice()">
      <img :src="httpUrl+'service2.png'" @click="yuyue()">
      <img :src="httpUrl+'service1.png'" @click="goStorelist()">
    </div>
    <div class="shadow"></div>
    <!-- end 3个服务图片 -->


    <!-- 3个明星连锁店 -->



    <div class="store row">
      <h1 class="title">明星连锁店</h1>
      <ul>
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item, index) in recommend_federation_store" :key="index">
            <li @click="gostoresDetail(item.id)">
              <img :src="item.door_head_image_path">
              <p>{{item.company_name}}</p>
            </li>

          </swiper-slide>


        </swiper>

      </ul>
    </div>
    <!-- end 3个明星连锁店 -->

    <!-- 广告位 -->
    <div class="advert">
      <van-swipe :autoplay="5000">
        <van-swipe-item v-for="(item, index) in banner1" :key="index">
          <img :src="item.image" @click="gogoodsdetail(item.uri)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- end 广告位 -->

    <!-- 精选商品 -->
    <div class="goods row">
      <h1 class="title" @click="goGoodsList">精选商品</h1>
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <ul v-for="(item, index) in recommend_product" :key="index">
          <li @click="gogoodsdetail(item.id)">
            <div class="col-xs-4">
              <img :src="item.image_path">
            </div>
            <div class="col-xs-8">
              <h4>{{item.product_name}}</h4>
              <p class="info">零件号：{{item.product_no}}</p>
              <p class="price" v-if="price_token === null"><span>价格会员可见</span></p>
              <p class="price" v-else><span>￥</span>{{item.user_price}}</p>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
    <!-- end 精选商品 -->

    <myFooter />


    <!-- 消息弹框 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>功能暂无上线，敬请期待！</p>
      </div>
      <div class="popuo_footer">
        <button class="ensure but" @click="show=false">确定</button>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  // import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../../components/';
  import "../../style/common/css/style.css";
  import Util from "@/js/util";
  import myFooter from "@/components/Footer";
  import {
    Swipe,
    SwipeItem,
    install
  } from "vant";
  import {
    swiper,
    swiperSlide
  } from "vue-awesome-swiper";
  import axios from "axios";
  import qs from "qs";
  import {
    List
  } from "vant";
  export default {
    data() {
      return {
        price_token: '',
        recommend_federation_store: [],
        recommend_product: [],
        role: "",
        httpUrl: domain.iconUrl, //直接通过this访问全局变量
        apihttpUrl: domain.testUrl,
        banner: [],
        banner1: {},
        loading: false,
        finished: false,
        page: 1,
        show: false,
        swiperOption: {
          slidesPerView: 3.2,
          spaceBetween: 15,
          freeMode: true,
          resistanceRatio: 0,
          pagination: {
            el: ".swiper-pagination",
            clickable: true
          }
        },
        swiperList: []
      };
    },
    components: {
      myFooter,
      List,
      swiper,
      swiperSlide,
      [Swipe]: Swipe,
      [SwipeItem]: SwipeItem
    },
    created() {
      this.initData();
    },
    methods: {
      baoxian() {
        this.$router.push({
          path: "InsuranceList"
        });
      },
      yuyue() {
        this.$router.push({
          path: "CarInsurance"
        });
      },
      gosearch() {
        this.$router.push({
          path: "Search"
        });
      },
      goNotice() {
        // this.$router.push({
        //   path: "Notice"
        // });
        this.show = true;
      },
      gostoresDetail(id) {
        this.$router.push({
          path: "storesDetail",
          query: {
            id: id
          }
        });
      },
      goStorelist() {
        this.$router.push({
          path: "storesList"
        });
      },
      goGoodsList() {
        this.$router.push({
          path: "GoodsList"
        });
      },
      gogoodsdetail(id) {
        if (id.indexOf('http') > -1) {   //判断链接是否是外部链接
          window.location.href = id
        } else {
          this.$router.push({
            path: "GoodsDetail",
            query: {
              id: id
            }
          });
        }

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
              _this.apihttpUrl + "api/index/userAppIndex?platform=weixin&version=1000&row=15&page=" +
              page,
              qs.stringify({
                token: window.localStorage.getItem("token")
              })
            )
            .then(function (response) {
              var recommend_product = response.data.data.recommend_product;
              console.log(response.data.data.info);
              if (recommend_product.length === 0) {
                _this.finished = true;
                _this.loading = false;
                return false;
              }
              if (_this.recommend_product && _this.page > 1) {
                _this.recommend_product = _this.recommend_product.concat(
                  recommend_product
                );
              } else {
                _this.recommend_product = recommend_product;
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
        _this.price_token = window.localStorage.getItem('token');
        axios
          .post(
            _this.apihttpUrl + "api/index/userAppIndex?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function (response) {
            _this.recommend_federation_store =
              response.data.data.recommend_federation_store;
            // _this.recommend_product = response.data.data.recommend_product;
            _this.role = response.data.data.global_data.role;
          })
          .catch(function (error) {
            console.log(error);
          });
        axios
          .post(
            _this.apihttpUrl + "api/banners?platform=weixin&version=1000&position=14",
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function (response) {
            _this.banner = response.data.data.rows;
          })
          .catch(function (error) {
            console.log(error);
          });
        axios
          .post(
            _this.apihttpUrl + "api/banners?platform=weixin&version=1000&position=15",
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function (response) {
            console.log(response.data.data);
            _this.banner1 = response.data.data.rows;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  };
</script>