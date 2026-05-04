<script setup lang="ts">
defineOptions({ name: 'UserLayout' })
</script>

<template>
  <div class="user-layout">
    <el-tabs @tab-click="(tab: any) => $router.push(tab.props.name)" :model-value="$route.path">
      <el-tab-pane label="当前借阅" name="/user/borrowing" />
      <el-tab-pane label="借阅历史" name="/user/history" />
      <el-tab-pane label="逾期记录" name="/user/overdue" />
      <el-tab-pane label="我的书单" name="/user/wishlist" />
      <el-tab-pane label="我的预约" name="/user/reservations" />
      <el-tab-pane label="阅读账单" name="/user/dashboard" />
    </el-tabs>
    <router-view />
  </div>
</template>
