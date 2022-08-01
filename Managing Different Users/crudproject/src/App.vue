<template>
  <div>
    <HeaderOne />
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderOne from "./components/HeaderOne.vue";
export default {
  name: "App",
  components: {
    HeaderOne,
  },
};
</script>

<style>
</style>
