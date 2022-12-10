<template>
  <div class="flex items-center">
    <span v-if="showUnit">
      <iconfont-icon
        v-if="!tezos"
        name="icon-ETH2-24"
        class="mr-1"
        :class="iconClass"
      ></iconfont-icon>
    </span>

    <span>
      <slot></slot>
    </span>

    <span v-if="tezos && showUnit">&nbsp;ꜩ</span>
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
