<template>
  <div class="h-22 flex justify-between items-center px-[125px]">
    <router-link to="/">
      <img class="w-20 h-7" src="@/assets/images/logo.png" alt="" />
    </router-link>

    <div v-if="search">Searchxxx</div>
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

<style lang="scss" scoped></style>
