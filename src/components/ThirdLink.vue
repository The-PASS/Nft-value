<template>
  <div class="flex space-x-6 md:space-x-12">
    <ui-tippyer content="Twitter">
      <a href="https://twitter.com/daobase_ai" target="_blank" title="Twitter">
        <i class="iconfont icon-Twitter2 text-4xl"></i>
      </a>
    </ui-tippyer>
    <ui-tippyer content="Discord">
      <a href="https://discord.com/invite/N6f25tPs9W" target="_blank">
        <i class="iconfont icon-discrod2 text-4xl"></i>
      </a>
    </ui-tippyer>
  </div>
</template>

<script setup>
const props = defineProps({
  spaceSize: {
    type: Number,
    default: 12,
  },
});
</script>

<style lang="scss" scoped></style>
