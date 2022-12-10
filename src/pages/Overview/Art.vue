<template>
  <div v-if="loading" class="h-full flex items-center justify-center">
    <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
  </div>
  <div
    v-else
    class="text-whitebase text-xs max-w-[1200px] min-w-[1200px] mx-auto"
  >
    <!-- <div class="h-[280px] bg-red-400 absolute w-full left-0 top-0"></div>

    <div class="mt-[280px]"></div> -->

    <!-- section 1 -->
    <div class="w-full items-start mt-20">
      <!-- <div class="h-6 relative"> -->
      <ui-img
        class="w-28 h-28 rounded-full overflow-hidden"
        :src="store.baseInfo.artistImage"
        :key="store.baseInfo.artistImage"
      />
      <!-- </div> -->

      <div class="flex justify-between mt-4">
        <p class="font-bold text-4xl">{{ store.baseInfo.artistName }}</p>
        <div class="flex">
          <!-- <div class="text-2xl" @click="state.show = true">Holder do it.</div> -->

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
                store.baseInfo.chain == 'RONIN' &&
                store.baseInfo.officialWebsite
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

      <div class="flex mt-2 w-2/3" style="width: fit-content">
        <div class="">
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
    </div>

    <div class="mt-6">
      <div class="flex space-x-8">
        <div v-for="(item, i) in daoInfo" :key="i">
          <div class="text-xl font-bold" v-if="!item.eth">
            {{ item.value ? item.value : "--" }}
          </div>
          <EthText class="font-bold text-xl" v-else>{{
            item.value ? formatVal(item.value) : "--"
          }}</EthText>
          <div class="text-[#FFFFFF66]">{{ item.name }}</div>
        </div>
      </div>
      <div class="flex space-x-4 mt-4" v-if="store.baseInfo.daoInfo.length > 0">
        <ui-tippyer
          :content="item.name"
          v-for="(item, i) in store.baseInfo.daoInfo"
          :key="i"
        >
          <a
            :href="`https://app.thepass.to/dao/${item.daoPath}`"
            target="_blank"
          >
            <ui-img
              class="w-12 h-12 rounded-full overflow-hidden"
              :src="item.logo"
            />
          </a>
        </ui-tippyer>
      </div>
    </div>

    <!-- section 2 -->
    <div class="mt-16">
      <div class="text-xl font-bold mb-4">BASIC DATA</div>
      <div class="grid grid-cols-5 gap-4">
        <div
          class="h-24 rounded-lg basic-data-box flex flex-col justify-center pl-4"
          :class="{
            'basic-data-box__red': +item.gains < 0,
            'basic-data-box__green': +item.gains > 0,
            'basic-data-box__zero': +item.gains == 0,
          }"
          v-for="(item, i) in basicData"
          :key="i"
        >
          <div class="text-xl">
            <EthText iconClass="text-xl" v-if="item.eth">
              {{ item.value }}</EthText
            >
            <div v-else-if="item.eth2" class="flex">
              <EthText iconClass="text-xl" v-if="!(+item.value[0] < 0.001)">
                {{ numeral(item.value[0]).format("0.00a").toUpperCase() }}
              </EthText>
              <div v-else>
                <ui-tippyer :content="localeNumber(item.value[0], 2)">
                  <EthText class="cursor-pointer" iconClass="text-xl"
                    >{{ `<0.001` }}
                  </EthText>
                  <template #content>
                    <EthText>{{ localeNumber(item.value[0], 2) }}</EthText>
                  </template>
                </ui-tippyer>
              </div>

              <span>&nbsp;~&nbsp;</span>
              <EthText iconClass="text-xl">{{
                numeral(item.value[1]).format("0.00a").toUpperCase()
              }}</EthText>
            </div>

            <span v-else>
              {{ item.value }}
            </span>
          </div>
          <div class="text-sm relative flex items-center text-[#FFFFFF66] mt-2">
            <span class="mr-2">
              {{ item.name }}
            </span>
            <tippy
              v-if="item.tip"
              :content="item.tip"
              :arrow="false"
              placement="bottom"
              ><i class="iconfont icon-tishi cursor-pointer text-[#fff]"></i
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

    <div class="mt-8 flex space-x-4" style="height: 420px">
      <NftValue class="w-2/5"></NftValue>
      <NftTransaction class="w-3/5"></NftTransaction>
    </div>

    <div class="flex mt-8">
      <ScatterChart></ScatterChart>
    </div>

    <div class="flex mt-8">
      <Artwork></Artwork>
      <!-- <dashboard-whales></dashboard-whales> -->
    </div>

    <!-- <TxRecord></TxRecord> -->

    <!-- section 5 -->
    <!-- <div class="mt-8 rounded w-full p-6" style="background: #1e1f21">
        <dashboard-trade-history></dashboard-trade-history>
      </div> -->
  </div>

  <GDialog v-model="state.show" no-click-animation>
    <HolderView></HolderView>
  </GDialog>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import {
  formatAddress,
  copyTx,
  localeNumber,
  suffixNum,
  formatVal,
} from "@/utils";
import dayjs from "dayjs";
import numeral from "numeral";
import { useArtStore } from "@/store/art.ts";
import Artwork from "./artComponent/Artwork.vue";
import NftTransaction from "./artComponent/NftTransaction.vue";
import NftValue from "./artComponent/NftValue.vue";
import TxRecord from "./artComponent/TxRecord.vue";
import ScatterChart from "./artComponent/ScatterChart.vue";
import { useReqByBool } from "@/hooks";
import { GDialog } from "gitart-vue-dialog";
import HolderView from "./artComponent/HolderView.vue";

const route = useRoute();
const store = useArtStore();

const state = reactive({
  more: false,
  show: false,
});

const daoInfo = computed(() => [
  {
    value: store.baseInfo.daosCount,
    name: "Collected DAOs",
  },
  {
    value: store.baseInfo.artworksCount,
    name: "Collected Artworks",
  },
  {
    value: store.baseInfo.totalValue,
    name: "Collected Value",
    eth: true,
  },
]);

const basicData = computed(() => [
  {
    value: formatVal(store.baseInfo.totalSales),
    name: "Volume",
    eth: true,
  },
  {
    value: formatVal(store.baseInfo.highestPrice),
    name: "Highest Price",
    eth: true,
  },
  {
    value: formatVal(store.baseInfo.secondaryTotalSales),
    name: "Secondary Market Sales",
    eth: true,
  },
  {
    value: formatVal(store.baseInfo.secondaryHighestPrice),
    name: "Highest in Secondary",
    eth: true,
  },
  {
    value: formatVal(store.baseInfo.lastTxPrice),
    name: "Last Price",
    eth: true,
  },
  {
    value:
      store.baseInfo.artworkValuationMin == store.baseInfo.artworkValuationMax
        ? numeral(store.baseInfo.artworkValuationMax)
            .format("0.00a")
            .toUpperCase()
        : [
            store.baseInfo.artworkValuationMin,
            store.baseInfo.artworkValuationMax,
          ],
    name: "Artwork Evaluation",
    eth2: !(
      store.baseInfo.artworkValuationMin == store.baseInfo.artworkValuationMax
    ),
    eth:
      store.baseInfo.artworkValuationMin == store.baseInfo.artworkValuationMax,
  },

  {
    value: numeral(store.baseInfo.artValueMarketCap)
      .format("0.00a")
      .toUpperCase(),
    name: "Market Cap",
    tip: "Valuation price * quantity",
    eth: true,
  },

  {
    value: localeNumber(store.baseInfo.countWork, 0),
    name: "Artwork",
  },
]);

const { loadData, loading } = useReqByBool(async () => {
  await store.loadInfo(route.params.name);
});

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
