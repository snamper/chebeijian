<template>
    <div class="sidebar">
        <!-- <div class="navbar-left" v-if="copyright === '无敌掌柜提供技术支持'"> -->
        <div class="navbar-left">
            <div class="logo">
                <div class="logo-img"></div>
                <div class="logo-text">车贝健汽配专营店SaaS</div>
            </div>
        </div>
        <SidebarForm/>
        <nav class="sidebar-nav">
            <div slot="header"></div>
            <ul class="nav">
                
            </ul>
            <slot></slot>
        </nav>
        <SidebarFooter/>
        <div class="nav-tooltip collapsed" @click="sidebarToggle">
            <div class="nav-tooltip-rel">
                <div>
                    <i class="icon el-icon-d-arrow-right"></i>
                    <i class="icon el-icon-d-arrow-left"></i>
                    <span class="nav-name">收缩侧边栏</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    copyright: {
      type: String,
      default: ""
    }
  },
  components: {},
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle("open");
    },
    mobileSidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-mobile-show");
    },
    sidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-hidden");
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  .navbar-left {
    display: flex;
    background: #292c33;
    width: 200px;
    height: 55px;
  }

  .el-icon-d-arrow-right {
    display: none;
  }

  .nav-tooltip,
  .nav-tooltip-rel {
    display: inline-block;
  }

  .collapsed {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
    background: hsla(0, 0%, 100%, 0.09);
    font-size: 14px;
    color: #9e9e9e;
    cursor: pointer;
    .icon {
      position: absolute;
      left: 28px;
      top: 0;
      height: 48px;
      line-height: 48px;
    }
    .nav-name {
      position: absolute;
      left: 65px;
      top: 0;
      height: 48px;
      line-height: 48px;
    }
    &:hover {
      color: #ffffff;
    }
  }
}

.sidebar-hidden {
  .el-icon-d-arrow-left {
    display: none;
  }
  .el-icon-d-arrow-right {
    display: block;
  }
}

.logo {
  padding: 16px 0 0 18px;
  .logo-img {
    background: url("../assets/logo.png") no-repeat;
    background-size: 100%;
    width: 30px;
    height: 30px;
    display: inline-block;
    vertical-align: middle;
  }
  .logo-text {
    display: inline-block;
  }
}

.logo_url {
  display: inline-block;
  width: 150px;
  height: 55px;
  padding: 0.5rem 1rem;
  margin-right: 0;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 75%;
}

.sidebar-nav {
  padding-top: 5px;
}

.nav-link {
  cursor: pointer;
  height: 45px !important;
  line-height: 45px !important;
  padding: 0 !important;
}

.sidebar {
  position: absolute;
  width: 200px;
  left: 0;
  background: #292c33;
  padding-bottom: 48px;
  overflow: hidden;
}

.sidebar .nav-link i {
  margin: 0 18px 0 24px !important;
  vertical-align: middle;
}

.sidebar .nav-link .nav-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.09) !important;
}

.nav-link.active {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 45px;
    background: #4a8ef7;
  }
}
</style>
