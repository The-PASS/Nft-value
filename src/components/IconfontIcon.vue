<template>
  <i class="iconfont" :class="props.name"></i>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<style lang="scss" scoped></style>
