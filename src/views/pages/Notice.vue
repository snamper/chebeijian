<template>
 
    <div class="noticebody bac">   
      <myHeader title="消息通知" />
      <div class="info from_top">
        <ul>
          <li @click="goDetail">
            <div class="col-xs-8">
              <h4>改灯科普</h4>
              <p class="detail">改灯科普：关于大灯起雾问题</p>
            </div>
            <div class="col-xs-4">
              <p>2018.09.09  20:00</p>
            </div>
          </li>
          <li @click="goDetail">
            <div class="col-xs-8">
              <h4>改灯科普</h4>
              <p class="detail">改灯科普：关于大灯起雾问题</p>
            </div>
            <div class="col-xs-4">
              <p>2018.09.09  20:00</p>
            </div>
          </li>
          <li @click="goDetail">
            <div class="col-xs-8">
              <h4>改灯科普</h4>
              <p class="detail">改灯科普：关于大灯起雾问题</p>
            </div>
            <div class="col-xs-4">
              <p>2018.09.09  20:00</p>
            </div>
          </li>
          <li @click="goDetail">
            <div class="col-xs-8">
              <h4>改灯科普</h4>
              <p class="detail">改灯科普：关于大灯起雾问题</p>
            </div>
            <div class="col-xs-4">
              <p>2018.09.09  20:00</p>
            </div>
          </li>
        </ul>

      </div>
    </div>    
</template>

<style lang="scss" scoped>
</style>

<script>
import myHeader from "@/components/Header";
export default {
  data() {
    return {};
  },
  components: {
    myHeader
  },
  created() {},
  methods: {
    goDetail() {
      this.$router.push({ path: "noticeDetail" });
    }
  }
};
</script>


