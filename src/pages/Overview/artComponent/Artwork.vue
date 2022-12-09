<template>
  <div class="w-full min-h-[100vh]">
    <!-- <div class="flex justify-between mb-4">
      <div class="text-xl font-bold">ARTWORK</div>
    </div> -->
    <div
      class="flex text-base font-bold space-x-8 text-[#FFFFFFB3] border-b-[1px] border-b-[#FFFFFF1A]"
    >
      <div
        v-for="(text, i) in ArtworkType"
        :key="i"
        class="transition-all flex items-center h-10 cursor-pointer relative"
        :class="{
          ' text-[#fff]': state.artworkType == i,
        }"
        @click="state.artworkType = i"
      >
        {{ text }}
        <transition name="fade">
          <div
            v-if="state.artworkType == i"
            class="absolute h-[4px] bg-[#fff] w-full bottom-0"
          ></div>
        </transition>
      </div>
    </div>

    <div class="my-4" v-if="state.artworkType != 2">
      <div class="flex space-x-4 pr-14">
        <div class="flex-1 min-w-0">
          <input
            v-model="state.keyword"
            type="text"
            class="h-10 w-full bg-[#FFFFFF0D] rounded border-none"
            placeholder="Name/tokenid"
          />
        </div>

        <UiDropdown
          class="w-40"
          :options="state.plats"
          v-model="state.selectedPlat"
          v-if="state.plats.length > 1"
          :key="state.plats"
        ></UiDropdown>

        <UiSort v-model="state.sortValue" :index="0">{{
          state.artworkType == 0 ? "Time" : "Price"
        }}</UiSort>
      </div>
    </div>

    <div v-else-if="state.txList[0].length > 0 || state.txList[1].length > 0">
      <div class="flex py-4 space-x-4 border-b-[1px] border-b-[#FFFFFF1A]">
        <div
          class="bar-time-btn text-base h-10 px-4"
          :class="{
            'bar-time-btn-active': state.selectTxType == i,
          }"
          v-for="(item, i) in ValuationTypes"
          :key="i"
          @click="state.selectTxType = i"
        >
          {{ item }}
        </div>
      </div>

      <div class="grid grid-cols-6 gap-4 mt-4">
        <div
          class="flex flex-col text-base py-2 bg-[#FFFFFF0D] min-h-10 items-center justify-center hover:bg-[#121416FF] border-[1px] border-[transparent] hover:border-[#fff] rounded transition-all cursor-pointer"
          :class="{
            'bg-[#121416FF] border-[#fff]':
              ValuationList[state.selectedTx].valueType == item.valueType,
          }"
          v-for="(item, i) in ValuationList"
          :key="i"
          @click="state.selectedTx = i"
        >
          <div class="flex">
            Valuation:&nbsp;&nbsp;
            <EthText iconClass="text-base">{{
              formatVal(item.valuation)
            }}</EthText>
          </div>
          <div v-if="!item.isSingle" class="text-[#FFFFFF66]">
            Edition: {{ item.editionCount ? item.editionCount : "--" }}
          </div>
        </div>
        <div
          class="flex bg-[#FFFFFF0D] min-h-[40px] h-full text-base items-center justify-center hover:bg-[#121416FF] border-[1px] border-[transparent] hover:border-[#fff] rounded transition-all cursor-pointer"
          @click="state.seeMoreTx = !state.seeMoreTx"
        >
          see more &nbsp;&nbsp;<i
            v-if="!state.seeMoreTx"
            class="iconfont icon-xia1"
          ></i>
          <i v-else class="iconfont icon-shang1"></i>
        </div>
      </div>

      <div class="my-8 grid grid-cols-3 text-base">
        <div class="flex flex-col items-center">
          <div class="font-bold">
            {{ ValuationList[state.selectedTx].txCount }}
          </div>
          <div class="mt-2 text-[#FFFFFF66]">Total Transactions</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold">
            {{
              (ValuationList[state.selectedTx].isSingle
                ? ValuationList[state.selectedTx].tag
                : ValuationList[state.selectedTx].collectionName) || "--"
            }}
          </div>
          <div class="mt-2 text-[#FFFFFF66]">Key Trait</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold">
            {{
              formatDate(
                ValuationList[state.selectedTx].cutPoint,
                "YYYY-MM-DD HH:mm"
              )
            }}
          </div>
          <div class="mt-2 text-[#FFFFFF66]">Cut time</div>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div
        class="w-full h-full overflow-y-scroll"
        v-if="results.length > 0 || loading"
      >
        <div class="grid grid-cols-2 gap-4 pb-4">
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
              </div>
            </div>
          </hover-card>
        </div>

        <div
          v-if="loading"
          class="w-full h-full flex items-center justify-center"
        >
          <img class="w-6 h-6" src="@/assets/svgs/spin.svg" alt="" />
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
import { formatAddress, copyTx, formatVal, formatDate } from "@/utils";
import { useReqPages } from "@/hooks";
import { withThrottling } from "@/with";
import {
  getArtistPlats,
  getArtTxRecord,
  getArtworkList,
  getTokenList,
} from "@/api";
import { useArtStore } from "@/store/art";

const $route = useRoute();
const store = useArtStore();
const pid = inject("pid");

const ArtworkType = ["By Time", "By Price", "By Valuation"];

const state = reactive({
  loadedId: null,
  tokenId: $route.params.tokenId || "",
  orderType: true,
  artworkType: 0,
  plats: [],
  selectedPlat: {},
  sortValue: [0],
  keyword: "",
  selectTxType: 0,
  selectedTx: 0,
  txList: [],
  seeMoreTx: false,
});

const ValuationTypes = computed(() => {
  const res = [];
  if (state.txList[0].length > 0) {
    res.push("Single");
  }
  if (state.txList[1].length > 0) {
    res.push("Edition");
  }
  return res;
});

const ValuationList = computed(() => {
  const type = ValuationTypes.value[state.selectTxType];
  const res = state.txList[type == "Single" ? 0 : 1];
  return state.seeMoreTx ? res : res.slice(0, 5);
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
  if (state.artworkType == 2 && !state.selectedTx) {
    state.txList = await getArtTxRecord($route.params.name, cancel);
    state.selectedTx = 0;
  }

  const res = await getArtworkList(
    i,
    $route.params.name,
    state.keyword,
    {
      orderItem: ["time", "price", "value"][state.artworkType],
      orderType:
        state.artworkType == 2
          ? "desc"
          : state.sortValue[0] == 0
          ? "desc"
          : "asc",
      plat: state.artworkType == 2 ? "" : state.selectedPlat.value,
      valueType:
        state.artworkType == 2
          ? ValuationList.value[state.selectedTx].valueType
          : "",
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

useInfiniteScroll(window, withThrottling(loadNext), {
  distance: 44,
});

const selectArtwork = (item) => {
  store.selectToken(item);
};

watch(
  () => [
    state.tokenId,
    state.orderType,
    state.keyword,
    state.artworkType,
    state.sortValue[0],
    state.selectedPlat,
    state.selectTxType,
    state.selectedTx,
  ],
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

onMounted(async () => {
  const res = await getArtistPlats($route.params.name);
  if (res.length > 1) {
    state.plats = res.map((x) => ({ label: x, value: x }));
    state.plats.unshift({ label: "Platform", value: "" });
  }
  state.selectedPlat = { label: "Platform", value: "" };
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
