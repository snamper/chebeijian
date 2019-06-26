<template>
  <div class="AddressList">
    <div class="noticebody">
      <myHeader title="我的地址" />
    </div>
    <div class="adressList from_top" v-if="isHas">
      <div class="list-Item" v-for="(item,index) in adressList" :key="index" >
        <div class="center" @click="goOrder(item.id)">
          <div class="col-xs-5">
            <p >{{item.contact_name}}</p>
          </div>
          <div class="col-xs-7">
            <p>{{item.contact_phone}}</p>
          </div>
          <div class="col-xs-11">
            <p class="detail">{{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}</p>
          </div>
        </div>
        <div class="button">
          <div class="info" @click="changeDefault(item.id)">
            <div class="radiobox">
              <input type="radio" v-model="picked" :id="item.id" :value="item.id" name="checkList" >
             <span></span>
            </div>
            <p>设为默认地址</p>   
          </div>
          <button class="edit" @click="toAddressEdit(item.id)">编辑</button>
          <button class="del"  @click="delet(item.id)">删除</button>
        </div>
        <div class="gray-border"></div>
      </div>
    </div>
    <div class="bottom_button">
      <button  @click="toAddressEdit()">新增地址</button>
    </div>



  </div>
</template>

<style scoped>
@import '../../style/common/css/type.css';
</style>

<script>
import myHeader from "@/components/Header";
import axios from "axios";
import qs from "qs";
import { Dialog, Toast, AddressList } from "vant";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      adressList: [],
      picked: "",
      checked: false,
      isEmpty: false,
      isHas: true,
      httpUrl: domain.iconUrl
    };
  },
  components: {
    myHeader,
    [Dialog]: Dialog,
    [Toast]: Toast
  },
  created() {
    this.initData();
  },
  methods: {
    // 编辑按钮
    toAddressEdit(id) {
      this.$router.push({ path: "AddressEdit", query: { addressId: id } });
    },
    // 删除地址
    delet(id) {
      Dialog.confirm({
        title: "确认删除地址？"
      })
        .then(() => {
          // on confirm
          console.log("你点击了确认");
          var _this = this;
          axios
            .post(
              _this.apihttpUrl + "api/address/delete?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                id: id
              })
            )
            .then(function(response) {
              if (response.data.errorCode === 0) {
                Toast.success("已成功删除");
                _this.initData();
              } else {
                Toast(response.data.message.message);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          // on cancel
          console.log("你点击了取消");
        });
    },
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/address/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          console.log(response.data);
          if (response.data.errorCode === 0) {
            var add = response.data.data.info;
            if (add.length == 0) {
              _this.isEmpty = true;
              _this.isHas = false;
            } else {
              _this.isHas = true;
              _this.isEmpty = false;
              _this.adressList = response.data.data.info;
              var add = response.data.data.info;
              // 判断默认地址
              for (var i = 0; i < add.length; i++) {
                console.log(add[i].is_default);
                if (add[i].is_default == 1) {
                  _this.picked = add[i].id;
                  console.log(_this.picked);
                }
              }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 修改默认地址
    changeDefault(id) {
      this.picked = id;
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/address/setDefault?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id
          })
        )
        .then(function(response) {
          if (response.data.errorCode === 0) {
            _this.initData();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goOrder(id) {
      if (this.$route.query.orderFrom) {
        this.picked = id;
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/address/setDefault?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token"),
              id: id
            })
          )
          .then(function(response) {
            if (response.data.errorCode === 0) {
              _this.$router.push({ path: "OrderConfirm" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  }
};
</script>


