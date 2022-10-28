<template>
  <div
    class="h-[72px] flex justify-between items-center px-[16px] md:px-[125px]"
  >
    <router-link to="/">
      <img class="w-24 h-9" src="@/assets/images/logo.png" alt="" />
    </router-link>

    <div v-if="search">
      <search-box v-if="isDesktop"></search-box>

      <div class="flex items-center space-x-6" v-else>
        <router-link to="/search">
          <iconfont-icon
            name="icon-sousuo1"
            class="font-bold text-2xl"
          ></iconfont-icon>
        </router-link>
        <third-link :spaceSize="6"></third-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDesktop } from "@/hooks";

defineProps({
  search: {
    type: Boolean,
    default: true,
  },
});

const isDesktop = useDesktop();
</script>

<style></style>
