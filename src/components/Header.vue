<template>
  <header class="app-header navbar">
     <div class="top-head row">
      <div class="col-xs-12">
        <img class="back" :src="httpUrl+'goback.png'" @click="onClickLeft">
        <p>{{title}}</p>
      </div>
    </div>
  </header>
</template>
<style scoped>
</style>
<script>
export default {
  name: "header",
  data() {
    return {
      httpUrl: domain.iconUrl
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      window.history.go(-1);
    }
  },
  props: {
    title: String
  }
};
</script>
