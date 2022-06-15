<template>
  <tippy tag="div" :arrow="false" :content="content">
    <slot></slot>
  </tippy>
</template>

<script setup>
const props = defineProps({ content: String });
</script>

<style>
.tippy-box {
  box-shadow: 8px 45px 32px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  background: transparent;
}
.tippy-content {
  padding: 8px;
  font-size: 12px;
  color: #fff;
}
</style>
