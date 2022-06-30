<template>
  <div class="w-full h-full flex pb-16 pt-12">
    <div
      class="w-44 flex flex-col justify-between border-r-[1px] border-[#9797971a]"
    >
      <side-bar v-model="state.tabIndex" :tabs="tabs"></side-bar>
      <third-link></third-link>
    </div>
    <div class="flex-1 h-full text-xs min-w-0 rounded-lg ml-6 bg-[#9797971a]">
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="state.loading"
      >
        <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
      </div>

      <UiScrollbars
        class="w-full h-full"
        v-if="!state.loading && state.list.length > 0"
      >
        <div class="px-2 pb-2">
          <table class="w-full h-14 sticky top-0 bg-[#1f2123]">
            <colgroup>
              <col style="width: 32%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
            </colgroup>
            <thead>
              <th class="text-left" style="width: 32%">Collection</th>
              <th class="text-left" style="width: 14%">Volume(24H)</th>
              <th class="text-right" style="width: 14%">▲ Volume(24H)</th>
              <th class="text-right" style="width: 20%">Floor Price</th>
              <th class="text-right" style="width: 20%">Market Cap</th>
            </thead>
          </table>
          <table class="w-full">
            <colgroup>
              <col style="width: 32%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
            </colgroup>
            <tbody>
              <tr
                class="hover:bg-[#ffffff0d] h-14 cursor-pointer"
                v-for="(item, i) in state.list"
                :key="i"
                @click="router.push(`/detail/${item.projectName}/${item.id}`)"
              >
                <td class="text-left" style="width: 32%">
                  <div class="flex items-center">
                    <ui-img
                      class="w-8 h-8 rounded-full mr-2 overflow-hidden"
                      :src="item.logo"
                      alt=""
                    />
                    <div class="text-[#26AAFF]">{{ item.projectName }}</div>
                  </div>
                </td>
                <td class="text-left" style="width: 14%">${{ item.volume }}</td>
                <td
                  class="text-right"
                  :class="{
                    'text-[#5EFF6A]': item.volumeRate > 0,
                    'text-[#FF5166]': item.volumeRate < 0,
                  }"
                  style="width: 14%"
                >
                  {{ item.volumeRate }}%
                </td>
                <td style="width: 20%">
                  <div class="flex items-center justify-end">
                    {{ item.floorPrice }}&nbsp;
                    <iconfont-icon name="icon-ETH"></iconfont-icon>
                  </div>
                </td>
                <td class="text-right" style="width: 20%">
                  ${{ item.marketCap }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiScrollbars>
    </div>
  </div>
</template>

<script setup>
import { getVaultList } from "@/api";

const tabs = [
  {
    key: "Collectables",
    value: "COLLECTABLES",
  },
  { key: "Art", value: "ART" },
  { key: "Game Assets", value: "", disabled: true },
];

const router = useRouter();
const state = reactive({
  loading: 0,
  list: [],
  tabIndex: 0,
});

const loadData = async (type) => {
  state.loading++;
  const x = await getVaultList(type, true);
  state.loading--;
  state.list = x;
};

onMounted(async () => {
  console.log(123);
  loadData(tabs[state.tabIndex].value);
});

watch(
  () => state.tabIndex,
  (i) => loadData(tabs[i].value)
);
</script>

<style scoped>
table td,
table th {
  padding: 0 0.5rem;
}
</style>
