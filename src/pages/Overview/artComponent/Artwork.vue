<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <div class="text-xl font-bold">ARTWORK</div>
      <div class="flex">
        <!-- <div
          class="w-16 h-6 mr-6 rounded bg-[#FFFFFF1A] flex items-center justify-center cursor-pointer"
          @click="state.orderType = !state.orderType"
        >
          Price
          <span
            class="ml-2 text-[10px]"
            :class="{
              'transform rotate-180': state.orderType,
            }"
            >▲</span
          >
        </div> -->
        <div class="relative">
          <input
            class="w-[174px] h-6 rounded bg-[#FFFFFF1A] border-0 pl-3 pr-6 text-xs"
            type="text"
            placeholder="tokenID"
            v-model="state.tokenId"
          />
          <iconfont-icon
            v-if="!state.tokenId"
            name="icon-sousuo1"
            class="absolute text-xs right-2 top-1/2 transform -translate-y-1/2"
          ></iconfont-icon>
          <div
            v-else
            class="absolute text-xs right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            @click="state.tokenId = ''"
          >
            <iconfont-icon name="icon-guanbi" class="text-xs"></iconfont-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-h-[480px] overflow-y-scroll" ref="scrollEl">
      <div
        class="w-full h-full overflow-y-scroll"
        v-if="results.length > 0 || loading"
      >
        <div class="grid grid-cols-6 gap-4 pb-4">
          <hover-card :info="item" v-for="(item, i) in results" :key="i">
            <div
              class="w-44 p-2 rounded overflow-hidden relative cursor-pointer transition-all border-[1px] hover:border-white"
              :class="{
                'border-white': store.selectedArtwork.tokenId == item.tokenId,
                'border-transparent':
                  store.selectedArtwork.tokenId != item.tokenId,
              }"
              @click="selectArtwork(item)"
            >
              <div
                class="absolute left-2 top-2 p-2 w-40 token-list__idfloat flex"
              >
                <div>ID:&nbsp;</div>

                <div
                  v-if="item.tokenId.length > 20"
                  class="self-start text-[8px] mt-1"
                  style="word-break: break-word; line-height: 1.2"
                >
                  {{ item.tokenId }}
                </div>
                <div v-else>
                  {{ item.tokenId }}
                </div>
              </div>

              <ui-img class="w-40 h-40 rounded" :src="item.logo"></ui-img>
              <div class="mt-4 space-y-1 w-full">
                <div>Estimated Price</div>
                <div class="flex justify-between">
                  <div class="text-[#5E6873FF]">history price:</div>
                  <div>
                    <EthText iconClass="text-xs">
                      {{ item.valuation }}
                    </EthText>
                  </div>
                </div>
                <!-- <div class="flex justify-between">
                <div class="text-[#5E6873FF]">floor:</div>
                <div>{{ +item.floor ? item.floor : "--" }} ETH</div>
              </div> -->
              </div>
            </div>
          </hover-card>
        </div>

        <div class="grid grid-cols-6 gap-4 pb-4" v-if="loading">
          <div
            v-for="(_, i) in Array(12).fill(0)"
            :key="i"
            class="w-44 p-2 bg-[#FFFFFF0D] rounded overflow-hidden relative cursor-pointer transition-all border-[1px] border-transparent"
          >
            <Skeletor class="w-40 h-40 rounded"></Skeletor>

            <div class="mt-4 space-y-1 w-full">
              <Skeletor class="w-22 h-4 rounded"></Skeletor>
              <div class="flex justify-between">
                <Skeletor class="w-10 h-4 rounded"></Skeletor>
                <Skeletor class="w-16 h-4 rounded"></Skeletor>
              </div>
              <!-- <div class="flex justify-between">
                <Skeletor class="w-10 h-4 rounded"></Skeletor>
                <Skeletor class="w-16 h-4 rounded"></Skeletor>
              </div> -->
            </div>
          </div>
        </div>
      </div>
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
import { getArtwork, getTokenList } from "@/api";
import { useArtStore } from "@/store/art";

const $route = useRoute();
const store = useArtStore();
const pid = inject("pid");
const scrollEl = ref(null);

const state = reactive({
  loadedId: null,
  tokenId: $route.params.tokenId || "",
  orderType: true,
});

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
} = useReqPages(async (i, cancel) => {
  const res = await getArtwork(
    i,
    {
      creatorName: $route.params.name,
      tokenId: state.tokenId,
      // orderType: state.orderType ? "desc" : "asc",
    },
    cancel
  );

  if (
    $route.params.tokenId &&
    res.records.length > 0 &&
    state.loadedId != $route.params.tokenId
  ) {
    state.loadedId = $route.params.tokenId;
    store.selectToken(res.records[0]);
  }

  return res;
});

useInfiniteScroll(scrollEl, withThrottling(loadNext));

const onIns = (ins) => {
  scrollEl.value = ins.getElements("viewport");
};

const selectArtwork = (item) => {
  store.selectToken(item);
};

watch(
  () => [state.tokenId, state.orderType],
  () => {
    loadRest(true);
  }
);

watch(
  () => $route.params.tokenId,
  (val) => {
    state.tokenId = val || "";
  }
);

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
