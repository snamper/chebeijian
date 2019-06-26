<template>

  <div class="searchbody">

    <div class="top-head row">
      <div class="col-xs-1">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
      </div>
      <div class="col-xs-9">
        <img :src="httpUrl+'search.png'">
        <input class="search-box" name="q" value="" placeholder="搜索" type="text" v-model="koy">
      </div>
      <div class="col-xs-2" @click="gosearchResult">
        <p>搜索</p>
      </div>

    </div>

    <div class="from_top info row">
      <p>热门搜索</p>
      <div class="label">
        <p v-for="(item, index) in list" :key="index" @click="gosearchResult3(item.product_class_id, item.key_word)">{{item.key_word}}</p>
      </div>
    </div>

    <!-- 未登录 -->
    <div class="info row" v-if="!token">
      <div class="col col-xs-5">
        <p class="history">历史搜索</p>
      </div>
      <div class="col col-xs-7">
        <span @click="gosearchResult1">点击登录 查看历史搜索记录</span>
      </div>
    </div>

    <!-- 已登录 -->
    <div class="info row" v-else>
      <div class="col col-xs-5">
        <p class="history">历史搜索</p>
      </div>
      <div class="col col-xs-7" @click="empty">
        <img class="clear" :src="httpUrl+'delect.png'">
        <p>清空历史搜索记录</p>
      </div>
      <div class="label">
        <p v-for="(item, index) in list2" :key="index" @click="gosearchResult2(item)">{{item}}</p>
      </div>
    </div>


  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      token: window.localStorage.getItem("token"),
      list: [],
      koy: "",
      list2: []
    };
  },
  components: {},
  created() {
    this.initData();
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    gosearchResult1() {
      this.$router.push({
        path: "login",
        query: {
          redirect: this.$router.currentRoute.fullPath
        }
      });
    },
    empty() {
      window.localStorage.removeItem("list2");
      this.list2 = [];
    },
    gosearchResult2(name) {
      this.$router.push({ path: "searchResult", query: { koy: name } });
      window.localStorage.setItem("q", name);
    },
    gosearchResult3(id,name) {
      this.$router.push({ path: "searchResult", query: { class_id: id , koy2: name } });
      window.localStorage.setItem("q", name);
    },
    gosearchResult() {
      if (this.token && this.koy) {
        if (this.list2.indexOf(this.koy) > -1) {
        } else {
          this.list2.push(this.koy);
        }
        window.localStorage.setItem("list2", JSON.stringify(this.list2));
      }
      this.$router.push({ path: "searchResult", query: { koy: this.koy } });
      window.localStorage.setItem("q", this.koy);
    },
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/hotSearch/?platform=Android&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          _this.list = response.data.data.info;
          if (window.localStorage.getItem("list2")) {
            _this.list2 = JSON.parse(window.localStorage.getItem("list2"));
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>