<template>
  <div class="w-full h-full flex flex-col md:flex-row">
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
              <th class="text-left">Artwork Evaluation</th>
              <th class="text-left">
                <UiSort v-model="state.sortValue" :index="2">
                  Highest Price
                </UiSort>
              </th>
              <th>
                <div class="flex justify-end">
                  <UiSort v-model="state.sortValue" :index="3">
                    Last Price
                  </UiSort>
                </div>
              </th>
              <th class="text-right">Date</th>
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
                @click="router.push(`/Art/${item.artistName}`)"
              >
                <td class="text-left">
                  <div class="flex items-center">
                    <ui-img
                      class="w-8 h-8 rounded-full mr-2 overflow-hidden flex-shrink-0"
                      :src="item.image"
                      alt=""
                    />
                    <div class="text-[#26AAFF]">{{ item.fullName }}</div>
                  </div>
                </td>

                <td>
                  <EthText>
                    {{ formatVal(item.marketCap) }}
                  </EthText>
                </td>
                <td>
                  <EthText>
                    {{ formatVal(item.totalHistoryValue) }}
                  </EthText>
                </td>

                <td class="text-right">
                  <div
                    class="flex items-center"
                    v-if="item.artworkValuationMin != item.artworkValuationMax"
                  >
                    <EthText>
                      {{ formatVal(item.artworkValuationMin) }} </EthText
                    >&nbsp;&nbsp;~&nbsp;<EthText>
                      {{ formatVal(item.artworkValuationMax) }}
                    </EthText>
                  </div>
                  <div v-else class="flex items-center">
                    <EthText>{{ item.artworkValuationMax }}</EthText>
                  </div>
                </td>

                <td>
                  <EthText>
                    {{ formatVal(item.highestPrice) }}
                  </EthText>
                </td>

                <td>
                  <div class="flex items-center justify-end">
                    <EthText>
                      {{
                        +item.lastTxPrice == 0
                          ? "--"
                          : localeNumber(item.lastTxPrice, 2)
                      }}
                    </EthText>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-end">
                    {{
                      item.lastTxTime
                        ? formatDateText(new Date(item.lastTxTime).getTime())
                        : "--"
                    }}
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

const scroller = ref(null);
const router = useRouter();

const isDesktop = useDesktop();

const state = reactive({
  sortValue: [0, -1, -1, -1],
});

const sortKeys = [
  "MARKET_CAP",
  "TOTAL_HISTORY_VALUE",
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
      },
      cancel
    );
    return res;
  }
);

watch(
  () => JSON.stringify(state.sortValue),
  () => {
    loadRest(true);
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
