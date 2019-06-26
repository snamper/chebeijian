<template>
  <div class="carList">
    <div class="noticebody">
      <myHeader title="我的车辆"/>
    </div>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="carList_box from_top" v-if="isHas">
        <div class="carList_item" v-for="(item,index) in carList" :key="index">
          <div class="col-xs-12 head">
            <p>VIN ：{{item.vin_code}}</p>
          </div>
          <div class="center" @click="toDetail(item.id)">
            <div class="col-xs-5">
              <p>
                车牌号:
                <span>{{item.license_plate_number}}</span>
              </p>
            </div>
            <div class="col-xs-7">
              <p>
                公里数:
                <span>{{item.driving_kilometers}}公里</span>
              </p>
            </div>
            <div class="col-xs-12">
              <div class="fl">
                <p>品牌车型:</p>
              </div>
              <div class="fr">
                <p>
                  <span>{{item.brand_name}} {{item.engine_number}} {{item.displacement}} {{item.yearPattern}}年产</span>
                </p>
              </div>
            </div>
          </div>
          <div class="button">
            <div class="info" @click="changeDefault(item.id)">
              <div class="radiobox">
                <input
                  type="radio"
                  v-model="picked"
                  :id="item.id"
                  :value="item.id"
                  name="checkList"
                >
                <span></span>
              </div>
              <p>设为默认车辆</p>
            </div>
            <button class="edit" @click="toEdit(item.id,item.vin_code)">编辑</button>
            <button class="del" @click="delectCar(item.id,index)">删除</button>
          </div>
          <div class="gray-border"></div>
        </div>
      </div>
    </van-list>
    <div class="bottom_button">
      <button @click="toAdd">新增车辆</button>
    </div>

    <div class="nodata" v-if="isEmpty">
      <img :src="httpUrl+'no-data.png'" alt>
      <p>还没有车辆信息哦，快去添加吧~</p>
      <!-- <button>去逛逛</button> -->
    </div>
  </div>
</template>

<style scoped>
@import "../../style/common/css/type.css";
</style>

<script>
import myHeader from "@/components/Header";
import { Toast, List, Dialog } from "vant";
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      carList: "",
      isEmpty: false,
      isHas: true,
      picked: "",
      httpUrl: domain.iconUrl,
      page: 1,
      loading: false,
      finished: false
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast,
    [List.name]: List,
    [Dialog]: Dialog
  },
  created() {
    // this.onLoad();
  },
  methods: {
    onLoad() {
      var _this = this;
      var page = _this.page;
      axios
        .post(
          _this.apihttpUrl + "api/user/vehicle/list?platform=weixin&version=1000&rows=15&page=" +
            page,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          if (response.data.errorCode == 0) {
            // console.log(response.data.data.info);
            let list = response.data.data.info;

            if (list.length === 0) {
              if (_this.page === 1) {
                _this.isHas = false;
                _this.isEmpty = true;
              }
              _this.finished = true;
              _this.loading = false;
              return false;
            }

            if (_this.carList) {
              _this.carList = _this.carList.concat(list);
            } else {
              _this.carList = list;
            }
            _this.loading = false;
            _this.page++;

            for (var i = 0; i < list.length; i++) {
              if (list[i].is_default == 1) {
                _this.picked = list[i].id;
              }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 设置默认发票
    changeDefault(id) {
      this.picked = id;
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/vehicle/setDefault?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token"),
            id: id
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode === 0) {
            Toast(response.data.message.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toAdd() {
      this.$router.push({
        path: "AddCar",
        query: {
          id: 0
        }
      });
    },
    toEdit(id, Code) {
      this.$router.push({
        path: "AddCar",
        query: {
          id: id,
          vinCode: Code
        }
      });
    },
    toDetail(id) {
      this.$router.push({
        path: "CarDetail",
        query: {
          id: id
        }
      });
    },
    delectCar(id, index) {
      Dialog.confirm({
        title: "请确定是否删除该车辆？"
      })
        .then(() => {
          // on confirm
          console.log("你点击了确认");
          var _this = this;
          axios
            .post(
              _this.apihttpUrl + "api/user/vehicle/batchDelete?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                ids: id
              })
            )
            .then(function(response) {
              Toast(response.data.message);
              if (response.data.errorCode == 0) {
                _this.carList.splice(index, 1);
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
    }
  }
};
</script>


