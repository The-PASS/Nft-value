<template>
  <div class="w-full h-full flex flex-row pb-16 pt-12" v-if="isDesktop">
    <div
      class="w-44 flex flex-col justify-between border-r-[1px] border-[#9797971a]"
    >
      <side-bar v-model="state.tabIndex" :tabs="tabs"></side-bar>
      <third-link v-if="isDesktop"></third-link>
    </div>
    <div class="w-full h-full flex flex-col md:flex-row pt-4">
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
        <div v-else class="w-full h-full overflow-y-scroll">
          <div v-if="!state.loading && state.list.length > 0">
            <div
              class="relative"
              v-for="(item, i) in state.list"
              :key="i"
              @click="router.push(`/detail/${item.path}`)"
            >
              <div class="flex p-4">
                <div class="flex flex-col justify-center mr-2">
                  <ui-img
                    class="w-14 h-14 rounded-full mr-2 overflow-hidden flex-shrink-0 bg-[#FFFFFF1A]"
                    :src="item.logo"
                    alt=""
                  />
                  <div
                    class="text-center mt-2 font-bold text-base text-[#5e6873]"
                  >
                    {{ i + 1 }}
                  </div>
                </div>
                <div class="space-y-1 flex-1">
                  <div class="text-[#26AAFF] font-bold text-lg">
                    {{ item.projectName }}
                  </div>
                  <div class="flex justify-between">
                    <div>Volume:</div>
                    <div class="flex items-center">
                      {{
                        numeral(item.totalVolume).format("0.0a").toUpperCase()
                      }}
                      <iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </div>
                  <div class="flex justify-between">
                    <div>Volume（24H）:</div>
                    <div class="flex items-center">
                      {{ item.volume }}
                      <iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </div>

                  <div class="flex justify-between">
                    <div>VolumeRate（24H）:</div>
                    <div
                      :class="{
                        'text-[#5EFF6A]': item.volumeRate > 0,
                        'text-[#FF5166]': item.volumeRate < 0,
                      }"
                    >
                      {{ suffixNum(localeNumber(item.volumeRate, 2)) }}%
                    </div>
                  </div>

                  <div class="flex justify-between">
                    <div>Floor Price:</div>
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
                  </div>

                  <div class="flex justify-between">
                    <div>Market Cap:</div>
                    <div class="flex items-center justify-end">
                      {{ localeNumber(item.marketCap, 2)
                      }}<iconfont-icon
                        name="icon-ETH"
                        class="ml-1"
                      ></iconfont-icon>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="bg-[#FFFFFF1A] w-[88%] h-[1px] absolute bottom-0 left-1/2 transform -translate-x-1/2"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full flex flex-col pt-4">
    <MbSideBar v-model="state.tabIndex" :tabs="tabs"></MbSideBar>
    <div class="flex-1 h-full text-xs min-h-0 mb-4 rounded-lg bg-[#9797971a]">
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="state.loading"
      >
        <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
      </div>

      <!-- Mb -->
      <div v-else class="w-full h-full overflow-y-scroll flex-1 min-h-0">
        <div v-if="!state.loading && state.list.length > 0">
          <div
            class="relative"
            v-for="(item, i) in state.list"
            :key="i"
            @click="router.push(`/detail/${item.path}`)"
          >
            <div class="flex p-4">
              <div class="flex flex-col justify-center mr-2">
                <ui-img
                  class="w-14 h-14 rounded-full mr-2 overflow-hidden flex-shrink-0 bg-[#FFFFFF1A]"
                  :src="item.logo"
                  alt=""
                />
                <div
                  class="text-center mt-2 font-bold text-base text-[#5e6873]"
                >
                  {{ i + 1 }}
                </div>
              </div>
              <div class="space-y-1 flex-1">
                <div class="text-[#26AAFF] font-bold text-lg">
                  {{ item.projectName }}
                </div>
                <div class="flex justify-between">
                  <div>Volume:</div>
                  <div class="flex items-center">
                    {{ numeral(item.totalVolume).format("0.0a").toUpperCase() }}
                    <iconfont-icon name="icon-ETH" class="ml-1"></iconfont-icon>
                  </div>
                </div>
                <div class="flex justify-between">
                  <div>Volume（24H）:</div>
                  <div class="flex items-center">
                    {{ item.volume }}
                    <iconfont-icon name="icon-ETH" class="ml-1"></iconfont-icon>
                  </div>
                </div>

                <div class="flex justify-between">
                  <div>VolumeRate（24H）:</div>
                  <div
                    :class="{
                      'text-[#5EFF6A]': item.volumeRate > 0,
                      'text-[#FF5166]': item.volumeRate < 0,
                    }"
                  >
                    {{ suffixNum(localeNumber(item.volumeRate, 2)) }}%
                  </div>
                </div>

                <div class="flex justify-between">
                  <div>Floor Price:</div>
                  <div class="flex items-center justify-end">
                    {{
                      +item.floorPrice == 0
                        ? "--"
                        : localeNumber(item.floorPrice, 2)
                    }}&nbsp;
                    <iconfont-icon name="icon-ETH" class="ml-1"></iconfont-icon>
                  </div>
                </div>

                <div class="flex justify-between">
                  <div>Market Cap:</div>
                  <div class="flex items-center justify-end">
                    {{ localeNumber(item.marketCap, 2)
                    }}<iconfont-icon
                      name="icon-ETH"
                      class="ml-1"
                    ></iconfont-icon>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-[#FFFFFF1A] w-[88%] h-[1px] absolute bottom-0 left-1/2 transform -translate-x-1/2"
            ></div>
          </div>
        </div>
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
    link: "/list",
  },
  { key: "Art", value: "ART", link: "/list/Art" },
  { key: "Game Assets", value: "", disabled: true },
];

const isDesktop = useDesktop();

const $route = useRoute();
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
  () => $route.query.type,
  (val) => loadData(val)
);
</script>

<style scoped>
table td,
table th {
  padding: 0 0.5rem;
}
</style>
