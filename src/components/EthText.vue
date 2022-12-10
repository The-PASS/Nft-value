<template>
  <div class="flex items-center">
    <span v-if="showUnit">
      <iconfont-icon
        v-if="!tezos"
        name="icon-ETH2-24"
        class="mr-1"
        :class="iconClass"
      ></iconfont-icon>
      <span v-if="tezos">ꜩ&nbsp;</span>
    </span>

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
  tezos: {
    type: Boolean,
    default: false,
  },
  iconClass: String,
});
</script>

<style lang="scss" scoped></style>
