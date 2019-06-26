<template>
    <router-view></router-view>
   <!--  <AppFooter/> -->
</template>

<style lang="scss" scoped>

</style>


<script>
  import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../../components/';
  import sidebar from '@/config/sidebar.json';
  // 获取全局配置的接口
  const api = {
    //配置信息
    requestOemConfig(cb) {
      lib.api.get({
        api: 'wdzg/agent/b/customer/website_config/get',
        data: {},
        success: (data) => {
          cb && cb(data.data.website_config);
        },
        error: (data) => {
          console.error(data);
          // this.$message.error('获取模块管理列表失败!');
        }
      })
    },
  }

  export default {
    name: 'full',
    components: {
      // AppHeader,
      // Sidebar,
      // AppAside,
      AppFooter,
      // Breadcrumb,
    },
    data() {
      return {
        tec: '',
        logo_url: '',
        user: null,
        nav: [],
        copyright: ''
      };
    },
    computed: {
      name() {
        return this.$route.name;
      },
      list() {
        return this.$route.matched;
      },
      mainBg() {
        if (this.$route.name === '页面装修') {
          return 'mainBg';
        }
      }
    },
    mounted() {
      var that = this;
      this.renderNav();
      this.user = lib.storage.get('user');
      api.requestOemConfig(function (data) {
        that.tec = data.website_copyright || '';
        that.logo_url = data.logo_url || '';
        that.copyright = data.tech_support_copyright;
      });
    },
    methods: {
      renderNav() {
        this.nav = sidebar.nav_list;
      }
    },
  };
</script>
