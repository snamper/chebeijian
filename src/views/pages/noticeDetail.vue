<template>

  <div class="noticeDetail">
    <myHeader title="消息通知" />
    <div class="from_top">
    <div class="info row">
      <h1>改灯科普</h1>
      <p class="time">2018.09.09 20:00</p>
      <div class="detail">
        <img :src="httpUrl+'xiaoxi.jpg'">
        <p>想干汽车项目由来已久。在1992-1993年经济过热时期，芜湖一家村办工厂一年近亿的利润使得苦于经济落后的地方政府领导人产生了干汽车的念头。原来的计划是和一汽合作，但没有合作成功。
        </p>
        <p>奇瑞汽车有限公司在1995年1月考察欧洲汽车工业期间，得知英国福特的一条发动机生产线要出售，安徽芜湖领导于是抓住这个机会把项目干起来。由于国家政策对轿车项目的限制，只能秘密进行，所以这个项目启动时取内部代号为“951工程”（即国家九五期间安徽头号工程），公开则称为“安徽汽车零部件工业公司（筹备处）”，对外始终保持低调。</p>

      </div>
      </div>
    </div>
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