<template>
  <div class="AddCar">
    <div class="noticebody">
      <header class="app-header navbar">
        <div class="top-head row">
          <div class="col-xs-12">
            <img class="back" :src="httpUrl+'/goback.png'" @click="onClickLeft">
            <p>我的车辆</p>
            <!-- <div class="editor">
              <img :src="httpUrl+'icon_top_.png'" alt @click="show3=true" id="wxsys">
            </div>-->
          </div>
        </div>
      </header>
    </div>
    <div class="addCar-content from_top">
      <div class="cd_title">基本信息</div>
      <div class="addBox">
        <div class="inputBox">
          <span>
            <em>*</em> 汽车VIN码:
          </span>
          <input type="text" placeholder="请输入汽车VIN码" v-model="vinCode">
          <p @click="getVimInfo">
            <span>从VIN码中获取车辆信息</span>
          </p>
        </div>
        <!-- <div class="inputBox">
          <span><em>*</em> 车牌号:</span>
          <div class="carselect" @click="chooseCar">
            <input type="text" placeholder="请选择" v-model="carValue"/>
            <img :src="httpUrl+'modal/carselect.png'" alt="">
            </div>
        </div>-->
        <div class="inputBox">
          <span>
            <em>*</em> 车牌号:
          </span>
          <input type="text" placeholder="请输入车牌号" v-model="carValue">
        </div>

        <div class="inputBox">
          <span><em>*</em> 发动机型号(新能源电机号):</span>
          <input type="text" placeholder="请输入发动机型号" v-model="engineNumber">
        </div>
        <div class="inputBox">
          <span>变速箱类型:</span>
          <input type="text" placeholder v-model="gearBox">
        </div>
        <div class="inputBox">
          <span>
            <em>*</em> 厂家:
          </span>
          <input type="text" placeholder v-model="companyName" disabled="disabled">
        </div>
        <div class="inputBox">
          <span>
            <em>*</em> 品牌:
          </span>
          <input type="text" placeholder v-model="brandName" disabled="disabled">
        </div>
        <div class="inputBox">
          <span>
            <em>*</em> 车型:
          </span>
          <input type="text" placeholder v-model="standardName3" disabled="disabled">
        </div>
        <div class="inputBox">
          <span>排量:</span>
          <input type="text" placeholder v-model="displacement" disabled="disabled">
        </div>
      </div>
      <div class="cd_title">类型参数</div>
      <div class="addBox">
        <div class="inputBox">
          <span>
            <em>*</em> 提车时间:
          </span>
          <div class="timeselect" @click="chooseTime(1)">
            <input type="text" placeholder="请选择提车时间" v-model="timeStr" readonly="readonly">
            <img :src="httpUrl+'modal/carselect.png'" alt>
          </div>
        </div>
        <div class="inputBox">
          <span>
            <em>*</em> 年审到期时间:
          </span>
          <div class="timeselect" @click="chooseTime(2)">
            <input type="text" placeholder="请选择年审到期时间" v-model="yearTime" readonly="readonly">
            <img :src="httpUrl+'modal/carselect.png'" alt>
          </div>
        </div>
        <div class="inputBox">
          <span>已行驶公里数:</span>
          <input
            type="text"
            placeholder
            v-model="drivingKilometers"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
        </div>
        <div class="inputBox">
          <span>最大马力:</span>
          <input type="text" placeholder v-model="zdml" disabled="disabled">
        </div>
        <div class="inputBox">
          <span>最大功率:</span>
          <input type="text" placeholder v-model="zdgl" disabled="disabled">
        </div>
        <div class="inputBox">
          <span>最大扭矩:</span>
          <input type="text" placeholder v-model="zdnj" disabled="disabled">
        </div>
      </div>
      <div class="shadow"></div>
      <div class="button">
        <div class="info" @click="chooseDefault()">
          <div class="radiobox">
            <input type="checkbox" v-model="checked">
            <span></span>
          </div>
          <p>设为默认</p>
        </div>
      </div>
    </div>

    <div class="bottom_button">
      <div class="cancel">
        <button @click="doCancal">取消</button>
      </div>
      <div class="hold">
        <button @click="doAddCar">保存</button>
      </div>
    </div>

    <!-- 扫码获取信息弹窗 -->
    <div class="mask" v-show="show"></div>
    <div class="popup" v-show="show">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <ul>
          <li v-for="(item, index) in vehicleModelList" :key="index" @click="getvinid(item.vehicle_model.id)">
            <div class="fl">
              <p></p>
            </div>
            <div class="fr">{{item.vehicle_model.vehicleName}}</div>
          </li>
        </ul>
      </div>
      <div class="popuo_footer">
        <button class="cancel" @click="show=flase">取消</button>
      </div>
    </div>

    <!-- 选择弹框 -->
    <van-popup v-model="formtime" position="bottom" :overlay="true" class="popup-car">
      <div class="timetop">
        <div class="col-xs-1"></div>
        <div class="col-xs-10">选择时间</div>
        <div class="col-xs-1" @click="formtime=false">
          <img :src="httpUrl+'modal/timeClose.png'">
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
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :item-height="itemHeight"
          :confirm-button-text="confirmButtonText"
          :cancel-button-text="cancelButtonText"
          :max-date="maxDate"
          visible-item-count="3"
        />
        <div class="submit">
          <button @click="getFromTime(type)">确定</button>
        </div>
      </div>
    </van-popup>
    <!-- <van-popup v-model="carshow" position="bottom" :overlay="true" class="carshow popup-car"  >
         <div class="timetop car">
            <div class="col-xs-1"></div>
            <div class="col-xs-10">
              选择车牌号
            </div>
            <div class="col-xs-1" @click="carshow=false">
              <img :src="httpUrl+'modal/timeClose.png'" />
            </div>
          </div>
         <van-picker class="carnumber" :columns="carlist" @change="onChange" visible-item-count="5" />

    </van-popup>-->
    <!-- 提示 -->
    <div class="mask" v-show="show3"></div>
    <div class="popup" v-show="show3">
      <div class="popup_head">
        <p class="popup_title"></p>
      </div>
      <div class="popup_content">
        <p>请下载APP进行拍照识别!</p>
      </div>
      <div class="popuo_footer">
        <button class="ensure but" @click="show3=false">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import { DatetimePicker, Popup, Picker, Toast } from "vant";
import axios from "axios";
import qs from "qs";
import wx from "weixin-js-sdk";
import $ from "jquery";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      // carshow: false,
      formtime: false,
      type: "",
      currentDate: new Date(),
      // minDate: new Date(),
      timeStr: "",
      yearTime: "",
      endTimeStr: "",
      carValue: "",
      show: false,
      show3: false,
      httpUrl: domain.iconUrl,
      vinCode: "",
      engineNumber: "",
      gearBox: "",
      vehicleModelId: "",
      drivingKilometers: "",
      companyName: "",
      brandName: "",
      standardName3: "",
      displacement: "",
      zdml: "",
      zdgl: "",
      zdnj: "",
      checked: "",
      isDefault: "",
      vehicle_model: {},
      vehicleModelList:[]
    };
  },
  components: {
    [Toast.name]: Toast,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      var id = _this.$route.query.id;
      if (id !== 0) {
        // _this.vinCode = _this.$route.query.vinCode;
        axios
          .post(
            _this.apihttpUrl + "api/user/vehicle/info?platform=weixin&version=1000&id=" +
              id,
            qs.stringify({
              token: window.localStorage.getItem("token"),
              id: id
            })
          )
          .then(function(response) {
            // Toast(response.data.message);
            if (response.data.errorCode == 0) {
              console.log(response.data.data);
              var detail = response.data.data;

              _this.vinCode = detail.info.vin_code;
              _this.engineNumber = detail.info.engine_number;
              _this.vehicleModelId = detail.info.vehicle_model_id;
              _this.drivingKilometers = detail.info.driving_kilometers;
              _this.carValue = detail.info.license_plate_number;
              _this.timeStr = detail.info.mention_vehicle_date;
              _this.yearTime = detail.info.annual_review_deadline;
              _this.companyName = detail.vehicle_model.companyName;
              _this.brandName = detail.vehicle_model.brand_name;
              _this.standardName3 = detail.vehicle_model.vehicleAlias;
              _this.displacement = detail.vehicle_model.displacement;
              _this.zdml = detail.vehicle_model_engine.zdml;
              _this.zdgl = detail.vehicle_model_engine.zdgl;
              _this.zdnj = detail.vehicle_model_engine.zdnj;
              _this.gearBox = detail.vehicle_model_gearbox.bxslx;

              if (detail.info.is_default == 1) {
                _this.checked = true;
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    getvinid(id){
      var _this=this
      axios
        .get(
          _this.apihttpUrl + "api/vehicle/vehicleModel",{
            params: {
            platform: "weixin",
            version: "1000",
            id: id
          }
         })
        .then(function(response) {
          if (response.data.errorCode == 0) {
              _this.show=false
              var detail = response.data.data;

              _this.id=detail.vehicle_model.id;
              _this.companyName = detail.vehicle_model.companyName;
              _this.brandName = detail.vehicle_model.brand_name;
              _this.standardName3 = detail.vehicle_model.vehicleAlias;
              _this.displacement = detail.vehicle_model.displacement;
              _this.zdml = detail.vehicle_model_engine.zdml;
              _this.zdgl = detail.vehicle_model_engine.zdgl;
              _this.zdnj = detail.vehicle_model_engine.zdnj;
              _this.gearBox = detail.vehicle_model_gearbox.bxslx;

              if (detail.info.is_default == 1) {
                _this.checked = true;
              }
            }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    doAddCar() {
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

      // var carReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      var carReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[a-zA-Z_0-9]{5}$/;
      let car_number = carReg.test(_this.carValue);
      if (!_this.vinCode) {
        Toast("请输入VIN码");
        return false;
      }else{
        axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleModelToWin?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            winCode: _this.vinCode
          })
        )
        .then(function(response) {
          if (response.data.errorCode != 0){
            Toast('VIN码错误，未查询到车辆');
            return false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }
      
      
      if (!_this.companyName) {
        // Toast("请输入厂家");
        Toast("请通过VIN码获取车辆信息");
        return false;
      }
      if (!_this.brandName) {
        Toast("请通过VIN码获取品牌信息");
        return false;
      }
      if (!_this.standardName3) {
        Toast("请通过VIN码获取车型信息");
        return false;
      }
      if (!_this.carValue) {
        Toast("请输入车牌号");
        return false;
      }
      if (!car_number) {
        Toast("请输入正确的车牌号,格式:皖B12345");
        return false;
      }
      if (!_this.engineNumber) {
        Toast("请输入发动机型号");
        return false;
      }
      if (!_this.timeStr) {
        Toast("请选择提车时间");
        return false;
      }
      // if (_this.timeStr <= nowDate) {
      //   Toast("提车时间必须大于当前时间");
      //   return false;
      // }

      if (!_this.yearTime) {
        Toast("请选择年审到期时间");
        return false;
      }
      if(!_this.drivingKilometers){
        Toast("请输入已行驶公里数");
        return false;
      }
      // if (_this.yearTime <= nowDate) {
      //   Toast("年审到期时间必须大于当前时间");
      //   return false;
      // }

      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleModelToWin?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            winCode: _this.vinCode
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            axios
              .post(
                _this.apihttpUrl + "api/user/vehicle/insertOrUpdate?platform=weixin&version=1000",
                qs.stringify({
                  token: window.localStorage.getItem("token"),
                  id: _this.$route.query.id,
                  vehicle_model_id: _this.id,
                  vin_code: _this.vinCode,
                  license_plate_number: _this.carValue,
                  engine_number: _this.engineNumber,
                  mention_vehicle_date: _this.timeStr,
                  annual_review_deadline: _this.yearTime,
                  driving_kilometers: _this.drivingKilometers,
                  is_default: _this.isDefault
                })
              )
              .then(function(response) {
                Toast(response.data.message);
                if (response.data.errorCode == 0) {
                  console.log(response.data.data.info);

                  setTimeout(() => {
                    _this.$router.go(-1);
                  }, 900);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 根据vim码获取车辆信息
    getVimInfo() {
      var _this = this;
      if (_this.vinCode == "") {
        Toast("请输入汽车的VIM码");
        return;
      }
      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleModelToWin?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            winCode: _this.vinCode
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            _this.show=true
            _this.vehicleModelList=response.data.data.vehicleModelList
            console.log(response.data.data);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //设置默认
    chooseDefault() {
      var _this = this;
      _this.checked = !_this.checked;
      if (_this.checked == true) {
        _this.isDefault = 1;
      } else {
        _this.is_default = 0;
      }
    },
    // chooseCar() {
    //   this.carshow = true;
    // },
    chooseTime(type) {
      this.formtime = true;
      this.type = type;
    },
    // //车牌的改变
    // onChange(picker, value, index) {
    //   this.carshow = false;
    //   this.carValue = value;
    // },
    doCancal() {
      window.history.go(-1);
    },
    //获取当前选择时间
    getFromTime(type) {
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

      console.log(timeObj);
      if (type == 1) {
        this.timeStr = year + "-" + month + "-" + day;
      } else {
        this.yearTime = year + "-" + month + "-" + day;
      }
    },
    onClickLeft() {
      window.history.go(-1);
    },
    // 微信扫码
    // doSeeCar() {
    //   var _this = this;
    //   axios
    //     .post(
    //       _this.apihttpUrl + "api/public/wxConfig?platform=weixin&version=1000&url=" +
    //         location.href.split("#")[0],
    //       qs.stringify({
    //         token: window.localStorage.getItem("token")
    //       })
    //     )
    //     .then(function(response) {
    //       if (response.data.errorCode == 0) {
    //         wx.config({
    //           debug: false,
    //           appId: response.data.data.share_parameter.app_id, // 必填，公众号的唯一标识
    //           timestamp: response.data.data.share_parameter.time_stamp, // 必填，生成签名的时间戳
    //           nonceStr: response.data.data.share_parameter.nonce_str, // 必填，生成签名的随机串
    //           signature: response.data.data.share_parameter.signature, // 必填，签名
    //           jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
    //         });
    //         wx.ready(function() {
    //           wx.scanQRCode({
    //             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //             scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //             success: function(res) {
    //               // 回调
    //               // alert('获得vin码：'+res.resultStr.split(',')[1])
    //               _this.vinCode = res.resultStr.split(",")[1];
    //             }
    //           });
    //         });
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    //  微信扫码

    chooseImage() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/public/wxConfig?platform=weixin&version=1000&url=" +
            location.href.split("#")[0],
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            wx.config({
              debug: false,
              appId: response.data.data.share_parameter.app_id, // 必填，公众号的唯一标识
              timestamp: response.data.data.share_parameter.time_stamp, // 必填，生成签名的时间戳
              nonceStr: response.data.data.share_parameter.nonce_str, // 必填，生成签名的随机串
              signature: response.data.data.share_parameter.signature, // 必填，签名
              jsApiList: ["chooseImage"] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {
              wx.chooseImage({
                count: 1, // 默认9
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                  var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                  let formData = new FormData();
                  formData.append("operatorCode", "AFS180319");
                  formData.append(
                    "operatorPwd",
                    "85d52ed8e8a7aa2488bf1bda450e8ad4"
                  );
                  formData.append("requestCode", "700102");
                  formData.append("localIds", localIds);
                  axios
                    .post("http://www.easyepc123.com/api/myservlet", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data"
                      }
                    })
                    .then(function(res) {
                      alert(res);
                    })
                    .catch(function(res) {
                      alert(res);
                    });
                }
              });
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