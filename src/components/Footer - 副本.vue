<template>
  <footer class="app-footer">
    
	<div class="footer border-top">

			<div class="col-xs-3">
				<a class="active" @click="goindex">
					<div class="icon">
						<i class="icon-home dbtb"></i>
						<p>首页</p>
					</div>
				</a>
			</div>
			<div class="col-xs-3">

				<a class=""  @click="goCarInsurance">
					<div class="icon">

						<i class="icon-baoxian dbtb"></i>
						<p>保险</p>
					</div>
				</a>
			</div>
			<div class="col-xs-3">
				<a class="" @click="goClassification">
					<div class="icon">
						<i class="icon-peijian dbtb"></i>
						<p>配件</p>
					</div>
				</a>
			</div>
			<div class="col-xs-3">
				<a class="" @click="goGoodsOrderList">
					<div class="icon">
						<i class="icon-order dbtb"></i>
						<p>订单</p>
					</div>
				</a>
			</div>
			<div class="col-xs-3">
				<a class="" @click="goUserIndex">
					<div class="icon">
						<i class="icon-my dbtb"></i>
						<p>我的</p>
					</div>
				</a>
			</div>
		</div>
  </footer>
</template>
<script>
export default {
  name: "footer",
  props: ["tec"],

  created() {},
  methods: {
  	goindex() {
      this.$router.push({ path: "index" });
   },
   goCarInsurance() {
      this.$router.push({ path: "CarInsurance" });
   },
   goClassification() {
      this.$router.push({ path: "Classification" });
   },
   goGoodsOrderList() {
      this.$router.push({ path: "GoodsOrderList" });
   },
    goUserIndex() {
      this.$router.push({ path: "UserIndex" });
    }
  }
};
</script>
