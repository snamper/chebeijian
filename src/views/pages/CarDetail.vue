<template>
    <div class="carDetail">
      <div class="noticebody">
        <myHeader title="我的车辆" />
      </div>
      <div class="cd_content from_top">
        <div class="cd_title">
          基本信息
        </div>
        <div class="cd-center">
          <div class="col-xs-12">
            <p> <em>*</em> 汽车VIN码: <span>{{baseInfo.vin_code}}</span></p>
          </div>
          <div class="col-xs-12">
             <p><em>*</em> 车牌号: <span>{{baseInfo.license_plate_number}}</span></p>
          </div>
          <div class="col-xs-12">
             <p>发动机号(新能源电机号): <span>{{baseInfo.engine_number}}</span></p>
          </div>
          <div class="col-xs-12">
             <p>变速箱类型: <span>{{info.vehicle_model_gearbox.bxslx}}</span></p>
          </div>
          <div class="col-xs-12">
             <p><em>*</em> 厂家: <span>{{info.vehicle_model.companyName}}</span></p>
          </div>
          <div class="col-xs-12">
            <p><em>*</em> 品牌: <span>{{info.vehicle_model.brand_name}}</span></p>
          </div>
          <div class="col-xs-12">
            <p><em>*</em> 车型: <span>{{info.vehicle_model.vehicleAlias}}</span></p>
          </div>
          <div class="col-xs-12">
            <p>排量: <span>{{info.vehicle_model.displacement}}</span></p>
          </div>
        </div>
        <div class="cd_title">
          详细信息
        </div>
        <div class="cd-center">
          <div class="col-xs-12">
            <p><em>*</em> 提车时间: <span>{{baseInfo.mention_vehicle_date}}</span></p>
          </div>
          <div class="col-xs-12">
            <p><em>*</em> 年审到期时间: <span>{{baseInfo.annual_review_deadline}}</span></p>
          </div>
          <div class="col-xs-12">
            <p>已行驶公里数: <span>{{baseInfo.driving_kilometers}}</span></p>
          </div>
          <div class="col-xs-12">
            <p>最大马力: <span>{{info.vehicle_model_engine.zdml}}</span></p>
          </div>
          <div class="col-xs-12">
            <p>最大功率: <span>{{info.vehicle_model_engine.zdgl}}</span></p>
          </div>
          <div class="col-xs-12">
            <p>最大扭矩: <span>{{info.vehicle_model_engine.zdnj}}</span></p>
          </div>
        </div>
        <div class="gray-border"></div>
        <div class="bottom_button">
          <button class="change" @click="toEdit">修改</button>
        </div>
      </div>
    </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import myHeader from "@/components/Header";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      baseInfo: "",
      info: "",
      carId: ""
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
          _this.apihttpUrl + "api/user/vehicle/info?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: _this.$route.query.id
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            _this.baseInfo = response.data.data.info;
            _this.info = response.data.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toEdit() {
      this.$router.push({
        path: "AddCar",
        query: {
          id: this.$route.query.id,
          vinCode: this.baseInfo.vin_code
        }
      });
    }
  }
};
</script>


