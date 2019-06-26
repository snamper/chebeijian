<template>
    <div class="collectList">
      <div class="noticebody">
        <myHeader title="我的收藏" />
      </div>
      <div class="listBox from_top">
        <div class="list-item" v-for="(item,index) in collectList" :key="index" >
          <div class="col-xs-3 cover" @click="toGoodList(item.product_id)" >
            <img :src="item.product_image_path" >
          </div>
          <div class="col-xs-9 text">
            <p class="name">{{item.product_name}}</p>
            <p class="model">零件号:{{item.product_no}}</p>
            <p class="price" style="margin-top:0.2rem">￥{{item.user_price}}</p>
            <span class="heart" style="margin-top:0.2rem" @click="noCollect(index, item.product_id)"><img :src="httpUrl+'type/heart.png'" alt=""></span>
          </div>
        </div>
        <div class="gray-border"></div>

      </div>
      <div class="nodata" v-if="isEmpty">
        <img :src="httpUrl+'type/collectNodata.png'" alt="">
        <p>还没有收藏的商品哦~</p>
        <router-link to="/">
         <button>去逛逛</button>
        </router-link>

      </div>
    </div>
</template>

<style scoped>
@import '../../style/common/css/type.css';
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
      httpUrl: domain.iconUrl,
      collectList: "",
      isEmpty: false
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
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userCollection/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            var collectList = response.data.data.info;
            if (collectList.length == 0) {
              _this.isEmpty = true;
            } else {
              _this.collectList = collectList;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toGoodList(id) {
      this.$router.push({
        path: "GoodsDetail",
        query: {
          id: id
        }
      });
    },
    noCollect(index,id) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userCollection/delete?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            Toast("取消收藏成功");
            _this.initData();
            _this.collectList.splice(index, 1);
            if (_this.collectList.length == 0) {
              _this.isEmpty = true;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>


