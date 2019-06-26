<template>
<div class="GoodsOrderList bac">
  <!--头部-->
  <div class="top-head row">
      <div class="tab">
        <p class="title active">配件单</p>
        <p @click="goUpkeepOrderList()">保养单</p>
      </div>
    </div>
  <!--内容-->
  <div class="tab-wrapper from_top">
    <div class="tabs-switch">
      <van-tabs v-model="active" swipe-threshold="8" @click="onClick">
        <van-tab title="全部">
          <select1 />
        </van-tab>
        <van-tab title="待付款">
          <select2 />
        </van-tab>
        <van-tab title="待确认">
          <select3 />
        </van-tab>
        <van-tab title="待发货">
          <select4 />
        </van-tab>
        <van-tab title="待收货">
          <select5 />
        </van-tab>
        <van-tab title="待完成">
          <select6 />
        </van-tab>
        <van-tab title="已完成">
          <select7 />
        </van-tab>
        <van-tab title="退款">
          <select8 />
        </van-tab>
      </van-tabs>
    </div>
  </div>
  
  <myFooter />
</div>
</template>

<script>
import "../../style/common/css/style.css";
import myFooter from "@/components/Footer";
import select1 from "@/components/GoodsOrderList/select01.vue";
import select2 from "@/components/GoodsOrderList/select02.vue";
import select3 from "@/components/GoodsOrderList/select03.vue";
import select4 from "@/components/GoodsOrderList/select04.vue";
import select5 from "@/components/GoodsOrderList/select05.vue";
import select6 from "@/components/GoodsOrderList/select06.vue";
import select7 from "@/components/GoodsOrderList/select07.vue";
import select8 from "@/components/GoodsOrderList/select08.vue";
import { Tab, Tabs, Button } from "vant";

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
    myFooter,
    select1,
    select2,
    select3,
    select4,
    select5,
    select6,
    select7,
    select8
  },
  data() {
    return {
      rangeValue: 40,
      showBase: false,
      active: 0
    };
  },
  created() {
    this.active = this.$route.query.active;
  },
  methods: {
    goUpkeepOrderList() {
      this.$router.push({ path: "UpkeepOrderList" });
    },
    onClick(index, title) {
      this.$router.push({
        path: "GoodsOrderList",
        query: { active: index }
      });
    }
  }
};
</script>
