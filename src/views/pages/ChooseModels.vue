<template>
  <div class="ChooseModels">
    <div class="cardetail" v-if="cardetail" @click="cardetail=!cardetail">
      <div class="col-xs-9">
        <div class="title">
          <img :src="img">
          <p>{{name}}</p>
        </div>
        <div class="chooseCar" v-for="item in list" :key="item">
          <div
            class="detail"
            @click="carYear(img,name,item.id,item.family_name)"
          >{{item.family_name}}</div>
        </div>
      </div>
    </div>

    <div class="top-head row carSearch" v-if="isSearch">
      <div class="col-xs-1">
        <img class="back" :src="httpUrl+'modal/goback.png'" @click="onClickLeft" >
      </div>
      <div class="col-xs-11" @click="gosearch">
        <img :src="httpUrl+'modal/search.png'">
        <input class="search-box" name="q" value placeholder="搜索" type="text">
      </div>
    </div>
    <div class="top-head row" v-if="SearchResult">
      <div class="col-xs-1">
        <img class="back" :src="httpUrl+'modal/goback.png'" @click="onClickLeft">
      </div>
      <div class="col-xs-9">
        <img :src="httpUrl+'modal/search.png'" >
        <input class="search-box" name="q" value placeholder="搜索" type="text" v-model="q">
      </div>
      <div class="col-xs-2" @click="gosearchResult">
        <p>搜索</p>
      </div>
    </div>
    <div class="searchshawdom" v-if="shawdom"></div>
    <!-- 热门品牌 -->
    <div class="carbody">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div class="carHot">
          <h3>热门品牌</h3>
          <div class="hotContent">
            <div
              class="hotItem"
              v-for="item in hotlist"
              :key="item"
              @click="doClick(item.brand_icon_path,item.brand_name,item.id)"
            >
              <img :src="item.brand_icon_path">
              <p>{{item.brand_name}}</p>
            </div>
          </div>
        </div>
      </van-list>
      <div class="choosecar11">
        <div>
          <div id="showCityContent"></div>
          <div v-for="(item, index) in showCity" class="letter-item" :key="index">
            <div>
              <a :id="item.letter" class="title2">{{item.letter}}</a>
            </div>

            <div
              v-for="(i, index) in item.citylist"
              :key="index"
              @click="doClick(item.img[index],i,item.id[index])"
              class="itemscar"
            >
              <img :src="item.img[index]">
              <p>{{i}}</p>
            </div>
          </div>
        </div>
        <aside class="letter-aside">
          <ul>
            <li
              v-for="(item, index) in showCity"
              @click="naver(item.letter)"
              :key="index"
            >{{item.letter}}</li>
          </ul>
        </aside>
        <div id="tip">{{tipString}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../style/common/css/modal.scss";
import pinyin from "../../../static/lib/web-pinyin/bundle.js";
import axios from "axios";
import qs from "qs";
import { Toast, List } from "vant";

// let serverUrl = "http://offer.net199.com/"; // 本地调试时git
let serverUrl = "../../static/";
var cityLists = [];
var cityNames = [];
var cityImg = [];
var cityId = [];
var cityNamesFilter = [];
var letter = [];
var countPage = 0;
var tipLetter = "";
var citySearch = "";
var showCity = [];
var showCityList = [];
var showCityTemp;

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      isSearch: true,
      shawdom: false,
      SearchResult: false,
      cardetail: false,
      cityNames: cityNamesFilter,
      //cityImg: cityNamesFilter2,
      img: "",
      name: "",
      letter: letter,
      tipString: tipLetter,
      citySearch: citySearch,
      showCity: showCity,
      cityJosnUrl: serverUrl + "car.json",
      q: "",
      // cityJosnUrl:  "../../style/common/js/city.json",
      nowCity: window.localStorage.getItem("city_name"),
      name: "",
      hotlist: [],
      list: [],
      loading: false,
      finished: false
    };
  },
  components: {
    [List.name]: List
  },
  created: function() {
    var _this = this;
    axios
      .post(
        _this.apihttpUrl + "api/vehicle/vehicleBrands?platform=Android&version=1000&is_sequence=0",
        qs.stringify({
          token: window.localStorage.getItem("token")
        })
      )
      .then(function(response) {
        _this.cityJosnUrl = response.data;
        _this.aa(_this.cityJosnUrl, _this.citySearch);
        _this.init();
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  mounted: function() {
    window.scrollTo(0, 500);
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    gosearchResult() {
      for (var i = 0; i < cityNames.length; i++) {
        if (cityNames[i] == this.q) {
          this.doClick(cityImg[i], cityNames[i], cityId[i]);
        } else {
        }
      }
    },
    gosearch() {
      this.isSearch = false;
      this.SearchResult = true;
      this.shawdom = true;
    },
    todetail() {
      this.cardetail = true;
    },
    carYear(img, name, id, name1) {
      this.$router.push({
        path: "/ChooseYear",
        query: { id: id, img: img, name: name, name1: name1 }
      });
    },
    onLoad() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleBrands?platform=weixin&version=1000&is_sequence=0",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // _this.hotlist = response.data.data.hot_brand_list;
          var list = response.data.data.hot_brand_list;
          if (list.length === 0) {
            _this.finished = true;
            _this.loading = false;
            return false;
          } else {
            _this.hotlist = list;
            _this.finished = true;
          }
          _this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    aa(cityJosnUrl, sea) {
      var __this = this;
      countPage++;

      if (countPage < 2) {
        let cityList = cityJosnUrl.data.brand_list;
        for (let j in cityList) {
          cityNames.push(cityList[j].brand_name);
          cityImg.push(cityList[j].brand_icon_path);
          cityId.push(cityList[j].id);
        }

        cityNamesFilter = cityNames;
        __this.cityFilter(sea);
        __this.someData = cityJosnUrl.data.brand_list;
      }
    },
    goHome(nowCity) {
      this.doClick(nowCity);
    },
    doClick(img, i, id) {
      this.cardetail = true;
      this.name = i;
      this.img = img;
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/vehicle/vehicleFamilys?platform=weixin&version=1000&vehicle_brand_id=" +
            id,
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          _this.list = response.data.data.family_list;
          console.log(response.data.data.family_list);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buildLetter: function() {
      // 构建字母项
      letter = [];
      for (let i = 0; i < 26; i++) {
        let obj = {};
        obj.letter = String.fromCharCode(65 + i);
        obj.citylist = [];
        letter.push(obj);
      }
    },
    getFirstLetter: function(str) {
      //  得到城市第一个字的首字母
      return pinyin
        .pinyin(str)[0][0]
        .charAt(0)
        .toUpperCase();
    },
    buildItem: function(cityNamesFilter, cityImg) {
      // 构建城市

      this.buildLetter();
      let _this = this;
      for (let i = 0; i < 26; i++) {
        letter[i].citylist = [];
        letter[i].img = [];
        letter[i].id = [];
      }

      for (let i = 0; i < cityNamesFilter.length; i++) {
        let _index = Number(
          _this.getFirstLetter(cityNamesFilter[i]).charCodeAt() - 65
        );
        if (_index >= 0 && _index < 26) {
          letter[_index].citylist.push(cityNamesFilter[i]);
          letter[_index].img.push(cityImg[i]);
          letter[_index].id.push(cityId[i]);
        }
      }
      // 如果letter中citylist中没有值的话，过滤这一项
      showCity = showCityTemp = letter.filter(function(value) {
        let len = value.citylist.length;
        return len > 0;
      });
    },
    naver: function(id) {
      // 点击右边字母滚动
      this.tipString = id;
      let obj = document.getElementById(id);
      let tip = document.getElementById("tip");
      tip.setAttribute("class", "tipAppear");
      setTimeout(function() {
        tip.removeAttribute("class");
      }, 500);
      let oPos = obj.offsetTop;
      return window.scrollTo(0, oPos - 36);
    },
    cityFilter: function(city) {
      // 城市搜索筛选
      let showCityListTemp;
      this.buildItem(cityNamesFilter, cityImg);
      showCity = showCityTemp;
      showCity = showCity.filter(function(value) {
        showCityList = value.citylist;
        showCityListTemp = showCityList.filter(function(val) {
          return val.indexOf(city) > -1;
        });
        value.citylist = showCityListTemp;
        return value.citylist.length > 0;
      });
      this.showCity = showCity;
      if (showCity.length === 0) {
        let _showCityContent = document.getElementById("showCityContent");
        _showCityContent.innerText = "查询不到结果";
        _showCityContent.setAttribute("class", "tipShow");
      } else {
        document.getElementById("showCityContent").innerText = "";
      }
    }
  },

  watch: {
    citySearch: function(newCitySearch) {
      this.cityFilter(newCitySearch);
    }
  }
};
</script>
<style lang="scss" scoped>
.ChooseModels .choosecar11 .letter-item .itemscar:last-child {
  border: none;
}
.ChooseModels .cardetail .col-xs-9 .detail:last-child {
  border-bottom: none;
}
#tip {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 0.014rem solid #999;
  width: 1.4rem;
  height: 1.4rem;
  z-index: 10;
  text-align: center;
  line-height: 1.4rem;
  font-size: 0.7rem;
  opacity: 0;
  color: #e57c18;
}
.tipAppear {
  -webkit-animation: appearTip 1 linear 0.5s;
  -o-animation: appearTip 1 linear 0.5s;
  -ms-animation: appearTip 1 linear 0.5s;
  -moz-animation: appearTip 1 linear 0.5s;
  animation: appearTip 1 linear 0.5s;
}
@-webkit-keyframes appearTip {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
@keyframes appearTip {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
.tipShow {
  text-align: center;
  line-height: 0.84rem;
  font-size: 0.336rem;
  color: #bbbbbb;
}
</style>



