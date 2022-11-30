<template>
  <div class="flex items-center">
    <iconfont-icon
      v-if="showUnit"
      name="icon-ETH2-24"
      class="ml-1"
    ></iconfont-icon
    >&nbsp;
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  showUnit: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped></style>
