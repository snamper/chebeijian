<template>
	<footer class="app-footer">

		<div class="footer border-top">

			<div class="col-xs-3" v-for="item in nav">
				<router-link :to="item.name" :class="isSelect">
					<div class="icon">
						<i class="dbtb" :class="item.icon"></i>
						<p>{{item.title}}</p>
					</div>
				</router-link>
			</div>
			
		</div>
	</footer>
</template>
<script>
export default {
  name: "footer",
  props: ["tec"],
  data() {
    return {
      isSelect: "",
      nav: [
        {
          title: "首页",
          name: "index",
          icon: "icon-home"
        },
        // {
        //   title: "保险",
        //   name: "InsuranceList",
        //   icon: "icon-baoxian"
        // },
        {
          title: "配件",
          name: "Classification",
          icon: "icon-peijian"
        },
        {
          title: "订单",
          name: "GoodsOrderList",
          icon: "icon-order"
        },
        {
          title: "我的",
          name: "UserIndex",
          icon: "icon-my"
        }
      ]
    };
  },

  created() {
    var _this = this;
    if (_this.$route.name == "name") {
      _this.isSelect = "active";
    }
    console.log(_this.$route.name);
  },
  methods: {
    goindex() {
      this.$router.push({
        path: "index"
      });
    },
    goInsuranceList() {
      this.$router.push({
        path: "InsuranceList"
      });
    },
    goClassification() {
      this.$router.push({
        path: "Classification"
      });
    },
    goGoodsOrderList() {
      this.$router.push({
        path: "GoodsOrderList"
      });
    },
    goUserIndex() {
      this.$router.push({ path: "Login" });
    }
  }
};
</script>