<template>
  <div class="h-22 flex justify-between items-center px-[125px]">
    <router-link to="/">
      <img class="w-20 h-7" src="@/assets/images/logo.png" alt="" />
    </router-link>

    <search-box v-if="search"></search-box>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: Boolean,
    default: true,
  },
});
</script>

<style></style>
