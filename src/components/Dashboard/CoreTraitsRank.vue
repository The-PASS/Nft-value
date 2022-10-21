<template>
  <div class="flex-1 mr-6" style="height: 364px">
    <ui-scrollbars class="w-full h-full" :onIns="onIns">
      <table class="w-full text-[#5E6873] sticky top-0 bg-wall">
        <colgroup>
          <col style="width: 14%" />
          <col style="width: 14%" />
          <col style="width: 10%" />
          <col style="width: 12%" />
          <col style="width: 10%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead class="text-left">
          <th>Type</th>
          <th>Value</th>
          <th>Rarity</th>
          <th>
            <div class="flex items-center">
              Rank
              <tippy content="Based on history trade weights.">
                <iconfont-icon
                  name="icon-tishi"
                  class="text-white ml-2 text-xs"
                ></iconfont-icon
              ></tippy>
            </div>
          </th>
          <th>
            <div class="flex items-center">
              K
              <tippy
                content="In order to avoid some NFT transaction frequency being too low and failing to reflect market changes, the price coefficient is set according to the overall changes of the project."
              >
                <iconfont-icon
                  name="icon-tishi"
                  class="text-white ml-2 text-xs"
                ></iconfont-icon
              ></tippy>
            </div>
          </th>
          <th>Price by history</th>
          <th class="w-[20%]">Price by floor</th>
        </thead>
      </table>
      <table class="w-full">
        <colgroup>
          <col style="width: 14%" />
          <col style="width: 14%" />
          <col style="width: 10%" />
          <col style="width: 12%" />
          <col style="width: 10%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <tbody>
          <tr
            class="h-11 hover:bg-[#ffffff1a] cursor-pointer"
            v-for="(item, i) in results"
            :class="{
              'bg-[#ffffff1a]':
                store.dashboard.traitType == item.traitType &&
                store.dashboard.traitValue == item.value,
            }"
            @click="store.selectTraits(item.traitType, item.value)"
            :key="i"
          >
            <td class="text-left">
              {{ item.traitType }}
            </td>
            <td class="text-left">
              <ui-tippyer :content="item.value">
                <div
                  class="line-clamp-1 text-ellipsis w-[48px] whitespace-nowrap"
                  style="display: block"
                >
                  {{ item.value == undefined ? "--" : item.value }}
                </div>
              </ui-tippyer>
            </td>
            <td>
              <ui-tippyer :content="item.rarity">
                {{ formatRarity(item.rarity) }}
              </ui-tippyer>
            </td>
            <td>{{ item.rank }}</td>
            <td>{{ item.k }}</td>
            <td>
              <div class="flex items-center">
                <iconfont-icon name="icon-ETH" class="mr-2"></iconfont-icon>
                {{ item.history }}
              </div>
            </td>
            <td>
              <div class="flex items-center">
                <iconfont-icon name="icon-ETH" class="mr-2"></iconfont-icon>
                {{ item.floor == undefined ? "—" : item.floor }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading">
        <div
          class="h-11 flex items-center"
          v-for="(_, i) in Array(8).fill(0)"
          :key="i"
        >
          <Skeletor class="h-8 rounded w-[20%] mr-2"></Skeletor>
          <Skeletor class="h-8 rounded w-[16%] mr-2"></Skeletor>
          <Skeletor class="h-8 rounded w-[20%] mr-2"></Skeletor>
          <Skeletor class="h-8 rounded w-[14%] mr-2"></Skeletor>
          <Skeletor class="h-8 rounded w-[20%] mr-2"></Skeletor>
          <Skeletor class="h-8 rounded w-[20%] mr-2"></Skeletor>
        </div>
      </div>
    </ui-scrollbars>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";
import { formatAddress, copyTx, localeNumber } from "@/utils";
import { useReqPages } from "@/hooks";
import { withThrottling } from "@/with";
import { getTokenRanks } from "@/api";

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
} = useReqPages((i, cancel) => {
  return getTokenRanks(pid.value, store.dashboard.tokenId, i, cancel);
});

useInfiniteScroll(scrollEl, withThrottling(loadNext));

const onIns = (ins) => {
  scrollEl.value = ins.getElements("viewport");
};

const loadData = async () => {
  store.loading.dashboardTraitHistory = true;
  await loadRest(true);
  results.value[0] &&
    store.selectTraits(results.value[0].traitType, results.value[0].value);
};

watch(
  () => store.dashboard.tokenId,
  () => {
    loadData();
  }
);

const formatRarity = (num) => {
  if (num >= 0.000001) {
    return localeNumber(num, 4, false);
  } else {
    return "< 0.0001";
  }
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
