<template>

  <div class="ChooseInvoice">

    <myHeader title="选择发票" />

    <div class="InvoiceList_box from_top">
      <div class="InvoiceList_item">
        <div class="col-xs-6">
          <p>开具类型：个人</p>
        </div>
        <div class="col-xs-6">
          <p>类型：增值税普通发票</p>
        </div>
        <p class="name">抬头：许方圆</p>
        <div class="status">
          <img :src="httpUrl+'type/status.png'" alt="">
        </div>
      </div>

      <div class="InvoiceList_item">
        <div class="col-xs-6">
          <p>开具类型：个人</p>
        </div>
        <div class="col-xs-6">
          <p>类型：增值税普通发票</p>
        </div>
        <p class="name">抬头：安徽亚原子网络科技股份有限公司</p>
      </div>

      <div class="InvoiceList_item">
        <div class="col-xs-6">
          <p>开具类型：个人</p>
        </div>
        <div class="col-xs-6">
          <p>类型：增值税普通发票</p>
        </div>
        <p class="name">抬头：安徽亚原子网络科技股份有限公司</p>
      </div>

    </div>


    <!-- 无数据显示 -->
    <!-- <div class="no-data">
      <img :src="httpUrl+'type/noInvoice.png'" alt="">
      <p>暂时没有发票信息哦</p>
    </div> -->

    <!-- 底部按钮操作 -->
    <div class="footer">
      <div class="button row">
        <button>添加发票信息</button>
      </div>
    </div>
    <!-- end 底部按钮操作 -->


  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import myHeader from "@/components/Header";
export default {
  data() {
    return {
      httpUrl: domain.iconUrl,
    };
  },
  components: {
    myHeader
  },
  created() {},
  methods: {}
};
</script>