<template>
    <div class="succeed">   
       <myHeader title="支付状态"/>
       <div class="from_top">
       <div class="succeedcontent">
          <img :src="httpUrl+'modal/succeed.png'" v-if="status == 2"/>
          <h2  v-if="status == 2">支付成功</h2>
          <img :src="httpUrl+'modal/failure.png'" v-if="status == 1"/>
          <h2  v-if="status == 1">支付失败</h2>
          <div class="succeeBtn">
            <button class="upkeep" @click="toUpkeep">回到首页</button>
            <button class="myUpkeep" @click="toMyUpkeep">查看订单</button>
          </div>
       </div>
       </div>

    </div>    
</template>



<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      order_no: "",
      insurance_start_date: "",
      total: "",
      license_plate_number: "",
      status: "",
      httpUrl: domain.iconUrl //直接通过this访问全局变量
    };
  },
  components: {
    myHeader
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/detailOrder?platform=weixin&version=1000&order_on=" +
            _this.$route.query.order_on,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            _this.order_no = response.data.data.info.order_info.order_no;
            _this.insurance_start_date =
              response.data.data.info.order_info.insurance_start_date;
            _this.total = response.data.data.info.order_info.total;
            _this.license_plate_number =
              response.data.data.info.user_vehicle_info.license_plate_number;
            _this.status = response.data.data.info.order_info.status;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toUpkeep() {
      this.$router.push({
        path: "/"
      });
    },
    toMyUpkeep() {
      this.$router.push({
        path: "/GoodsOrderList"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


