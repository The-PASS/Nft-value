<template>
  <!-- <div v-if="state.loading" class="h-full flex items-center justify-center">
    <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
  </div> -->
  <div class="text-whitebase mt-16 text-xs pb-8">
    <!-- section 1 -->
    <div class="flex justify-between w-full">
      <div v-if="store.loading.dashboardInfo" class="flex w-full">
        <Skeletor class="w-20 h-20 mr-6"></Skeletor>
        <div class="mt-4 w-2/3 space-y-1">
          <Skeletor class="h-5 rounded"></Skeletor>
          <Skeletor class="rounded h-10"></Skeletor>
        </div>
      </div>

      <div class="flex" v-else>
        <ui-img
          class="w-20 h-20 rounded-full overflow-hidden bg-white mr-6 flex-shrink-0"
          :src="store.dashboard.logo"
          :key="store.dashboard.logo"
        />
        <div class="mt-4 w-2/3">
          <p class="font-bold text-xl">{{ store.dashboard.projectName }}</p>
          <p class="text-xs">
            {{ store.dashboard.des }}
          </p>
        </div>
      </div>

      <div></div>
    </div>

    <!-- section 2 -->
    <div class="mt-16">
      <div class="text-xl font-bold mb-4">Basic data</div>
      <div class="flex justify-between" v-if="!store.loading.dashboardInfo">
        <div
          class="w-56 h-24 rounded basic-data-box flex flex-col items-center justify-center"
          :class="{
            'basic-data-box__red': +item.gains < 0,
            'basic-data-box__green': +item.gains > 0,
          }"
          v-for="(item, i) in basicData"
          :key="i"
        >
          <div class="text-xl font-bold">{{ item.value }}</div>
          <div class="text-sm m-2 relative flex items-center">
            <span class="mr-2">
              {{ item.name }}
            </span>
            <tippy
              v-if="item.tip"
              :content="item.tip"
              :arrow="false"
              placement="bottom"
              ><i class="iconfont icon-tishi cursor-pointer ml-2"></i
            ></tippy>
            <div v-if="item.gains">
              <span
                class="font-bold"
                :class="{
                  'text-green': +item.gains > 0,
                  'text-red': +item.gains < 0,
                }"
                >{{ item.gains }}%
              </span>
              (24H)
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between" v-else>
        <Skeletor
          class="w-56 h-24 rounded"
          v-for="(_, i) in Array(5).fill(0)"
          :key="i"
        >
        </Skeletor>
      </div>
    </div>

    <!-- section 3 -->
    <div class="flex mt-8">
      <dashboard-items></dashboard-items>
      <dashboard-whales></dashboard-whales>
    </div>

    <!-- section 4 -->
    <div class="mt-8">
      <div class="text-xl font-bold mb-4">CORE TRAITS RANK</div>
      <div class="flex">
        <dashboard-core-traits-rank></dashboard-core-traits-rank>
        <dashboard-traits-history></dashboard-traits-history>
      </div>
    </div>

    <!-- section 5 -->
    <div
      class="mt-8 rounded w-full p-6"
      style="background: #1e1f21; height: 720px"
    >
      <dashboard-trade-history></dashboard-trade-history>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx, localeNumber, suffixNum } from "@/utils";

const route = useRoute();
const store = useStore();

provide("pid", route.params.id);

const basicData = computed(() => [
  { value: localeNumber(store.dashboard.items, 0), name: "Items" },
  {
    value: localeNumber(store.dashboard.marketCap, 2) + " ETH",
    name: "Market cap",
    tip: "Based on estimated price by history.",
  },
  {
    value: localeNumber(store.dashboard.owners, 0),
    name: "Owners" /* gains: "+14.31" */,
  },
  {
    value: `${localeNumber(store.dashboard.floorPrice, 2)} ETH`,
    name: "Floor Price",
    // gains: "-14.31",
  },
  {
    value: `${localeNumber(store.dashboard.totalVolume, 2)} ETH`,
    name: "Volume",
    gains: suffixNum((store.dashboard.volumeRate * 100).toFixed(2)),
  },
]);

const loadData = async () => {
  const id = route.params.id;
  await store.loadBoardBaseInfo(id);
};

onMounted(async () => {
  store.resetDashboard();
  loadData();
});

// useInfiniteScroll 待处理操作 ++

watch(() => JSON.stringify(route.params), loadData);
</script>

<style scoped>
.basic-data-box {
  background: rgba(255, 255, 255, 0.05);
}
.basic-data-box__red {
  box-shadow: inset 0px 0px 16px 0px rgba(255, 81, 102, 0.3);
}
.basic-data-box__green {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0px 0px 16px 0px rgba(94, 255, 106, 0.3);
}
.text-green {
  color: rgba(94, 255, 106, 1);
}
.text-red {
  color: rgba(255, 81, 102, 1);
}
</style>
