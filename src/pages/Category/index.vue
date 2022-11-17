<template>
  <div class="w-full h-full flex flex-row pb-16 pt-12" v-if="isDesktop">
    <div
      class="w-44 flex flex-col justify-between border-r-[1px] border-[#9797971a]"
    >
      <side-bar v-model="state.tabIndex" :tabs="tabs"></side-bar>
      <third-link v-if="isDesktop"></third-link>
    </div>
    <router-view></router-view>
  </div>
  <div v-else class="w-full h-full flex flex-col pt-4">
    <MbSideBar v-model="state.tabIndex" :tabs="tabs"></MbSideBar>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { getVaultList } from "@/api";
import { suffixNum, localeNumber } from "@/utils";
import { useDesktop } from "@/hooks";
import numeral from "numeral";

const $route = useRoute();

const tabs = [
  {
    key: "Collectables",
    value: "Collectables",
    link: "/list",
  },
  { key: "Art", value: "Art", link: "/list/Art" },
  { key: "Game Assets", value: "", disabled: true },
];

const isDesktop = useDesktop();

const state = reactive({
  tabIndex: 0,
});

watch(
  () => $route.name,
  (val) => {
    const index = tabs.findIndex((x) => x.value == val);
    state.tabIndex = index;
  }
);

onMounted(() => {
  state.tabIndex = tabs.findIndex((x) => x.value == $route.name);
});
</script>

<style scoped>
table td,
table th {
  padding: 0 0.5rem;
}
</style>
