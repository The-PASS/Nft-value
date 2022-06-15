<template>
  <div class="w-full h-full flex flex-col">
    <Header :search="route.meta.search"></Header>
    <div class="flex-1 min-h-0" :class="{ 'px-[125px]': padding }">
      <slot></slot>
    </div>
    <Footer v-if="footer"></Footer>
  </div>
</template>

<script setup>
const route = useRoute();

defineProps({
  footer: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped></style>
