<template>
  <div class="flex items-center">
    <iconfont-icon
      v-if="showUnit"
      name="icon-ETH2-24"
      :class="iconClass"
    ></iconfont-icon
    >&nbsp;
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  showUnit: {
    type: Boolean,
    default: true,
  },
  iconClass: String,
});
</script>

<style lang="scss" scoped></style>
