<template>
  <div class="w-full min-h-[100vh]" ref="container">
    <!-- <div class="flex justify-between mb-4">
      <div class="text-xl font-bold">ARTWORK</div>
    </div> -->

    <div class="sticky top-0 bg-[#121416FF] z-40">
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

      <div class="py-4" v-if="state.artworkType != 2">
        <div class="flex space-x-4 pr-14">
          <div class="flex-1 min-w-0">
            <input
              v-model="state.keyword"
              type="text"
              class="h-10 w-full bg-[#FFFFFF0D] rounded border-none"
              placeholder="Name/contract/tokenid"
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

      <div
        v-else-if="state.txList[0].length > 0 || state.txList[1].length > 0"
        class="pb-8"
      >
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
            v-for="(item, i) in state.seeMoreTx
              ? ValuationList
              : ValuationList.slice(0, 5)"
            :key="i"
            @click="state.selectedTx = i"
          >
            <div class="flex">
              Evaluation:&nbsp;&nbsp;
              <EthText iconClass="text-base">{{
                formatVal(item.valuation)
              }}</EthText>
            </div>
            <div v-if="!item.isSingle" class="text-[#FFFFFF66]">
              Edition: {{ item.editionCount ? item.editionCount : "--" }}
            </div>
          </div>
          <div
            v-if="ValuationList.length > 6"
            class="flex bg-[#FFFFFF0D] min-h-[40px] h-full text-base items-center justify-center hover:bg-[#121416FF] border-[1px] border-[transparent] hover:border-[#fff] rounded transition-all cursor-pointer"
            :class="{
              'bg-[#121416FF] border-[#fff]':
                state.selectedTx > 6 && !state.seeMoreTx,
            }"
            @click="state.seeMoreTx = !state.seeMoreTx"
          >
            see {{ state.seeMoreTx ? "less" : "more" }} &nbsp;&nbsp;<i
              v-if="!state.seeMoreTx"
              class="iconfont icon-xia1"
            ></i>
            <i v-else class="iconfont icon-shang1"></i>
          </div>
        </div>

        <div class="mt-8 py-4 grid grid-cols-3 text-base bg-[#FFFFFF0D]">
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
              <span v-if="!ValuationList[state.selectedTx].isSingle"
                >,Edition:{{
                  ValuationList[state.selectedTx].editionCount
                }}</span
              >
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
    </div>

    <div class="w-full relative">
      <img
        class="absolute right-0 top-40 z-[36] w-16 cursor-pointer"
        :src="state.isChart ? art2table : art2chart"
        alt=""
        v-if="state.artworkType == 2"
        @click="state.isChart = !state.isChart"
      />

      <div v-if="!state.isChart">
        <div
          class="w-full h-full overflow-y-scroll"
          v-if="results.length > 0 || loading"
        >
          <div class="grid grid-cols-2 gap-4 pb-4">
            <hover-card :info="item" v-for="(item, i) in results" :key="i" />
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
      <div v-else>
        <ScatterChart
          :valueType="ValuationList[state.selectedTx].valueType"
          :cutTime="ValuationList[state.selectedTx].cutPoint"
          class="w-[92%]"
        ></ScatterChart>
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
import art2chart from "@/assets/images/art2chart.png";
import art2table from "@/assets/images/art2table.png";
import ScatterChart from "./ScatterChart.vue";

const $route = useRoute();
const store = useArtStore();
const pid = inject("pid");
const container = ref(null);

const ArtworkType = ["By Time", "By Price", "By Evaluation"];

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
  isChart: false,
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
  return res;
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
    state.selectedTx,
  ],
  () => {
    loadRest(true);
  }
);

watch(
  () => state.artworkType,
  () => {
    loadRest(true);
    setTimeout(() => {
      window.scrollTo(0, container.value.offsetTop - 0.001);
    }, 60);
  }
);

watch(
  () => state.selectTxType,
  () => {
    state.selectedTx = 0;
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
