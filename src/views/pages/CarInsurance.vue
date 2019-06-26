<template>
    <div class="CarInsurance">  
      
<!-- 时间选择器弹框 -->


     <van-popup v-model="formtime" position="bottom" :overlay="true"  class="popup-car">
         <div class="timetop">
            <div class="col-xs-1"></div>
            <div class="col-xs-10">
              选择车险生效时间
            </div>
            <div class="col-xs-1" @click="formtime=false">
              <img :src="httpUrl+'modal/timeClose.png'"/>
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
            <van-datetime-picker v-model="currentDate" type="date" visible-item-count="3" :min-date="minDate" />
              <div class="submit">
                <button  @click="getFromTime()">
                  确定
                </button>
              </div>
        </div>
      </van-popup>    
      <van-popup v-model="endtime" position="bottom" :overlay="true" class="popup-car" >
              <div class="timetop">
                  <div class="col-xs-1"></div>
                  <div class="col-xs-10">
                    选择车险生效时间
                  </div>
                  <div class="col-xs-1" @click="endtime=false">
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
                <van-datetime-picker v-model="currentDate" type="date" visible-item-count="3" :min-date="minDate" />
                  <div class="submit">
                    <button  @click="getEndTime">
                      确定
                    </button>
                  </div>
             </div>
            </van-popup>    
  
     <van-popup v-model="carshow" position="bottom" :overlay="true" class="carshow popup-car"  >
         <div class="timetop car">
            <div class="col-xs-1"></div>
            <div class="col-xs-10">
              选择车牌号
            </div>
            <div class="col-xs-1" @click="carshow=false">
              <img :src="httpUrl+'modal/timeClose.png'" />
            </div>  
          </div>
         <van-picker class="carnumber" :columns="carlist" @change="onChange" />

      </van-popup>    



      <div class="top-head row insuranceTop">
        <div class="col-xs-3">
          <img class="back" :src="httpUrl+'goback.png'"  @click="onClickLeft">
        </div>
        <div class="col-xs-6">
            <p>预约车险</p>
        </div>
        <div class="col-xs-3" @click="goResult">
          <p>我的预约单</p>
        </div>
      </div>
      <div class="imgtop from_top">
        <img :src="httpUrl+'modal/InsuranceTop.jpg'" >
        <p>预约金:</p>
        <h1>￥{{Insurance}}</h1>
      </div>
      
    <div class="shadow"></div>

    <div class="insuranceTime">
       <div class="inputBox_t">
        <p>预约车险生效时间:</p>
         <div class="timeselect" @click="chooseTime">
         <input type="text" placeholder="请选择" v-model="timeStr" readonly="readonly"/>
         <img :src="httpUrl+'modal/carselect.png'" alt="">
        </div>
         <span>~</span>
         <div class="timeselect select2" @click="endTime">
         <input type="text" placeholder="请选择" v-model="endTimeStr" readonly="readonly"/>
         <img :src="httpUrl+'modal/carselect.png'" alt="">
        </div>
       </div>
       <div class="inputBox_c">
        <p>选择车辆:</p>
        <div class="carselect" @click="chooseCar">
         <input type="text" placeholder="请选择" v-model="carValue" readonly="readonly" />
         <img :src="httpUrl+'modal/carselect.png'" alt="">
        </div> 
       </div>
      <div class="content2">
        <p>1.预约车险可提享受保养服务。  </p>
        <p>2.凡是预约车险的用户在享受过一次保养服务后，保险预约金便不可退还。</p>
      </div>
    </div>
     <div class="shadow"></div>
     <!-- 支付方式 -->
     <div class="paytype">
       <h3>支付方式</h3>
       <div class="radioGroup">
        <!-- <div class="payitem">
         <div class="col-xs-1">
           <img :src="httpUrl+'modal/zhifubaopay.png'">
         </div>
         <div class="col-xs-10">支付宝支付</div>
         <div class="col-xs-1">
            <div class="radiobox">   
            <input type="radio" id="quest01-chose01" checked="checked" name="quest01" />
             <span></span>
            </div>
         </div>
       </div> -->
       <div class="payitem">
         <div class="col-xs-1">
           <img :src="httpUrl+'modal/weixinpay.png'">
         </div>
         <div class="col-xs-10">微信支付</div>
         <div class="col-xs-1">
            <div class="radiobox">   
            <input type="radio" id="quest01-chose01" checked="checked" name="quest01" />
             <span></span>
            </div>
         </div>
       </div>
       </div>      
     </div>
     <div class="shadow"></div>
     <div class="fixmargin"></div>
     <!-- 提交按钮 -->
     <div class="submitCarInsur">
        <div class="submit">
          <button  @click="toPay">
            支付预约金
          </button>
        </div>
     </div>
  






    </div>    
</template>


<script>
import "../../style/common/css/modal.scss";
import { DatetimePicker, Popup, Picker, Toast } from "vant";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      Insurance: 2000,
      carshow: false,
      formtime: false,
      endtime: false,
      currentDate: new Date(),
      minDate: new Date(),
      timeStr: "",
      endTimeStr: "",
      carValue: "",
      carlist: [""],
      idlist: [""],
      id: ""
    };
  },
  components: {
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

      axios
        .post(
          _this.apihttpUrl + "api/user/vehicle/list?platform=weixin&version=1000&page=1&row=30",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            var list = response.data.data.info;
            for (var i = 0; i < list.length; i++) {
              _this.carlist.push(list[i].license_plate_number);
              _this.idlist.push(list[i].id);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.push({
        path: "/"
      });
    },
    goResult() {
      this.$router.push({
        path: "/CarInsuranceList"
      });
    },
    chooseTime() {
      this.formtime = true;
    },
    endTime() {
      this.endtime = true;
    },
    chooseCar() {
      this.carshow = true;
    },
    toPay() {
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

      if (_this.timeStr == "" || _this.endTimeStr == "") {
        Toast("车险生效时间不能为空");
        return false;
      }
      if (_this.timeStr < nowDate) {
        Toast("车险生效时间不能小于当前时间");
        return false;
      }
      if (_this.timeStr < nowDate) {
        Toast("车险生效时间不能小于当前时间");
        return false;
      }
      if (_this.endTimeStr <= _this.timeStr) {
        Toast("结束时间必须大于开始时间");
        return false;
      }
      if (_this.carValue == "") {
        Toast("车辆不能为空");
        return false;
      }

      axios
        .post(
          _this.apihttpUrl + "api/user/userInsuranceOrder/reservationCreate?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            user_vehicle_id: _this.id,
            insurance_start_date: _this.timeStr,
            insurance_end_date: _this.endTimeStr,
            payment_method: 2
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode === 0) {
            window.location.href = response.data.data.pay;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.CarChoose = false;
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
    getEndTime() {
      this.endtime = false;
      var endTimeObj = this.currentDate;
      var year = endTimeObj.getFullYear();
      var month = endTimeObj.getMonth() + 1;
      var day = endTimeObj.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.endTimeStr = year + "-" + month + "-" + day;
    },
    //车牌的改变
    onChange(picker, value, index) {
      this.carshow = false;
      this.carValue = value;
      this.id = this.idlist[index];
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


