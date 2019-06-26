<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h1 style="margin-bottom: 20px;">经销商后台管理</h1>
                <p class="text-muted"></p>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-username"></i>
                  </span>
                  <input v-model="userName" id="username" class="form-control" :class="nameError && 'is-invalid'" placeholder="手机号">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-password"></i>
                  </span>
                  <input v-model="password" id="password" type="password" class="form-control" :class="passwordError && 'is-invalid'" placeholder="密码">
                </div>
                <div class="input-group mb-4">
                  <div class="forget-passwd">
                    <a href="javascript:;" class="text-muted" @click="forgetPasswd">忘记密码 ?</a>
                  </div>
                  <!--<input v-model="verifyCode" class="form-control" placeholder="验证码">-->
                  <!--<span class="input-group-addon verify-code-wrapper" style="padding: 0">-->
                    <!--<img class="check_code_img" title="看不清？换一张" src="http://xws.seller.mockuai.com/bossmanager/verify_code.do">-->
                  <!--</span>-->
                </div>
                <div class="input-group mb-4">
                    <el-button size="small" type="primary" id="login" @click="goLogin">登录</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #login{
    width: 100%;
  }
  .verify-code-wrapper{
    padding: 0;
    img{
      height: 29px;
    }
  }
  .input-group-addon{
    padding: 10px 15px;
    background: #FFFFFF;
  }
  .forget-passwd{
    width: 100%;
    text-align: right;
  }
</style>

<script>
export default {
  name: 'Login',
  data() {
    return {
      userName: null,
      password: null,
      verifyCode: null,
      nameError: false,
      passwordError: false
    }
  },
  computed: {
    requestData: function () {
      return {
        mobile: this.userName,
        password: this.password
      }
    }
  },
  mounted(){
    lib.storage.rm('app_key');
    lib.storage.rm('app_pwd');
  },

  watch: {
    userName: function () {
      this.nameError = false;
    },
    password: function () {
      this.passwordError = false;
    }
  },

  methods: {
    // 忘记密码
    forgetPasswd() {
      this.$router.push({path: '/pages/forgetpasswd'});
    },

    // 登录
    goLogin() {
      if (this.isAjax) return;
      this.isAjax = true;

      let validated = this._validate();
      let that = this;
      if (validated.success) {
        lib.api.post({
          api: 'wdzg/b/user/login',
          ssl: true,
          data: this.requestData,
          success(data) {
            // 重置api调用配置
            lib.api.reset();
            lib.login.login(data);
          },
          error(data) {
            if (data && data.msg) {
              that.$message.error(data.msg);
            } else {
              that.$message.error('系统开小差了, 请稍后重试!');
            }
          },
          complete() {
            that.isAjax = false;
          }
        });
      } else {
        this.$message.error(validated.msg);
        this.isAjax = false;
      }
    },

    // 判断逻辑
    _validate() {
      // 校验
      if (!this.userName) {
        this.nameError = true;
        return {
          success: false,
          msg: '手机号不能为空'
        }
      }
      if (!/^[0-9]{11}$/.test(this.userName)) {
        this.nameError = true;
        return {
          success: false,
          msg: '手机号格式不正确'
        }
      }
      if(!this.password){
        this.passwordError = true;
        return {
          success: false,
          msg: '密码不能为空'
        }
      }

      return {
        success: true
      };
    }
  }
}
</script>

