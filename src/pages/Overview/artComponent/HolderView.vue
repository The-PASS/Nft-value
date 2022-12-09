<template>
  <div
    class="flex text-white"
    :style="`height: ${isLargeScreen ? '448px' : 'calc(100vh - 72px)'}`"
  >
    <TopHolder class="mb-6" :loading="loading" :data="state.data"></TopHolder>

    <!-- <div class="md:flex-1 min-w-0 h-full relative">
      <img class="block w-full h-full" src="@/assets/relation_bg.png" alt="" /> -->

    <!-- <RelationView
        :style="`height: ${isLargeScreen ? '448px' : 'calc(100vh - 72px)'}`"
        :data="state.data"
        v-if="!loading"
      ></RelationView> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { getArtHolder } from "@/api";
import { useDesktop, useReqByBool } from "@/hooks";
import TopHolder from "./TopHolder.vue";

const $route = useRoute();
const isLargeScreen = useDesktop();

const state = reactive({
  data: [],
});

const { loadData, loading } = useReqByBool(async () => {
  const res = await getArtHolder($route.params.name);
  state.data = res.holders;
});

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
