<template>
  <div class="AddressEditmore">
    <div class="noticebody">
      <myHeader title="新增收货地址"/>
    </div>

    <div class="addressEditmore from_top">
      <van-address-edit
        :area-list="areaList"
        :search-result="searchResult"
        :addressInfo="addressInfo"
        @save="onSave"
        @change-detail="onChangeDetail"
      />

      <div class="button">
        <div class="info" @click="chooseDefault()">
          <div class="radiobox">
            <input type="checkbox" v-model="checked">
            <span></span>
          </div>
          <p>设为默认地址</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type2.scss";
</style>

<script>
// 引用城市区选择插件
import myHeader from "@/components/Header";
import axios from "axios";
import qs from "qs";
import area from "../../style/common/js/area.js";
import { Toast, Popup, Picker, Area, AddressEdit } from "vant";
let serverUrl = "../../../static/"; // 本地调试时git
// let serverUrl = "http://offer.net199.com/"; // 打包部署上线时
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      areaJosnUrl: serverUrl + "area.json",
      areaList: area,
      searchResult: [],
      checked: false,
      is_default: 0,
      name: "",
      tel: "",
      province: "",
      city: "",
      county: "",
      areaCode: "",
      addressDetail: "",
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: ""
      }
    };
  },
  components: {
    myHeader,
    [Toast]: Toast,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Area.name]: Area,
    [AddressEdit.name]: AddressEdit
  },

  created() {
    this.initData();
  },
  methods: {
    onSave(value) {
      console.log(value);
      var _this = this;
      var code = value.areaCode;
      if (value.province === value.city) {
        _this.province_id = code.substring(0, 2) + "0000";
        _this.city_id = _this.province_id;
        _this.county_id = code;
      } else if(value.city === value.county){
        _this.province_id = code.substring(0, 2) + "0000";
        _this.city_id = code.substring(0, 4) + "00";
        _this.county_id = code.substring(0, 4) + "00";
      } else {
        _this.province_id = code.substring(0, 2) + "0000";
        _this.city_id = code.substring(0, 4) + "00";
        _this.county_id = code;
      }
      axios
        .post(
          _this.apihttpUrl + "api/address/edit?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: this.$route.query.addressId,
            province_id: _this.province_id,
            city_id: _this.city_id,
            district_id: _this.county_id,
            address: value.addressDetail,
            contact_name: value.name,
            contact_phone: value.tel,
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
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区"
          }
        ];
      } else {
        this.searchResult = [];
      }
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
              _this.addressInfo.id = info.id;
              _this.addressInfo.name = info.contact_name;
              _this.addressInfo.tel = info.contact_phone;
              _this.addressInfo.province = info.province_name;
              _this.addressInfo.city = info.city_name;
              _this.addressInfo.county = info.district_name;
              _this.addressInfo.areaCode = info.district_id;
              _this.addressInfo.addressDetail = info.address;
              console.log(_this.addressInfo);
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
    }
  }
};
</script>



