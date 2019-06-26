<template>
    
   <div class="UpkeepSubmit">
     <myHeader title="订单确认"/>
      <div class="UpkeepContent from_top">
        <p>保养门店：<span>{{company_name}} </span></p>
        <div class="upkeepTime">
          <p>预计到店保养时间：</p>
          <!-- <select name="" id="" >
            <option value="0" >请选择到店保养时间</option>
          </select> -->
           <input type="text" placeholder="请选择到店保养时间" v-model="timeStr" @click="chooseTime" readonly="readonly"/>
           <img :src="httpUrl+'modal/carselect.png'" alt="">
        </div>
        <div class="submitBtn">
          <button @click="doSubmit">确认提交</button>
        </div>

      </div>

      <div class="CarInsurance">
      <van-popup v-model="formtime" position="bottom" :overlay="true"  class="popup-car">
         <div class="timetop">
            <div class="col-xs-1"></div>
            <div class="col-xs-10">
              选择到店保养时间
            </div>
            <div class="col-xs-1" @click="formtime=false">
              <img :src="httpUrl+'modal/timeClose.png'" />
            </div>  
          </div>
          <div class="time_newchange">
            <div class="date_year">
              <ul>
                <li>年</li>
                <li>月</li>
                <li>日</li>
              </ul>
            </div>
            <van-datetime-picker v-model="currentDate" type="date" :item-height="itemHeight" :confirm-button-text="confirmButtonText"
                  :cancel-button-text="cancelButtonText" :min-date="minDate" :max-date="maxDate" visible-item-count="3" />
              <div class="submit">
                <button  @click="getFromTime()">
                  确定
                </button>
              </div>
        </div>
      </van-popup>  
      </div>
    
  </div>   
</template>

<script>
import myHeader from "@/components/Header";
import "../../style/common/css/modal.scss";
import { DatetimePicker, Popup, Picker, Toast } from "vant";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      formtime: false,
      currentDate: new Date(),
      minDate: new Date(),
      timeStr: "",
      company_name: ""
    };
  },
  components: {
    myHeader,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    Toast
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      var id = _this.$route.query.federation_store_id;
      axios
        .post(
          _this.apihttpUrl + "api/federationStore/info?platform=weixin&version=1000&federation_store_id=" +
            id
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            _this.company_name = response.data.data.info.company_name;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    chooseTime() {
      this.formtime = true;
    },
    //获取当前选择时间
    getFromTime() {
      this.formtime = false;
      var timeObj = this.currentDate;
      var year = timeObj.getFullYear();
      var month = timeObj.getMonth() + 1;
      var day = timeObj.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.timeStr = year + "-" + month + "-" + day;
    },
    doSubmit() {
      var _this = this;
      // 当前时间年月日
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var nowDate = year + "-" + month + "-" + day;

      axios
        .post(
          _this.apihttpUrl + "api/user/userMaintainOrder/created?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            federation_store_id: _this.$route.query.federation_store_id,
            user_insurance_order_id: _this.$route.query.order_id,
            user_vehicle_id: _this.$route.query.user_vehicle_id,
            estimated_maintenance_time: _this.timeStr
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          if (_this.timeStr == "") {
            Toast("到店保养时间不能为空");
            return false;
          }
          if (_this.timeStr < nowDate) {
            Toast("保养时间不能小于当前时间");
            return false;
          }
          if (response.data.errorCode == 0) {
            var id = response.data.data.order_info.id;
            _this.$router.push({
              path: "/UpkeepSucceed",
              query: {
                id: id.toString()
              }
            });
          } else {
            _this.$router.push({
              path: "/UpkeepFailure"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>



