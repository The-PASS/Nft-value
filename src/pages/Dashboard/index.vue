<template>
  <div
    v-if="store.loading.dashboardInfo"
    class="h-full flex items-center justify-center"
  >
    <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
  </div>
  <div
    v-else
    class="text-whitebase mt-16 text-xs pb-8 max-w-[1200px] min-w-[1200px] mx-auto"
  >
    <!-- section 1 -->
    <div class="flex justify-between w-full items-start">
      <div v-if="store.loading.dashboardInfo" class="flex w-full">
        <Skeletor class="w-20 h-20 mr-6"></Skeletor>
        <div class="mt-4 w-2/3 space-y-1">
          <Skeletor class="h-5 rounded"></Skeletor>
          <Skeletor class="rounded h-10"></Skeletor>
        </div>
      </div>

      <div class="flex" style="width: fit-content" v-else>
        <ui-img
          class="w-20 h-20 rounded-full overflow-hidden bg-white mr-6 flex-shrink-0"
          :src="store.dashboard.logo"
          :key="store.dashboard.logo"
        />
        <div class="mt-4 w-2/3">
          <p class="font-bold text-xl">{{ store.dashboard.projectName }}</p>
          <p class="text-[#5E6873FF] mb-2">
            Created Time:
            {{ dayjs(store.dashboard.createdDate).format("YYYY/MM/DD") }}
          </p>
          <p
            class="text-xs"
            :class="{
              'line-clamp-2': !state.more,
            }"
          >
            {{ store.dashboard.des }}
          </p>
          <div
            v-if="store.dashboard.des && store.dashboard.des.length > 200"
            class="mt-2 flex items-center cursor-pointer"
            @click="state.more = !state.more"
          >
            See {{ state.more ? "less" : "more" }}
            <i
              class="iconfont text-sm ml-2"
              :class="{
                'icon-shang1': state.more,
                'icon-xia1': !state.more,
              }"
            ></i>
          </div>
        </div>
      </div>

      <div class="flex">
        <ui-tippyer content="OPENSEA" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://opensea.io/collection/${store.dashboard.openseaSlug}`"
            target="_blank"
            v-if="store.dashboard.openseaSlug"
          >
            <div class="p-2 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/i-opensea.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>

        <ui-tippyer content="ETHEREUM" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://etherscan.io/token/${store.dashboard.contractAdd}`"
            v-if="
              store.dashboard.chain == 'ETHEREUM' && store.dashboard.contractAdd
            "
            target="_blank"
          >
            <div class="p-2 flex-shrink-0 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/etherscan.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>

        <ui-tippyer content="POLYGON" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://polygonscan.com/token/${store.dashboard.contractAdd}`"
            v-if="
              store.dashboard.chain == 'POLYGON' &&
              store.dashboard.officialWebsite
            "
            target="_blank"
          >
            <div class="p-2 flex-shrink-0 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/polygon.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>

        <ui-tippyer content="RONIN" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://explorer.roninchain.com/token/${store.dashboard.contractAdd}`"
            v-if="
              store.dashboard.chain == 'RONIN' &&
              store.dashboard.officialWebsite
            "
            target="_blank"
          >
            <div class="p-2 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/ronin.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>

        <ui-tippyer content="WEBSITE" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="store.dashboard.officialWebsite"
            v-if="store.dashboard.officialWebsite"
            target="_blank"
          >
            <div class="p-2 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/website.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>

        <ui-tippyer content="TWITTER" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://twitter.com/${store.dashboard.twitterName}`"
            target="_blank"
            v-if="store.dashboard.twitterName"
          >
            <div class="p-2 hover:bg-[#FFFFFF1A] rounded">
              <img
                class="w-5 h-5 cursor-pointer"
                src="@/assets/images/twitter.png"
                alt=""
              />
            </div>
          </a>
        </ui-tippyer>
      </div>
    </div>

    <!-- section 2 -->
    <div class="mt-16">
      <div class="text-xl font-bold mb-4">BASIC DATA</div>
      <div class="flex justify-between" v-if="!store.loading.dashboardInfo">
        <div
          class="w-56 h-24 rounded basic-data-box flex flex-col items-center justify-center"
          :class="{
            'basic-data-box__red': +item.gains < 0,
            'basic-data-box__green': +item.gains > 0,
            'basic-data-box__zero': +item.gains == 0,
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
                  'text-zero': +item.gains == 0,
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
    <div class="mt-8 rounded w-full p-6" style="background: #1e1f21">
      <dashboard-trade-history></dashboard-trade-history>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx, localeNumber, suffixNum } from "@/utils";
import dayjs from "dayjs";
import numeral from "numeral";

const route = useRoute();
const store = useStore();

const state = reactive({
  more: false,
});

provide(
  "pid",
  computed(() => store.dashboard.id)
);

const basicData = computed(() => [
  { value: localeNumber(store.dashboard.items, 0), name: "Items" },
  {
    value:
      numeral(store.dashboard.marketCap).format("0.00a").toUpperCase() + " ETH",
    name: "Market cap",
    tip: "Based on estimated price by history.",
  },
  {
    value: `${numeral(store.dashboard.totalVolume)
      .format("0.00a")
      .toUpperCase()} ETH`,
    name: "Volume",
  },
  {
    value: localeNumber(store.dashboard.owners, 0),
    name: "Owners",
    gains: suffixNum((store.dashboard.floorPriceRate * 100).toFixed(2)),
  },
  {
    value: `${localeNumber(store.dashboard.floorPrice, 2)} ETH`,
    name: "Floor Price",
    gains: suffixNum((store.dashboard.ownersRate * 100).toFixed(2)),
  },
]);

const loadData = async () => {
  const id = route.params.name;
  await store.loadBoardBaseInfo(id);
};

onBeforeMount(() => {
  store.resetDashboard();
});

onMounted(async () => {
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
.basic-data-box__zero {
  box-shadow: inset 0px 0px 16px 0px rgba(255, 255, 255, 0.3);
}
.text-green {
  color: rgba(94, 255, 106, 1);
}
.text-red {
  color: rgba(255, 81, 102, 1);
}
.text-zero {
  color: rgba(255, 255, 255, 0.6);
}
</style>
