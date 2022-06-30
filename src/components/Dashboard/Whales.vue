<template>
  <div class="flex-1 flex flex-col">
    <div class="text-xl font-bold mb-4">WHALES</div>
    <div
      class="flex-1 min-h-0 flex flex-col px-8 pt-6 pb-4 bg-[#1e1f21] rounded-lg"
    >
      <div class="px-2 flex justify-between text-[#5E6873] mb-4">
        <div>Address</div>
        <div>Number owned</div>
      </div>

      <div class="flex-1 min-h-0 text-base" style="height: 368px">
        <ui-scrollbars class="w-full h-full" :onIns="onIns">
          <div
            class="flex h-9 items-center justify-between px-2"
            v-for="(item, i) in results"
            :key="i"
          >
            <div
              class="text-[#26AAFF] hover: underline cursor-pointer line-clamp-1 w-40 break-words"
              @click="copyTx(item.address)"
            >
              {{ item.address }}
            </div>
            <div class="w-20">{{ item.numberOwned }}</div>
          </div>
          <div v-if="loading">
            <div
              class="flex h-9 items-center justify-between px-2"
              v-for="(_, i) in Array(8).fill(0)"
              :key="i"
            >
              <Skeletor class="w-40 h-7 rounded"></Skeletor>
              <Skeletor class="w-20 h-7 rounded"></Skeletor>
            </div>
          </div>
        </ui-scrollbars>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx } from "@/utils";
import { useReqPages } from "@/hooks";
import { withThrottling } from "@/with";
import { getBoardOwnerList } from "@/api";
const store = useStore();
const pid = inject("pid");
const scrollEl = ref(null);

const {
  isEnd,
  loading,
  current,
  next,
  rows,
  total,
  results,
  loadNext,
  loadRest,
} = useReqPages((i) => {
  return getBoardOwnerList(pid, i);
});

useInfiniteScroll(scrollEl, withThrottling(loadNext));

const onIns = (ins) => {
  scrollEl.value = ins.getElements("viewport");
};

onMounted(() => {
  loadRest();
});
</script>

<style lang="scss" scoped></style>
