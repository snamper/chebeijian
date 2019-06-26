<template>
  <div class="AddInvoice">
    <div class="noticebody">
      <myHeader title="添加发票"/>
    </div>
    <div class="addBox from_top">
      <span>
        <em>*</em> 开具类型:
      </span>
      <div class="radioGroup">
        <!-- radio -->
        <div class="info">
          <div class="radiobox" @click="toPersonal">
            <input type="radio" id="quest01-chose01" name="quest01" value="1" v-model="issueType">
            <span></span>
          </div>
          <p>个人</p>
        </div>
        <div class="info">
          <div class="radiobox" @click="toCompany">
            <input
              type="radio"
              id="quest01-chose02"
              checked="checked"
              value="2"
              name="quest01"
              v-model="issueType"
            >
            <span></span>
          </div>
          <p>企业</p>
        </div>
      </div>
      <div class="company" v-if="company">
        <div class="inputBox">
          <span>
            <em>*</em> 发票抬头:
          </span>
          <input type="text" placeholder="请输入您的真实姓名" v-model="invoiceTitle">
        </div>
        <div class="model2">
          <span>
            <em>*</em> 发票类型:
          </span>
          <div class="radioGroup">
            <!-- radio -->
            <div class="info">
              <div class="radiobox">
                <input
                  type="radio"
                  id="quest01-chose01"
                  value="1"
                  checked="checked"
                  name="quest02"
                  v-model="invoiceType"
                >
                <span></span>
              </div>
              <p>企业增值税普通发票</p>
            </div>
            <div class="info">
              <div class="radiobox">
                <input
                  type="radio"
                  id="quest01-chose02"
                  value="2"
                  name="quest02"
                  v-model="invoiceType"
                >
                <span></span>
              </div>
              <p>企业增值税专用发票</p>
            </div>
          </div>
        </div>
        <div class="inputBox">
          <span>
            <em>*</em> 税务登记号:
          </span>
          <input type="text" placeholder="请输入您税务登记证上的编号" v-model="taxNo">
        </div>
        <div class="inputBox">
          <span>
            <em v-if="invoiceType==2">*</em> 基本开户银行的名称:
          </span>
          <input type="text" placeholder="请输入您开户许可证上面的开户银行" v-model="bank">
        </div>
        <div class="inputBox">
          <span>
            <em v-if="invoiceType==2">*</em> 开户账号:
          </span>
          <input
            type="text"
            placeholder="请输入您开户许可证上面的银行账号"
            v-model="bankNo"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
        </div>
        <div class="inputBox">
          <span>
            <em v-if="invoiceType==2">*</em> 注册场所地址:
          </span>
          <input type="text" placeholder="请输入您营业执照上面的注册地址" v-model="registerAddress">
        </div>
        <div class="inputBox">
          <span>
            <em v-if="invoiceType==2">*</em> 注册固定电话:
          </span>
          <input type="text" placeholder="请输入您公司有效的联系电话" v-model="registerPhone">
        </div>
      </div>
      <div class="personal" v-if="personal">
        <div class="inputBox">
          <span>发票抬头:</span>
          <input type="text" placeholder="请输入您的真实姓名" v-model="invoiceTitle">
        </div>
        <div class="model">
          <p>发票类型:
            <span>增值税普通发票</span>
          </p>
        </div>
      </div>

      <div class="button">
        <div class="info" @click="chooseDefault()">
          <div class="radiobox">
            <input type="checkbox" v-model="checked">
            <span></span>
          </div>
          <p>设为默认发票</p>
        </div>
      </div>
    </div>
    <div class="bottom_button">
      <button @click="doInvoiceAdd">保存</button>
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
      company: false,
      personal: true,
      issueType: 0,
      options: [
        { text: "个人", value: "个人" },
        { text: "企业", value: "企业" }
      ],
      invoiceTitle: "",
      taxNo: "",
      bank: "",
      bankNo: "",
      registerAddress: "",
      registerPhone: "",
      invoiceType: 1,
      checked: "",
      isDefault: ""
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
      _this.issueType = _this.$route.query.type;
      if (_this.issueType == 2) {
        _this.company = true;
      }
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
              _this.taxNo = info.tax_no;
              _this.bank = info.bank;
              _this.bankNo = info.bank_no;
              _this.registerAddress = info.register_address;
              _this.registerPhone = info.register_telephone;
              _this.invoiceType = info.invoice_type;
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
    doInvoiceAdd() {
      var _this = this;
      if (_this.issueType == undefined) {
        Toast("请选择开具类型");
        return false;
      }
      if (_this.invoiceType == undefined && _this.issueType == 2) {
        Toast("请选择发票类型");
        return false;
      }
      if (!_this.bank && _this.issueType == 2 && _this.invoiceType == 2) {
        Toast("请输入开户行的名称");
        return false;
      }
      if (!_this.bankNo && _this.issueType == 2 && _this.invoiceType == 2) {
        Toast("请输入开户行账号");
        return false;
      }
      if (
        !_this.registerAddress &&
        _this.issueType == 2 &&
        _this.invoiceType == 2
      ) {
        Toast("请输入注册场所地址");
        return false;
      }
      if (
        !_this.registerPhone &&
        _this.issueType == 2 &&
        _this.invoiceType == 2
      ) {
        Toast("请输入注册固定电话");
        return false;
      }
      if (_this.invoiceType == undefined && _this.issueType == 1) {
        _this.invoiceType = 1;
      }
      if(this.$route.query.orderFrom){

        axios
        .post(
          _this.apihttpUrl + "api/user/userInvoice/edit?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: _this.$route.query.id,
            invoice_title: _this.invoiceTitle,
            tax_no: _this.taxNo,
            bank: _this.bank,
            bank_no: _this.bankNo,
            register_address: _this.registerAddress,
            register_telephone: _this.registerPhone,
            opening_type: _this.issueType,
            invoice_type: _this.invoiceType,
            is_default: _this.isDefault
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.push({
                path: "InvoiceList", query: { orderFrom: 'orderFrom' }});
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });

      }else{

        axios
        .post(
          _this.apihttpUrl + "api/user/userInvoice/edit?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: _this.$route.query.id,
            invoice_title: _this.invoiceTitle,
            tax_no: _this.taxNo,
            bank: _this.bank,
            bank_no: _this.bankNo,
            register_address: _this.registerAddress,
            register_telephone: _this.registerPhone,
            opening_type: _this.issueType,
            invoice_type: _this.invoiceType,
            is_default: _this.isDefault
          })
        )
        .then(function(response) {
          Toast(response.data.message);
          if (response.data.errorCode == 0) {
            setTimeout(() => {
              _this.$router.go(-1);
            }, 900);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }
      
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
    toPersonal() {
      this.personal = true;
      this.company = false;
    },
    toCompany() {
      this.personal = false;
      this.company = true;
    }
    // goPersonalAddInvoice() {
    //   this.$router.push({
    //     path: "PersonalAddInvoice"
    //   });
    // }
  }
};
</script>


