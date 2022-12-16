<template>
  <div class="w-full h-full">
    <div class="h-12 flex justify-end">
      <div class="flex space-x-8">
        <div class="flex space-x-2">
          <div
            class="bar-time-btn flex items-center justify-center w-24"
            :class="{
              'bar-time-btn-active': state.selected == i,
            }"
            v-for="(text, i) in ['Ethereum', 'Tezos']"
            :key="i"
            @click="state.selected = i"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex-1 h-full text-xs min-h-0 md:min-w-0 rounded-lg md:ml-6 bg-[#9797971a]"
    >
      <div
        ref="scroller"
        class="w-full h-full overflow-y-scroll"
        v-if="isDesktop"
      >
        <div class="px-2 pb-2">
          <table class="w-full h-14 sticky top-0 bg-[#1f2123] z-20">
            <colgroup>
              <col style="width: 22%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
            </colgroup>
            <thead>
              <th class="text-left">Artist</th>
              <th class="text-left">
                <UiSort v-model="state.sortValue" :index="0">Market Cap</UiSort>
              </th>
              <th class="text-left">
                <UiSort v-model="state.sortValue" :index="1">
                  Historical Value
                </UiSort>
              </th>
              <th class="text-right">
                <UiSort v-model="state.sortValue" :index="2"> Volume </UiSort>
              </th>

              <th class="text-left">Artwork Evaluation</th>
              <th class="text-left">
                <UiSort v-model="state.sortValue" :index="3">
                  Highest Price
                </UiSort>
              </th>
              <th>
                <div class="flex">
                  <UiSort v-model="state.sortValue" :index="4">
                    Last Price
                  </UiSort>
                </div>
              </th>
            </thead>
          </table>
          <table class="w-full">
            <colgroup>
              <col style="width: 22%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
              <col style="width: 13%" />
            </colgroup>
            <tbody>
              <tr
                class="hover:bg-[#ffffff0d] h-14 cursor-pointer"
                v-for="(item, i) in results"
                :key="i"
                @click="
                  router.push(
                    `/Art/${item.artistName}/${
                      state.selected == 0 ? 'ethereum' : 'tezos'
                    }`
                  )
                "
              >
                <td class="text-left">
                  <router-link
                    :to="`/Art/${item.artistName}/${
                      state.selected == 0 ? 'ethereum' : 'tezos'
                    }`"
                  >
                    <div class="flex items-center">
                      <ui-img
                        class="w-8 h-8 rounded-full mr-2 overflow-hidden flex-shrink-0"
                        :src="item.image || nftpng"
                        alt=""
                      />

                      <div class="text-[#26AAFF] line-clamp-1 w-[140px]">
                        {{ item.fullName }}
                      </div>
                    </div>
                  </router-link>
                </td>

                <td>
                  <EthText :tezos="isTezos">
                    {{ +item.marketCap ? formatVal(item.marketCap) : "--" }}
                  </EthText>
                </td>
                <td>
                  <EthText :tezos="isTezos">
                    {{ formatVal(item.totalHistoryValue) }}
                  </EthText>
                </td>
                <td>
                  <div class="flex items-center">
                    <EthText :tezos="isTezos">
                      {{ item.totalSales ? formatVal(item.totalSales) : "--" }}
                    </EthText>
                  </div>
                </td>

                <td class="text-right">
                  <div
                    class="flex items-center"
                    v-if="item.artworkValuationMin != item.artworkValuationMax"
                  >
                    <EthText :tezos="isTezos">
                      {{
                        formatVal(item.artworkValuationMin)
                      }}&nbsp;&nbsp;~&nbsp;{{
                        formatVal(item.artworkValuationMax)
                      }}
                    </EthText>
                  </div>
                  <div v-else class="flex items-center">
                    <EthText :tezos="isTezos">{{
                      item.artworkValuationMax ? item.artworkValuationMax : "--"
                    }}</EthText>
                  </div>
                </td>

                <td>
                  <EthText :tezos="isTezos">
                    {{ formatVal(item.highestPrice) }}
                  </EthText>
                </td>

                <td>
                  <div class="flex items-center">
                    <EthText :tezos="isTezos">
                      {{
                        +item.lastTxPrice == 0
                          ? "--"
                          : localeNumber(item.lastTxPrice, 2)
                      }}
                    </EthText>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex items-center justify-center" v-if="loading">
            <img class="w-4 h-4" src="@/assets/svgs/spin.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getVaultList } from "@/api";
import { useDesktop, useReqPages } from "@/hooks";
import { suffixNum, localeNumber, formatDateText, formatVal } from "@/utils";
import { withThrottling } from "@/with";
import numeral from "numeral";
import nftpng from "@/assets/images/nftnologo.png";
import { useCommonStore } from "@/store/common.ts";

const scroller = ref(null);
const router = useRouter();
const route = useRoute();
const store = useCommonStore();

const isDesktop = useDesktop();

const isTezos = computed(() => state.selected == 1);

const state = reactive({
  sortValue: [0, -1, -1, -1, -1],
  selected: route.params.chain ? 1 : 0,
});

const sortKeys = [
  "MARKET_CAP",
  "TOTAL_HISTORY_VALUE",
  "TOTAL_SALES",
  "HIGHEST_PRICE",
  "LAST_TX_PRICE",
];

const { loading, results, loadNext, loadRest } = useReqPages(
  async (page, cancel) => {
    const index = state.sortValue.findIndex((x) => x != -1);
    const res = await getVaultList(
      page,
      "ART",
      {
        sort: state.sortValue[index] == 0 ? "DESC" : "ASC",
        order: sortKeys[index],
        chain: state.selected == 0 ? "ethereum" : "tezos",
      },
      cancel
    );
    return res;
  }
);

watch(
  () => [JSON.stringify(state.sortValue)],
  () => {
    loadRest(true);
  }
);

watch(
  () => state.selected,
  (val) => {
    router.replace({
      name: route.name,
      params: {
        chain: state.selected == 0 ? "" : "tezos",
      },
    });
    loadRest(true);
    store.setChain(state.selected == 0 ? "ethereum" : "tezos");
  }
);

watch(
  () => route.params.chain,
  (val) => {
    state.selected = val == "tezos" ? 1 : 0;
  }
);

useInfiniteScroll(scroller, withThrottling(loadNext), {
  distance: 44,
});

onMounted(async () => {
  loadRest();
});
</script>

<style lang="scss" scoped></style>
