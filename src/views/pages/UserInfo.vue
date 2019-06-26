<template>
    <div class="userInfo">
      <div class="noticebody">
         <header class="app-header navbar">
          <div class="top-head row">
            <div class="col-xs-12">
              <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
              <p>个人信息</p>
            </div>
          </div>
        </header>
      </div>
      <div class="from_top">

        <div class="cell_box">
          <div class="col-xs-12 ">头像</div>
          <div class="col-xs-3 icon "  v-show="isPhoto" @click.stop="addPic" ref="divGenres">
            <img :src="useImg" onclick="return false" >
             <input type="file" accept="image/*" @change="onFileChange" style="display: none;">
            </div>
        </div>
        <div class="cell_box" @click="toModifyName">
          <div class="col-xs-6">姓名</div>
          <div class="col-xs-5 name">{{name}}</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="cell_box" @click="toModifyMobileStep1">
          <div class="col-xs-7">手机号</div>
          <div class="col-xs-4 phone">{{phone}}</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
        <div class="gray-border"></div>
        <div class="cell_box">
          <div class="col-xs-8">微信绑定</div>
          <div class="col-xs-3 statu" v-if="Bing" @click="show=!show">已绑定</div>
          <div class="col-xs-3 nostatu" v-if="noBing" @click="bindWx">未绑定</div>
          <div class="col-xs-1 icon"><img :src="httpUrl+'type/icon_01.png'" alt=""></div>
        </div>
      </div>

      <!-- 解绑弹框 -->
      <div class="mask" v-show="show"></div>
      <div class="popup" v-show="show">
        <div class="popup_head">
          <p class="popup_title"></p>
        </div>
        <div class="popup_content">
          <p>您确定要解除绑定吗？</p>
        </div>
        <div class="popuo_footer">
          <button class="cancel" @click="show=false" style="background:#fff;border-bottom-left-radius:4px">取消</button>
          <button class="ensure" style="border-bottom-left-radius:0" @click="doUntied">确定</button>
        </div>
      </div>
     <!-- 解绑弹框 -->
      <!-- 头像弹框 -->

      <div class="mask" v-show="show2"></div>
      <div class="popup photo" v-show="show2" >
        <div class="popup_content">
          <p class="top" style="line-height:1.12rem" >拍照</p>
          <p style="line-height:1.12rem">相册</p>
        </div>
        <div class="popuo_footer">
          <p @click="show2=false">取消</p>
        </div>
      </div>


    </div>
</template>

<style scoped>
@import '../../style/common/css/type.css';
</style>

<script>
import myHeader from "@/components/Header";
import { Toast } from "vant";
import axios from "axios";
import qs from "qs";
import Exif from "exif-js";

export default {
  data() {
    return {
      apihttpUrl: domain.testUrl,
      httpUrl: domain.iconUrl,
      show: false,
      show2: false,
      name: "",
      phone: "",
      useImg: "",
      isPhoto: true,
      previewImg: "",
      isPreview: false,
      Bing: false,
      noBing: true,
      union_id:'',
    };
  },
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  created() {
    this.initData();
  },
  watch: {
    imgUrls: "toggleAddPic"
  },
  methods: {
    initData() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          // Toast(response.data.message);
          if (response.data.errorCode == 0) {
            console.log(response.data.data.info);
            var info = response.data.data.info;
            if(info.name==info.phone){
              _this.name = '未设置';
            }else{
              _this.name = info.name;
            }
            
            _this.phone = info.phone;
            _this.useImg = info.avatar_path;
            _this.union_id = info.union_id
            // 通过union_id判断用户是否绑定了微信
             if (_this.union_id) {
                _this.Bing = true;
                _this.noBing = false;
              } else {
                _this.noBing = true;
                _this.Bing = false;
              }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 路由
    // 修改姓名
    toModifyName() {
      this.$router.push({ path: "ModifyName" });
    },
    toModifyMobileStep1() {
      this.$router.push({ path: "ModifyMobileStep1" });
    },
    goback() {
      this.$router.push({
        path: "UserIndex"
      });
    },

    // 拍照上传图片功能
    toggleAddPic: function() {
      let vm = this;
      if (vm.imgUrls.length >= 1) {
        vm.isPhoto = false;
      } else {
        vm.isPhoto = true;
      }
    },
    addPic: function(e) {
      let els = this.$refs.divGenres.querySelectorAll("input[type=file]");
      els[0].click();
      return false;
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.avatar_path = files[0];
      this.imgPreview(files[0]);
      // console.log(this.picValue)
    },
    imgPreview(file) {
      let self = this;
      let Orientation;
      // s去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // 判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.avatar_path = this.result;
            let newfile = self.dataURLtoBlob(this.result);
            self.postImg(newfile);
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.avatar_path = data;
              let newfile = self.dataURLtoBlob(data);
              self.postImg(newfile);
            };
          }
        };
      }
    },
    postImg(file) {
      // 这里写接口
      let formData = new FormData();
      formData.append("request", file, "img.jpg"); // 'file' 可变 相当于 input 表单的name 属性
      // // console.log(formData)
      var _this = this;

      _this.$http
        .post(_this.apihttpUrl + "service/resource/upload", formData)
        .then(function(rs) {
          axios
            .post(
              _this.apihttpUrl + "api/user/userInfo/updateAvatar?platform=weixin&version=1000",
              qs.stringify({
                token: window.localStorage.getItem("token"),
                avatar: rs.data.data.path_name
              })
            )
            .then(function(response) {
              Toast(response.data.message);
              _this.useImg =
                "http://cdn.b.autoafs.com/" + rs.data.data.path_name;
            })
            .catch(function(error) {
              console.log(error);
            });

          console.log(rs.data);
          _this.useImg = "http://cdn.b.autoafs.com/" + rs.data.data.path_name;
          // _this.useImg = httpUrl: domain.iconUrl + rs.data.data.path_name;

          return rs;
        })
        .catch(err => {
          console.log(err);
        });
    },
    rotateImg(img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const MIN_STEP = 0;
      const MAX_STEP = 3;
      if (img == null) return;
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = MIN_STEP;
      }
      if (direction === "right1") {
        // ++step
        // // 旋转到原位置，即超过最大值
        // step > MAX_STEP && (step = MIN_STEP)
        step = 3;
      } else if (direction === "right2") {
        step = 2;
      } else {
        step--;
        step < MIN_STEP && (step = MAX_STEP);
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    // base64转file对象
    dataURLtoBlob(dataUrl) {
      var bytes = window.atob(dataUrl.split(",")[1]); // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },

    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      // 瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== "" && Orientation !== 1) {
        switch (Orientation) {
          case 6: // 需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: // 需要逆时针（向右）90度旋转
            this.rotateImg(img, "right1", canvas);
            break;
          case 3: // 需要180度旋转
            this.rotateImg(img, "right2", canvas); // 转两次
            break;
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    delImage: function(index) {
      Dialog.confirm({
        title: "标题",
        message: "您要删除图片吗"
      })
        .then(() => {
          this.imgUrls.splice(index, 1);
        })
        .catch(() => {
          // on cancel
        });
    },
    previewImage: function(url) {
      let vm = this;
      vm.isPreview = true;
      vm.previewImg = url;
    },
    closePreview: function() {
      let vm = this;
      vm.isPreview = false;
      vm.previewImg = "";
    },
    saveImage: function() {
      let urlArr = [];
      let imgUrls = this.imgUrls;
      for (let i = 0; i < imgUrls.length; i++) {
        if (imgUrls[i].indexOf("file") === -1) {
          urlArr.push(imgUrls[i].split(",")[1]);
        } else {
          urlArr.push(imgUrls[i]);
        }
      }
      // 数据传输操作
    },
    // 解除微信绑定
    doUntied() {
      var _this = this;
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/untieWx?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          Toast(response.data.message.message);
          if (response.data.errorCode == 0) {
            _this.show = false;
            _this.noBing = true;
            _this.Bing = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 绑定微信
    bindWx(){
      var _this = this;
      // alert(window.localStorage.getItem("token"))
      axios
        .post(
          _this.apihttpUrl + "api/user/userInfo/generateBindingUrl?platform=weixin&version=1000",
          qs.stringify({
            token: window.localStorage.getItem("token")
          })
        )
        .then(function(response) {
          Toast('正在进行授权操作...');
          console.log(response)
          if(response.data.errorCode == 0){
             window.location.href = response.data.data.binding_url
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.push({
        path: "/UserIndex"
      });
    }
  }
};
</script>


