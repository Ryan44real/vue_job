<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Login from './views/Login.vue';
import Layout from './views/Layout.vue'
</script>



<template>
  <div>
    <!-- <Login/> -->
    <!-- <Layout/> -->
    <router-view></router-view>
  </div>
</template>


<style scoped>

</style>
