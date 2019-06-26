<template>
  <div class="AddressEdit">
    <div class="noticebody">
      <myHeader title="新增收货地址"/>
    </div>
    <div class="addressEdit from_top">
      <div class="inputBox">
        <span>收货人:</span>
        <input type="text" placeholder="请输入收货人姓名" v-model="name">
      </div>
      <div class="inputBox">
        <span>联系电话:</span>
        <input type="text" placeholder="请输入收货人联系电话" v-model="mobile">
      </div>
      <!-- <div class="inputBox">
      <span>所在区域:</span>-->
      <!-- 城市区选择插件 -->
      <!-- <v-distpicker @province="onChangeProvince"  @city="onChangeCity" @area="onChangeArea"></v-distpicker> -->
      <!-- <v-distpicker :area="select.area" @area="onChangeArea"></v-distpicker> -->
      <!-- </div> -->
      <div class="inputBox">
        <span>所在区域:</span>
        <div @click="chooseAddress()" class="address">
          <input type="text" placeholder="请选择收货地址" v-model="addressStr" readonly="readonly">
          <img :src="httpUrl+'modal/carselect.png'" alt>
        </div>
      </div>

      <div class="inputBox last">
        <textarea placeholder="请输入详细地址" v-model="address"></textarea>
      </div>
      <div class="button">
        <div class="info" @click="chooseDefault()">
          <div class="radiobox">
            <input type="checkbox" v-model="checked">
            <span></span>
          </div>
          <p>设为默认地址</p>
        </div>
      </div>

      <!-- 选择弹框 -->
      <van-popup v-model="show" position="bottom" :overlay="true" class="addressShow popup-car">
        <div class="timetop car">
          <div class="col-xs-1"></div>
          <div class="col-xs-10">选择所在地区</div>
          <div class="col-xs-1" @click="show=false">
            <img :src="httpUrl+'modal/timeClose.png'">
          </div>
        </div>
        <!-- <van-picker class="carnumber" :columns="addresslist" @change="onChange" visible-item-count="5" /> -->
        <van-area
          :area-list="areaList"
          visible-item-count="3"
          @change="onchange"
          @confirm="getAddress()"
          :value="province_id,city_id,district_id"
        />
        <div class="submit">
          <button @click="getAddress()">确定</button>
        </div>
      </van-popup>
    </div>
    <div class="bottom_button">
      <button @click="saveAddress">保存</button>
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
// 引用城市区选择插件
import VDistpicker from "v-distpicker";
import myHeader from "@/components/Header";
import axios from "axios";
import qs from "qs";
import area from "../../style/common/js/area.js";
import { Toast, Popup, Picker, Area } from "vant";
let serverUrl = "../../../static/"; // 本地调试时git
// let serverUrl = "http://offer.net199.com/"; // 打包部署上线时
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      areaJosnUrl: serverUrl + "area.json",
      checked: false,
      province_id: "",
      city_id: "",
      district_id: "",
      name: "",
      mobile: "",
      address: "",
      select: {
        province: "省",
        city: "市",
        area: "区"
      },
      is_default: "0",
      popAddress: "",
      show: false,
      addresslist: "",
      areaList: area,
      adressName: "",
      addressStr: ""
    };
  },
  components: {
    myHeader,
    VDistpicker,
    [Toast]: Toast,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Area.name]: Area
  },

  created() {
    this.initData();
  },
  methods: {
    onchange(index, value) {
      var _this = this;
      _this.province_id = value[0].code;
      _this.city_id = value[1].code;
      _this.district_id = value[2].code;
      _this.adressName =
        value[0].name + "   " + value[1].name + "   " + value[2].name + "   ";

      // console.log(value);
      // console.log(_this.adressName);
    },
    getAddress() {
      if(this.adressName){
        this.addressStr = this.adressName;
        this.show = false;
      }else{
        this.addressStr = this.areaList.province_list[110000] + "   " +this.areaList.city_list[110100]+ "   " +this.areaList.county_list[110101]+ "   ";
        this.province_id = 110000;
        this.city_id = 110100;
        this.district_id = 110101;
        this.show = false;
      }
      // this.addressStr = this.adressName;
      // this.show = false;
    },
    chooseAddress() {
      this.show = true;
    },
    chooseDefault() {
      var _this = this;
      _this.checked = !_this.checked;
      if (_this.checked == true) {
        _this.is_default = 1;
        console.log(_this.is_default + "第一个");
      } else {
        _this.is_default = 0;
        console.log(_this.is_default + "第二个");
      }
    },
    onChangeProvince(a) {
      this.province_id = a.code;
      console.log(this.province_id);
    },
    onChangeCity(a) {
      this.city_id = a.code;
      console.log(this.city_id);
    },
    onChangeArea(a) {
      this.district_id = a.code;
      console.log(this.district_id);
    },
    initData() {
      // this.$http.get(this.areaJosnUrl).then(response => {
      //   let areaList = response.body;
      // });
      // 判断是否为编辑
      if (this.$route.query.addressId) {
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/address/info?platform=weixin&version=1000&id=" +
              this.$route.query.addressId,
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            console.log(response.data);
            if (response.data.errorCode === 0) {
              var info = response.data.data.info;
              _this.name = info.contact_name;
              _this.mobile = info.contact_phone;
              _this.province_id = info.province_id;
              _this.city_id = info.city_id;
              _this.district_id = info.district_id;
              _this.address = info.address;
              _this.addressStr =
                info.province_name +
                "   " +
                info.city_name +
                "   " +
                info.district_name +
                "   ";
               
              // _this.select.province = info.province_name;
              // _this.select.city = info.city_name;
              // _this.select.area = info.district_name;
              _this.is_default = info.is_default;
              if (info.is_default == 1) {
                _this.checked = true;
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    saveAddress() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/address/edit?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: this.$route.query.addressId,
            province_id: _this.province_id,
            city_id: _this.city_id,
            district_id: _this.district_id,
            address: _this.address,
            contact_name: _this.name,
            contact_phone: _this.mobile,
            is_default: _this.is_default
          })
        )
        .then(function(response) {
          console.log(response.data);
          if (response.data.errorCode === 0) {
            Toast.success(response.data.message.message);
            // 如果从确认订单页进去地址列表
            if (_this.$route.query.orderFrom) {
              setTimeout(() => {
                _this.$router.go(-1);
              }, 1000);
            } else {
              setTimeout(() => {
                _this.$router.go(-1);
              }, 1000);
            }
          } else {
            Toast.fail(response.data.message.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>



