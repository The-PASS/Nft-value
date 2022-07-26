<template>
  <div class="mr-8">
    <div class="text-xl font-bold mb-4">ITEMS</div>
    <div class="w-[760px] h-[364px]">
      <ui-scrollbars
        :onIns="onIns"
        class="w-full h-full"
        v-if="results.length > 0 || loading"
      >
        <div class="grid grid-cols-4 gap-4 pb-4">
          <div
            v-for="(item, i) in results"
            :key="i"
            class="w-44 p-2 bg-[#FFFFFF0D] rounded overflow-hidden relative cursor-pointer transition-all border-[1px] hover:border-white"
            :class="{
              'border-white': store.dashboard.tokenId == item.tokenId,
              'border-transparent': store.dashboard.tokenId != item.tokenId,
            }"
            @click="store.selectToken(item.tokenId)"
          >
            <div
              class="absolute left-2 top-2 p-2 w-40 token-list__idfloat flex"
            >
              <div>ID:&nbsp;</div>

              <div
                v-if="item.tokenId.length > 10"
                class="self-start text-[8px] mt-1"
                style="word-break: break-word; line-height: 1.2"
              >
                {{ item.tokenId }}
              </div>
              <div v-else>
                {{ item.tokenId }}
              </div>
            </div>

            <ui-img
              class="w-40 h-40 rounded bg-white"
              :src="item.logo"
            ></ui-img>
            <div class="mt-4 space-y-1 w-full">
              <div>Estimated Price</div>
              <div class="flex justify-between">
                <div class="text-[#5E6873FF]">history:</div>
                <div>{{ item.history }} ETH</div>
              </div>
              <div class="flex justify-between">
                <div class="text-[#5E6873FF]">floor:</div>
                <div>{{ item.floor }} ETH</div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-4 pb-4" v-if="loading">
          <div
            v-for="(_, i) in Array(8).fill(0)"
            :key="i"
            class="w-44 p-2 bg-[#FFFFFF0D] rounded overflow-hidden relative cursor-pointer transition-all border-[1px] border-transparent hover:border-white"
          >
            <Skeletor class="w-40 h-40 rounded"></Skeletor>

            <div class="mt-4 space-y-1 w-full">
              <Skeletor class="w-22 h-4 rounded"></Skeletor>
              <div class="flex justify-between">
                <Skeletor class="w-10 h-4 rounded"></Skeletor>
                <Skeletor class="w-16 h-4 rounded"></Skeletor>
              </div>
              <div class="flex justify-between">
                <Skeletor class="w-10 h-4 rounded"></Skeletor>
                <Skeletor class="w-16 h-4 rounded"></Skeletor>
              </div>
            </div>
          </div>
        </div>
      </ui-scrollbars>
      <div
        v-if="results.length == 0 && !loading"
        class="w-full h-full relative"
      >
        <img
          class="w-full h-full"
          src="@/assets/images/no-tokenlist.png"
          alt=""
        />
        <div class="absolute right-28 bottom-36 space-y-2">
          <p class="text-sm">NFT asset fetch fails or no asset exists.</p>
          <p class="text-[#ffffff4d]">· Please refresh your</p>
          <p class="text-[#ffffff4d]">· connection Check your network</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx } from "@/utils";
import { useReqPages } from "@/hooks";
import { withThrottling } from "@/with";
import { getTokenList } from "@/api";

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
  return getTokenList(pid, i);
});

useInfiniteScroll(scrollEl, withThrottling(loadNext));

const onIns = (ins) => {
  scrollEl.value = ins.getElements("viewport");
};

onMounted(() => {
  loadRest();
});
</script>

<style scoped>
.token-list__float {
  background: linear-gradient(180deg, rgba(18, 20, 22, 0) 0%, #121416 100%);
  opacity: 0.8;
}
.token-list__idfloat {
  background: linear-gradient(180deg, #121416 0%, rgba(18, 20, 22, 0) 100%);
  opacity: 0.6;
}
</style>
