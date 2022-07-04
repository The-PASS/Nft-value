<template>
  <div class="flex-1 mr-6" style="height: 364px">
    <ui-scrollbars class="w-full h-full" :onIns="onIns">
      <table class="w-full text-[#5E6873] sticky top-0 bg-wall">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 16%" />
          <col style="width: 10%" />
          <col style="width: 14%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead class="text-left">
          <th style="width: 20%">Type</th>
          <th style="width: 16%">Value</th>
          <th style="width: 10%">Rarity</th>
          <th style="width: 14%">
            <div class="flex items-center">
              Rank
              <tippy content="Based on history trade weights.">
                <iconfont-icon
                  name="icon-tishi"
                  class="text-white ml-2"
                ></iconfont-icon
              ></tippy>
            </div>
          </th>
          <th style="width: 20%">Price by history</th>
          <th class="w-[20%]">Price by floor</th>
        </thead>
      </table>
      <table class="w-full">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 16%" />
          <col style="width: 10%" />
          <col style="width: 14%" />
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
            <td class="text-left w-[20%]">
              {{ item.traitType }}
            </td>
            <td class="text-left w-[16%]">
              <ui-tippyer :content="item.value">
                <div class="line-clamp-1">
                  {{ item.value == undefined ? "--" : item.value }}
                </div>
              </ui-tippyer>
            </td>
            <td class="w-[w-[20%]]x">{{ item.rarity }}</td>
            <td class="w-[14%]">{{ item.rank }}</td>
            <td class="w-[20%]">
              <div class="flex items-center">
                <iconfont-icon name="icon-ETH" class="mr-2"></iconfont-icon>
                {{ item.history }}
              </div>
            </td>
            <td class="w-[20%]">
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
import { formatAddress, copyTx } from "@/utils";
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
} = useReqPages((i) => {
  return getTokenRanks(pid, store.dashboard.tokenId, i);
});

useInfiniteScroll(scrollEl, withThrottling(loadNext));

const onIns = (ins) => {
  scrollEl.value = ins.getElements("viewport");
};

const loadData = async () => {
  store.loading.dashboardTraitHistory = true;
  await loadRest();
  results.value[0] &&
    store.selectTraits(results.value[0].traitType, results.value[0].value);
};

watch(() => store.dashboard.tokenId, loadData);

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
