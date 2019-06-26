<template>
    <div class="succeed">   
       <myHeader title="预约失败"/>
       <div class="from_top">
       <div class="succeedcontent">
          <img :src="httpUrl+'modal/failure.png'"/>
          <h2>预约失败</h2>
          <div class="content">
            <p>预约保险单号：345678903456789</p>
            <p>支付金额：2300.00</p>
            <p>预约对应车辆：沪A VR123</p>
            <p>预约车险生效时间：2018-09-09</p>
          </div>
          <div class="succeeBtn">
            <button class="myUpkeep" @click="toMyUpkeep">查看预约单</button>
          </div>
       </div>
       </div>

    </div>    
</template>



<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
export default {
  data() {
    return {
      httpUrl: domain.iconUrl,
    };
  },
  components: {
    myHeader
  },
  created() {},
  methods: {
    toUpkeep() {},
    toMyUpkeep() {
      this.$router.push({
        path: "/CarInsuranceList"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


