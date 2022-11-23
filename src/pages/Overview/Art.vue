<template>
  <div v-if="store.infoLoading" class="h-full flex items-center justify-center">
    <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
  </div>
  <div
    v-else
    class="text-whitebase mt-16 text-xs pb-8 max-w-[1200px] min-w-[1200px] mx-auto"
  >
    <!-- section 1 -->
    <div class="flex justify-between w-full items-start">
      <!-- <div v-if="store.infoLoading" class="flex w-full">
        <Skeletor class="w-20 h-20 mr-6"></Skeletor>
        <div class="mt-4 w-2/3 space-y-1">
          <Skeletor class="h-5 rounded"></Skeletor>
          <Skeletor class="rounded h-10"></Skeletor>
        </div>
      </div> -->

      <div class="flex" style="width: fit-content">
        <ui-img
          class="w-20 h-20 rounded-full overflow-hidden mr-6 flex-shrink-0"
          :src="store.baseInfo.artistImage"
          :key="store.baseInfo.artistImage"
        />
        <div class="mt-4 w-2/3">
          <p class="font-bold text-xl">{{ store.baseInfo.artistName }}</p>
          <!-- <p class="text-[#5E6873FF] mb-2">
            Created Time:
            {{ dayjs(store.baseInfo.createdDate).format("YYYY/MM/DD") }}
          </p> -->
          <p
            class="text-xs"
            :class="{
              'line-clamp-2': !state.more,
            }"
          >
            {{ store.baseInfo.artistIntroduction }}
          </p>
          <div
            v-if="
              store.baseInfo.artistIntroduction &&
              store.baseInfo.artistIntroduction.length > 200
            "
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
            :href="`https://opensea.io/collection/${store.baseInfo.openseaSlug}`"
            target="_blank"
            v-if="store.baseInfo.openseaSlug"
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

        <ui-tippyer
          class="flex-shrink-0"
          :interactive="true"
          :popperOptions="{ escapeWithReference: false }"
          placement="bottom"
        >
          <div
            class="p-2 flex-shrink-0 hover:bg-[#FFFFFF1A] rounded"
            v-if="store.baseInfo.tezosAddress.length > 0"
          >
            <img
              class="w-5 h-5 cursor-pointer"
              src="@/assets/images/tezos.png"
              alt=""
            />
          </div>
          <template #content>
            <a
              class="link-hover block py-1"
              :href="`https://tzkt.io/${address}/operations`"
              target="_blank"
              v-for="(address, i) in store.baseInfo.tezosAddress"
              :key="i"
            >
              {{ address }}
            </a>
          </template>
        </ui-tippyer>
        <ui-tippyer
          class="flex-shrink-0"
          interactive
          :trigger="isLargeScreen ? undefined : 'click'"
          :popperOptions="{ escapeWithReference: false }"
          placement="bottom"
        >
          <div
            class="p-2 flex-shrink-0 hover:bg-[#FFFFFF1A] rounded"
            v-if="store.baseInfo.ethAddress.length > 0"
          >
            <img
              class="w-5 h-5 cursor-pointer"
              src="@/assets/images/etherscan.png"
              alt=""
            />
          </div>
          <template #content>
            <a
              class="link-hover block py-1"
              :href="`https://etherscan.io/address/${address}`"
              target="_blank"
              v-for="(address, i) in store.baseInfo.ethAddress"
              :key="i"
            >
              {{ address }}
            </a>
          </template>
        </ui-tippyer>

        <ui-tippyer content="POLYGON" class="flex-shrink-0">
          <a
            class="block flex-shrink-0"
            :href="`https://polygonscan.com/token/${store.baseInfo.contractAdd}`"
            v-if="
              store.baseInfo.chain == 'POLYGON' &&
              store.baseInfo.officialWebsite
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
            :href="`https://explorer.roninchain.com/token/${store.baseInfo.contractAdd}`"
            v-if="
              store.baseInfo.chain == 'RONIN' && store.baseInfo.officialWebsite
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
            :href="store.baseInfo.officialWebsite"
            v-if="store.baseInfo.officialWebsite"
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
            :href="store.baseInfo.artistTwitterName"
            target="_blank"
            v-if="store.baseInfo.artistTwitterName"
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
      <div class="flex space-x-4">
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
    </div>

    <!-- section 3 -->
    <div class="flex mt-8">
      <Artwork></Artwork>
      <!-- <dashboard-whales></dashboard-whales> -->
    </div>

    <div class="flex mt-8">
      <ScatterChart></ScatterChart>
    </div>

    <div class="mt-8">
      <TxRecord></TxRecord>
    </div>

    <!-- section 4 -->
    <div class="mt-8 flex space-x-4" style="height: 420px">
      <NftValue class="w-2/5"></NftValue>
      <NftTransaction class="w-3/5"></NftTransaction>
    </div>

    <!-- section 5 -->
    <!-- <div class="mt-8 rounded w-full p-6" style="background: #1e1f21">
        <dashboard-trade-history></dashboard-trade-history>
      </div> -->
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx, localeNumber, suffixNum } from "@/utils";
import dayjs from "dayjs";
import numeral from "numeral";
import { useArtStore } from "@/store/art.ts";
import Artwork from "./artComponent/Artwork.vue";
import NftTransaction from "./artComponent/NftTransaction.vue";
import NftValue from "./artComponent/NftValue.vue";
import TxRecord from "./artComponent/TxRecord.vue";
import ScatterChart from "./artComponent/ScatterChart.vue";

const route = useRoute();
const store = useArtStore();

const state = reactive({
  more: false,
});

const basicData = computed(() => [
  {
    value:
      numeral(store.baseInfo.historicalValue).format("0.00a").toUpperCase() +
      " ETH",
    name: "Historical Value",
  },
  {
    value:
      numeral(store.baseInfo.artValueMarketCap).format("0.00a").toUpperCase() +
      " ETH",
    name: "Market cap",
    tip: "Valuation price * quantity",
  },
  {
    value: `${numeral(store.baseInfo.artValueArtworkValuation)
      .format("0.00a")
      .toUpperCase()} ETH`,
    name: "Artwork Valuation",
    tip: "single edition",
  },
  {
    value: localeNumber(store.baseInfo.countWork, 0),
    name: "Artwork",
  },
]);

const loadData = async () => {
  await store.loadInfo(route.params.name);
};

onBeforeMount(() => {
  store.resetDashboard();
});

onMounted(async () => {
  loadData();
});

// useInfiniteScroll 待处理操作 ++

watch(
  () => store.baseInfo,
  (val) => {
    console.log(val);
  }
);

watch(
  () => JSON.stringify(route.params),
  (val) => {
    // if (val.name) {
    loadData();
    // }
  }
);
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
