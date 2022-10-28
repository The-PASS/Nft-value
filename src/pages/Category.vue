<template>
  <div class="w-full h-full flex flex-col md:flex-row md:pb-16 pt-12">
    <div
      v-if="isDesktop"
      class="w-44 flex flex-col justify-between border-r-[1px] border-[#9797971a]"
    >
      <side-bar v-model="state.tabIndex" :tabs="tabs"></side-bar>
      <third-link v-if="isDesktop"></third-link>
    </div>
    <div
      class="flex-1 h-full text-xs min-h-0 md:min-w-0 rounded-lg md:ml-6 bg-[#9797971a]"
    >
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="state.loading"
      >
        <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
      </div>

      <!-- PC -->
      <div class="w-full h-full" v-if="isDesktop">
        <UiScrollbars
          class="w-full h-full"
          v-if="!state.loading && state.list.length > 0"
        >
          <div class="px-2 pb-2">
            <table class="w-full h-14 sticky top-0 bg-[#1f2123]">
              <colgroup>
                <col style="width: 32%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 20%" />
              </colgroup>
              <thead>
                <th class="text-left" style="width: 32%">Collection</th>
                <th class="text-left" style="width: 11%">Volume</th>
                <th class="text-left" style="width: 11%">Volume(24H)</th>
                <th class="text-right" style="width: 11%">▲ Volume(24H)</th>
                <th class="text-right" style="width: 11%">Floor Price</th>
                <th class="text-right" style="width: 20%">Market Cap</th>
              </thead>
            </table>
            <table class="w-full">
              <colgroup>
                <col style="width: 32%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 11%" />
                <col style="width: 20%" />
              </colgroup>
              <tbody>
                <tr
                  class="hover:bg-[#ffffff0d] h-14 cursor-pointer"
                  v-for="(item, i) in state.list"
                  :key="i"
                  @click="router.push(`/detail/${item.path}`)"
                >
                  <td class="text-left" style="width: 32%">
                    <div class="flex items-center">
                      <ui-img
                        class="w-8 h-8 rounded-full mr-2 overflow-hidden flex-shrink-0"
                        :src="item.logo"
                        alt=""
                      />
                      <div class="text-[#26AAFF]">{{ item.projectName }}</div>
                    </div>
                  </td>

                  <td class="text-left" style="width: 11%">
                    <div class="flex items-center">
                      {{
                        numeral(item.totalVolume).format("0.0a").toUpperCase()
                      }}
                      <iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </td>

                  <td class="text-left" style="width: 11%">
                    <div class="flex items-center">
                      {{ item.volume }}
                      <iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'text-[#5EFF6A]': item.volumeRate > 0,
                      'text-[#FF5166]': item.volumeRate < 0,
                    }"
                    style="width: 11%"
                  >
                    {{ suffixNum(localeNumber(item.volumeRate, 2)) }}%
                  </td>
                  <td style="width: 11%">
                    <div class="flex items-center justify-end">
                      {{
                        +item.floorPrice == 0
                          ? "--"
                          : localeNumber(item.floorPrice, 2)
                      }}&nbsp;
                      <iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </td>
                  <td style="width: 20%">
                    <div class="flex items-center justify-end">
                      {{ localeNumber(item.marketCap, 2)
                      }}<iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiScrollbars>
      </div>

      <!-- Mb -->
      <div v-else>
        <div v-if="!state.loading && state.list.length > 0">Coming soon~</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getVaultList } from "@/api";
import { suffixNum, localeNumber } from "@/utils";
import { useDesktop } from "@/hooks";
import numeral from "numeral";

const tabs = [
  {
    key: "Collectables",
    value: "COLLECTABLES",
  },
  { key: "Art", value: "ART", disabled: true },
  { key: "Game Assets", value: "", disabled: true },
];

const isDesktop = useDesktop();

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
