<template>
  <div
    class="flex items-center flex-col-reverse md:flex-row md:h-[6.5rem] px-[16px] md:px-[125px] md:space-x-12 mb-4 md:mb-0"
  >
    <div class="flex">
      <div class="mr-4">Powered by</div>
      <a class="flex items-center" href="https://thepass.to" target="_blank">
        <img class="w-8 h-8" src="@/assets/images/thepass_logo.png" alt="" />
        <span class="text-xl font-bold ml-4">THEPASS</span>
      </a>
    </div>
    <third-link v-if="isDesktop"></third-link>
  </div>
</template>

<script setup>
import { useDesktop } from "@/hooks";

const isDesktop = useDesktop();
</script>

<style lang="scss" scoped></style>
