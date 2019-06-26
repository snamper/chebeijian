<template>
  <div class="InvoiceList">
    <header class="app-header navbar">
      <div class="top-head row">
        <div class="col-xs-12">
          <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
          <p>选择发票</p>
        </div>
      </div>
    </header>
    <div class="InvoiceList_box from_top" v-if="isHas">
      <div class="InvoiceList_item" v-for="(item,index) in incoiveList" :key="index">
        <div class="center" @click="changeDefault(item.id)">
          <div class="col-xs-5">
            <p>开具类型:{{item.opening_type_str}}</p>
          </div>
          <div class="col-xs-7">
            <p>类型:{{item.invoice_type_str}}</p>
          </div>
          <div class="col-xs-11">
            <p>抬头: {{item.invoice_title}}</p>
          </div>
          <div class="status" v-if="item.is_default==1">
            <img :src="httpUrl+'type/status.png'" alt>
          </div>
        </div>
        <div class="button">
          <!-- <div class="info" @click="changeDefault(item.id)">
            <div class="radiobox">
              <input type="radio" v-model="picked" :id="item.id" :value="item.id" name="checkList">
              <span></span>
            </div>
            <p>设为默认发票</p>
          </div>-->
          <button class="edit" @click="toEdit(item.id,item.opening_type)">编辑</button>
          <button class="del" @click="doDelect(item.id,index)">删除</button>
        </div>
        <div class="gray-border"></div>
      </div>
    </div>
    <div class="bottom_button">
      <button @click="goPersonalAddInvoice">添加并使用新抬头</button>
    </div>
    <div class="nodata from_top" v-if="isEmpty">
      <img :src="httpUrl+'type/noInvoice.png'" alt>
      <p>暂时没有发票信息哦</p>
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import myHeader from "@/components/Header";
import { Toast, Dialog } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      isEmpty: false,
      isHas: true,
      show: true,
      incoiveList: "",
      picked: ""
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast,
    [Dialog]: Dialog
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInvoice/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data.info);
            var list = response.data.data.info;
            if (list.length == 0) {
              _this.isEmpty = true;
              _this.isHas = false;
            } else {
              _this.isHas = true;
              _this.isEmpty = false;
              _this.incoiveList = response.data.data.info;
              var add = response.data.data.info;
              for (var i = 0; i < add.length; i++) {
                if (add[i].is_default == 1) {
                  _this.picked = add[i].id;
                }
              }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toEdit(id, type) {
      this.$router.push({
        path: "CompanyAddInvoice",
        query: {
          id: id,
          type: type
        }
      });
    },
    // 设置默认发票
    changeDefault(id) {
      if (this.$route.query.orderFrom) {
        this.picked = id;
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/user/userInvoice/setDefault?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token"),
              id: id
            })
          )
          .then(function(response) {
            if (response.data.errorCode === 0) {
              _this.$router.push({
                path: "OrderConfirm",
                query: { invoiceId: id }
              });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.picked = id;
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/user/userInvoice/setDefault?platform=weixin&version=1000",
            qs.stringify({
              token: window.localStorage.getItem("token"),
              id: id
            })
          )
          .then(function(response) {
            // Toast(response.data.message);
            if (response.data.errorCode === 0) {
              _this.initData();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    // goOrder(id) {
    //   if (this.$route.query.orderFrom) {
    //     this.picked = id;
    //     var _this = this;
    //     axios
    //       .post(
    //         _this.apihttpUrl + "api/user/userInvoice/setDefault?platform=weixin&version=1000",
    //         qs.stringify({
    //           token: window.localStorage.getItem("token"),
    //           id: id
    //         })
    //       )
    //       .then(function(response) {
    //         if (response.data.errorCode === 0) {
    //           _this.$router.push({
    //             path: "OrderConfirm",
    //             query: { invoiceId: id }
    //           });
    //         }
    //       })
    //       .catch(function(error) {
    //         console.log(error);
    //       });
    //   }
    // },
    goPersonalAddInvoice() {
      if(this.$route.query.orderFrom){
        this.$router.push({ path: "CompanyAddInvoice" , query: { orderFrom: 'orderFrom' }});
      }else{
        this.$router.push({ path: "CompanyAddInvoice" });
      }
      
    },
    doDelect(id, index) {
      Dialog.confirm({
        title: "确认删除发票？"
      })
        .then(() => {
          // on confirm
          console.log("你点击了确认");
          var _this = this;
          axios
            .post(
              _this.apihttpUrl + "api/user/userInvoice/delete?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                id: id
              })
            )
            .then(function(response) {
              Toast(response.data.message);
              if (response.data.errorCode == 0) {
                // _this.initData();
                _this.incoiveList.splice(index, 1);
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

    onClickLeft() {
      var _this = this;
      // if (
      //   _this.$route.query.orderFrom == "orderFrom" &&
      //   _this.incoiveList.length !== 0
      // ) {
      //   console.log(1);
      //   _this.$router.push({
      //     path: "OrderConfirm",
      //     query: {
      //       Check: "1"
      //     }
      //   });
      // } else {
      //   _this.$router.push({
      //     path: "UserIndex"
      //   });
      // }
      window.history.go(-1);
    }
  }
};
</script>


