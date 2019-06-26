<template>
  <!-- 适配车型 -->
  <div>
    <div class="detail">
      <img :src="httpUrl+'xq.jpg'">
    </div>
  </div>
  <!-- end 适配车型 -->
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