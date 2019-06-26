<template>
    <div class="succeed">
       <myHeader title="保养提交成功"/>
       <div class="from_top">
       <div class="succeedcontent">
          <img :src="httpUrl+'modal/succeed.png'"/>
          <h2>保养提交成功</h2>
          <div class="content">
            <p>保养单号：{{order_no}}</p>
            <p>对应保险单号：{{user_insurance_order_no}}</p>
            <p>保养车辆车牌：{{license_plate_number}}</p>
            <p>保养门店：{{federation_store_company_name}}</p>
            <p>预计到店保养时间：{{estimated_maintenance_time.substring(0,10)}}</p>
          </div>
          <div class="succeeBtn">
            <button class="upkeep" @click="toUpkeep">返回首页</button>
            <button class="myUpkeep" @click="toMyUpkeep">查看保养单</button>
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
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      order_no: "",
      user_insurance_order_no: "",
      license_plate_number: "",
      federation_store_company_name: "",
      estimated_maintenance_time: ""
    };
  },
  components: {
    myHeader
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      var id = _this.$route.query.id;
      axios
        .post(
          _this.apihttpUrl + "api/user/userMaintainOrder/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            var orderInfo = response.data.data.info[0];
            _this.order_no = orderInfo.order_no;
            _this.user_insurance_order_no = orderInfo.user_insurance_order_no;
            _this.license_plate_number = orderInfo.license_plate_number;
            _this.federation_store_company_name =
              orderInfo.federation_store_company_name;
            _this.estimated_maintenance_time =
              orderInfo.estimated_maintenance_time;
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
        path: "/UpkeepOrderList"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


