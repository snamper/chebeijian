<template>

  <div class="UpkeepOrderList bac">
    <!-- 头部 -->
    <div class="top-head row">
      <div class="tab">
        <p class="title" @click="goGoodsOrderList">配件单</p>
        <p class="active">保养单</p>
      </div>
    </div>
    <!-- end 头部 -->

    <!--内容-->
    <div class="tab-content from_top">
      <div class="tabs-switch">
        <van-tabs v-model="active" swipe-threshold="4">
          <van-tab title="待接单">
            <select1 />
          </van-tab>
          <van-tab title="待保养">
            <select2 />
          </van-tab>
          <van-tab title="已完成">
            <select3 />
          </van-tab>
          <van-tab title="已取消">
            <select4 />
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <myFooter />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import "../../style/common/css/style.css";
import myFooter from "@/components/Footer";
import select1 from "@/components/UpkeepOrderList/select01.vue";
import select2 from "@/components/UpkeepOrderList/select02.vue";
import select3 from "@/components/UpkeepOrderList/select03.vue";
import select4 from "@/components/UpkeepOrderList/select04.vue";
import { Tab, Tabs, Button } from "vant";
export default {
  data() {
    return {
      rangeValue: 40,
      showBase: false,
      active: 0
    };
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
    myFooter,
    select1,
    select2,
    select3,
    select4
  },
  created() {
    this.active = this.$route.query.active;
  },
  methods: {
    goGoodsOrderList() {
      this.$router.push({
        path: "GoodsOrderList"
      });
    }
  }
};
</script>