<template>
  <!-- 详细信息 -->
  <div>
    <div class="detail">
      <img :src="httpUrl+'goodsde.jpg'">
    </div>
  </div>
  <!-- end 详细信息 -->
</template>

<script>
 export default {
    data() {
      return {
        httpUrl: domain.iconUrl, //直接通过this访问全局变量
      }
    }
 }
</script>
