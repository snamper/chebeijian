<template>
  <div class="ChooseStore">
    <div class="storesList">
      <myHeader title="选择门店"/>
      <!-- 搜索 -->
      <div class="search">
        <div class="fl">
          <img :src="httpUrl+'search2.png'">
          <input
            class="search-box"
            name="q"
            value
            v-model="keyWords"
            placeholder="请输入快修店名称"
            type="text"
          >
          <p class="sousuo" @click="searchStore(keyWords)">搜索</p>
        </div>
      </div>
      <!-- end 搜索 -->
      <!-- 调用高德地图 -->
      <!-- <mapDrag  class="mapbox"></mapDrag> -->
      <div class="m-map mapbox">
        <div id="js-container" class="map">正在加载数据 ...</div>
      </div>
      <!-- 调用高德地图结束 -->
      <div class="store" v-if="choosed">
        <ul>
          <li @click="goDetail(storeInfo.id)">
            <div class="row">
              <div class="col-xs-3">
                <img :src="storeInfo.door_head_image_path">
              </div>
              <div class="col-xs-9">
                <h4>{{storeInfo.company_name}}</h4>
                <div>
                  <p
                    class="info"
                  >营业时间：{{storeInfo.business_hours_start}}-{{storeInfo.business_hours_end}}</p>
                  <p class="info">服务热线：{{storeInfo.contact_phone}}</p>
                  <p class="info">负责人：{{storeInfo.contact_name}}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <!-- 底部按钮操作 -->
        <div class="ChooseInvoice">
          <div class="footer">
            <div class="button row">
              <button @click="chooseStore(storeInfo.company_name)">选择</button>
              <button class="delet" @click="chooseDelet">取消</button>
            </div>
          </div>
        </div>
        <!-- end 底部按钮操作 -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search {
  z-index: 1;
}
.mapbox {
  width: 100%;
  height: 80%;
  margin-bottom: 20px;
  float: left;
}
</style>

<script>
import myHeader from "@/components/Header";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";
//引入高德api
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey, MapCityName } from "@/config/config";
export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      storeInfo: {},
      checked: true,
      dragData: {
        lng: null,
        lat: null,
        address: null,
        nearestJunction: null,
        nearestRoad: null,
        nearestPOI: null
      },
      AMapUI: null,
      AMap: null,
      dataInfo: [],
      keyWords: "",
      choosed: false,
      searchReasult: {},
      httpUrl: domain.iconUrl
    };
  },
  components: {
    myHeader,
    [Toast]: Toast
  },
  mounted() {},
  methods: {
    // 实例化地图
    initMap() {
      var map = new AMap.Map("js-container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始化地图层级
        center: [this.dataInfo[0].lng, this.dataInfo[0].lat] //初始化地图中心点
      });
      var marker;
      // 定义图标
      var icon = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: this.httpUrl + "siteLocate.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 5), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(20, 30) // 根据所设置的大小拉伸或压缩图片
      });
      for (var i = 0; i < this.dataInfo.length; i++) {
        var jfong = [this.dataInfo[i].lng, this.dataInfo[i].lat];
        marker = new AMap.Marker({
          position: jfong,
          zIndex: 101,
          icon: icon,
          map: map
        });
        console.log(jfong);
        marker.setMap(map);
        marker.id = this.dataInfo[i].id;
        marker.on("click", this.markerClick);
      }
      // 定义图标
      var icon1 = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: this.httpUrl + "myLocate.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 5), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(20, 30) // 根据所设置的大小拉伸或压缩图片
      });
      // 定位
      map.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          markerOptions: {
            //定义marker样式
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
          },
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
      });
    },
    // 搜索删选输入框中输入的门店对应的坐标并定位
    iMap(lng, lat, id) {
      var map = new AMap.Map("js-container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始化地图层级
        center: [lng, lat] //初始化地图中心点
      });
      var marker;
      // 定义图标
      var icon = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: this.httpUrl + "locate.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(40, 50) // 根据所设置的大小拉伸或压缩图片
      });
      // 定义点
      var jfong = [lng, lat];
      marker = new AMap.Marker({
        position: jfong,
        zIndex: 101,
        icon: icon,
        offset: new AMap.Pixel(-20, -50),
        map: map
      });
      marker.setMap(map);
      marker.id = id;
      marker.on("click", this.markerClick);
    },
    // 初始化门店
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data);
            _this.dataInfo = response.data.data.info;
            console.log(_this.dataInfo);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    markerClick(e) {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/federationStore/info?platform=weixin&version=1000&federation_store_id=" +
            e.target.id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          console.log(response.data.data.info);
          if (response.data.errorCode == 0) {
            _this.storeInfo = response.data.data.info;
            _this.choosed = true;
            _this.iMap(
              _this.storeInfo.lng,
              _this.storeInfo.lat,
              _this.storeInfo.id
            );
            console.log(_this.storeInfo);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    goDetail(id) {
      this.$router.push({
        path: "storesDetail",
        query: { id: id }
      });
    },
    chooseStore(name) {
      this.$router.push({
        path: "goodsDetail?id=" + this.$route.query.id,
        query: { company_name: name }
      });
    },
    chooseDelet() {
      window.location.reload();
    },
    // 搜索结果地图标记
    searchMap() {
      var map = new AMap.Map("js-container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始化地图层级
        center: [this.searchReasult[0].lng, this.searchReasult[0].lat] //初始化地图中心点
      });
      var marker;
      // 定义图标
      var icon = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: this.httpUrl + "siteLocate.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 5), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(20, 30) // 根据所设置的大小拉伸或压缩图片
      });
      for (var i = 0; i < this.searchReasult.length; i++) {
        var jfong = [this.searchReasult[i].lng, this.searchReasult[i].lat];
        marker = new AMap.Marker({
          position: jfong,
          zIndex: 101,
          icon: icon,
          map: map
        });
        console.log(jfong);
        marker.setMap(map);
        marker.id = this.searchReasult[i].id;
        marker.on("click", this.markerClick);
      }
      // 定义图标
      var icon1 = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: this.httpUrl + "myLocate.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 5), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(20, 30) // 根据所设置的大小拉伸或压缩图片
      });
    },
    // 搜索门店
    searchStore(key) {
      if (key == "") {
        Toast("请输入门店名称");
      } else {
        var _this = this;
        axios
          .post(
            _this.apihttpUrl + "api/federationStore/list?platform=weixin&version=1000&company_name=" +
              key,
            qs.stringify({
              token: window.localStorage.getItem("token")
            })
          )
          .then(function(response) {
            console.log(response.data.data.info);
            if (response.data.errorCode == 0) {
              _this.searchReasult = response.data.data.info;
              _this.searchMap();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  async created() {
    this.initData();
    await remoteLoad(
      `http://webapi.amap.com/maps?v=1.3&key=34c9826ca87b43990990360f99fa41d3`
    );
    await remoteLoad("http://webapi.amap.com/ui/1.0/main.js");
    setTimeout(() => {
      this.initMap();
    }, 500);
    // this.initMap()
  }
};
</script>
<style lang="css">
.m-map {
  min-width: 100%;
  min-height: 100%;
  position: relative;
}
.m-map .map {
  width: 100%;
  height: 100%;
}
.m-map .search {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 285px;
  z-index: 1;
}
.m-map .search input {
  width: 180px;
  border: 1px solid #ccc;
  line-height: 20px;
  padding: 5px;
  outline: none;
}
.m-map .search button {
  line-height: 26px;
  background: #fff;
  border: 1px solid #ccc;
  width: 50px;
  text-align: center;
}
.m-map .result {
  max-height: 300px;
  overflow: auto;
  margin-top: 10px;
}
.ChooseStore .storesList .store {
  z-index: 160;
}
</style>

