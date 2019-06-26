<template>
  <div class="classfication">
    <div class="search_top">
      <div class="search" @click="gosearch()">
        <img :src="httpUrl+'type/icon_search.png'" alt>
        <p>搜索</p>
      </div>
    </div>

    <div class="cf_content from_top">
      <div class="list_wrap">
        <div class="col-xs-3 nav">
          <ul>
            <li
              class="nav-item"
              v-for="(item, index) in List"
              :key="index"
              :class="{'current':currentIndex == index}"
              @click="addClass(index)"
            >
              <span class="text">{{item.product_class_name}}</span>
            </li>
          </ul>
        </div>

        <div class="col-xs-9 content">
          <div class="content_item" v-for="(item, index1) in List2" :key="index1">
            <div class="right_title">
              <p>{{item.product_class_name}}</p>
            </div>
            <div class="table">
              <ul>
                <li v-for="(items, index2) in List3[index1]" :key="index2">
                  <router-link
                    :to="{path:'GoodsList',query:{id:items.id}}"
                  >{{items.product_class_name}}</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <myFooter/>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import axios from "axios";
import qs from "qs";
import myFooter from "@/components/Footer";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      currentIndex: 0,
      List: [],
      List2: [],
      List3: [],
      httpUrl: domain.iconUrl,
      num: 1
    };
  },
  components: {
    myFooter
  },
  created() {
    this.initData();
  },
  methods: {
    gosearch() {
      this.$router.push({ path: "Search" });
    },
    initData() {
      var _this = this;
      axios
        .get(_this.apihttpUrl + "api/productClass/levelAllSon", {
          params: {
            platform: "weixin",
            version: "1000"
          }
        })
        .then(function(response) {
          if (response.data.errorCode === 0) {
            _this.List = response.data.data.info;
            _this.List2 = response.data.data.info[0].second;
            for (let i = 0; i < response.data.data.info[0].second.length; i++) {
              _this.List3[i] = response.data.data.info[0].second[i].third;
            }

            // _this.changeContent(response.data.data.info[0].id);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 切换分类列表样式
    addClass: function(index) {
      this.currentIndex = index;
      var _this = this;
      axios
        .get(_this.apihttpUrl + "api/productClass/levelAllSon", {
          params: {
            platform: "weixin",
            version: "1000"
          }
        })
        .then(function(response) {
          if (response.data.errorCode === 0) {
            _this.List2 = response.data.data.info[index].second;
            for (
              let i = 0;
              i < response.data.data.info[index].second.length;
              i++
            ) {
              _this.List3[i] = response.data.data.info[index].second[i].third;
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
