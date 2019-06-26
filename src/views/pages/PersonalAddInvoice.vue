<template>
  <div class="AddInvoice">
    <div class="noticebody">
      <myHeader title="添加发票" />
    </div>
    <div class="addBox from_top">
      <span><em>*</em> 开具类型:</span>
      <div class="radioGroup">
        <!-- radio -->
        <div class="info">
          <div class="radiobox">   
            <input type="radio" id="quest01-chose01" checked="checked" name="quest01" />
           <span></span>
          </div>
          <p>个人</p>   
        </div>
        <div class="info">
          <div class="radiobox" @click="goCompanyAddInvoice">   
            <input type="radio" id="quest01-chose02"  name="quest01" />
           <span></span>
          </div>
          <p>企业</p>   
        </div>
      </div>
      <div class="inputBox">
        <span>发票抬头:</span>
        <input type="text" placeholder="请输入您的真实姓名" v-model="invoiceTitle">
      </div>
      <div class="model">
        <p>发票类型: <span>  增值税普通发票</span></p>
      </div>
      <div class="button">
          <div class="info">
            <div class="radiobox">   
              <input type="checkbox"  v-model="checked" @click="chooseDefault()">
             <span ></span>
            </div>
            <p>设为默认地址</p>   
          </div>
      </div>

    </div>


    <div class="bottom_button">
      <button @click="doPersonal">保存</button>
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
      selected: "first",
      options: [
        { text: "个人", value: "个人" },
        { text: "企业", value: "企业" }
      ],
      invoiceTitle: "",
      checked: "",
      isDefault: 0
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
      var id = _this.$route.query.id;
      console.log(id);
      if (id !== null) {
        axios
          .post(
            _this.apihttpUrl + "api/user/userInvoice/info?platform=weixin&version=1000&id=" +
              id,
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            // Toast(response.data.message);
            if (response.data.errorCode == 0) {
              // console.log(response.data.data.info);
              var info = response.data.data.info;
              _this.invoiceTitle = info.invoice_title;
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
    doPersonal() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInvoice/edit?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            // id: "",  后期需要传入
            invoice_title: _this.invoiceTitle,
            tax_no: 111,
            bank: "工商",
            bank_no: 345454,
            register_address: "安徽",
            register_telephone: "0553-53154611",
            opening_type: 1,
            invoice_type: 1,
            is_default: _this.isDefault
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.push({
                path: "/InvoiceList"
              });
            }, 900);
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
    goCompanyAddInvoice() {
      this.$router.push({
        path: "CompanyAddInvoice"
      });
    }
  }
};
</script>


