<template>
  <div class="h-full rounded-lg p-6 bg-[#FFFFFF0D]">
    <div class="font-bold text-xl">NFT Transaction</div>
  </div>
</template>

<script setup>
import { getArtTransaction } from "@/api";
import { useReqByBool } from "@/hooks";

const $route = useRoute();

const { loadData, loading } = useReqByBool(async () => {
  const res = await getArtTransaction($route.params.name);
  console.log(res);
});

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
