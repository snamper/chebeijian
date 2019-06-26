<template>
 <div class="page-error">
    <img src="../../assets/404.png" >
    <router-link class="page-return" to ='/'>

    </router-link>
 </div>
</template>

<script>
export default {
  name: "Page404"
};
</script>
<style lang="scss" scoped>
.page-error {
  padding-top: 4rem;
  position: relative;
  img {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    text-align: center;
    width: 8.18rem;
  }
  .page-return {
    position: absolute;
    width: 2.6rem;
    height: 0.54rem;
    left: 54%;
    top: 6.8rem;
  }
}
</style>

