<template>
  <div class="w-full h-full pt-12 flex flex-col md:flex-row">
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
              <col style="width: 32%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 12%" />
            </colgroup>
            <thead>
              <th class="text-left">Collection</th>
              <th class="text-left">Volume</th>
              <th class="text-left">Volume(24H)</th>
              <th class="text-left">▲ Volume(24H)</th>
              <th class="text-left">Floor Price</th>
              <th class="text-left">Market Cap</th>
            </thead>
          </table>
          <table class="w-full">
            <colgroup>
              <col style="width: 32%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 14%" />
              <col style="width: 12%" />
            </colgroup>
            <tbody>
              <tr
                class="hover:bg-[#ffffff0d] h-14 cursor-pointer"
                v-for="(item, i) in results"
                :key="i"
                @click="router.push(`/Collectables/${item.path}`)"
              >
                <td class="text-left">
                  <router-link :to="`/Collectables/${item.path}`">
                    <div class="flex items-center">
                      <ui-img
                        class="w-8 h-8 rounded-full mr-2 overflow-hidden flex-shrink-0"
                        :src="item.logo"
                        alt=""
                      />
                      <div class="text-[#26AAFF]">{{ item.projectName }}</div>
                    </div>
                  </router-link>
                </td>

                <td class="text-left">
                  <div class="flex items-center">
                    <EthText>
                      {{
                        numeral(item.totalVolume).format("0.0a").toUpperCase()
                      }}
                    </EthText>
                  </div>
                </td>

                <td class="text-left">
                  <div class="flex items-center">
                    <EthText>
                      {{ item.volume }}
                    </EthText>
                  </div>
                </td>
                <td
                  :class="{
                    'text-[#5EFF6A]': item.volumeRate > 0,
                    'text-[#FF5166]': item.volumeRate < 0,
                  }"
                >
                  {{ suffixNum(item.volumeRate) }}%
                </td>
                <td>
                  <div class="flex items-center">
                    <EthText v-if="!+item.floorPrice == 0">
                      {{ localeNumber(item.floorPrice, 2) }}
                    </EthText>

                    <span v-else>—</span>
                  </div>
                </td>
                <td>
                  <div class="flex items-center">
                    <EthText>
                      {{ formatVal(item.marketCap) }}
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

    <div v-if="!isDesktop" class="w-full h-full overflow-y-scroll">
      <div v-if="!state.loading && state.list.length > 0">
        <div
          class="relative"
          v-for="(item, i) in state.list"
          :key="i"
          @click="router.push(`/Collectables/${item.path}`)"
        >
          <div class="flex p-4">
            <div class="flex flex-col justify-center mr-2">
              <ui-img
                class="w-14 h-14 rounded-full mr-2 overflow-hidden flex-shrink-0 bg-[#FFFFFF1A]"
                :src="item.logo"
                alt=""
              />
              <div class="text-center mt-2 font-bold text-base text-[#5e6873]">
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
                  <iconfont-icon
                    name="icon-ETH2-24"
                    class="ml-1"
                  ></iconfont-icon>
                </div>
              </div>
              <div class="flex justify-between">
                <div>Volume（24H）:</div>
                <div class="flex items-center">
                  {{ item.volume }}
                  <iconfont-icon
                    name="icon-ETH2-24"
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
                    name="icon-ETH2-24"
                    class="ml-1"
                  ></iconfont-icon>
                </div>
              </div>

              <div class="flex justify-between">
                <div>Market Cap:</div>
                <div class="flex items-center justify-end">
                  {{ localeNumber(item.marketCap, 2)
                  }}<iconfont-icon
                    name="icon-ETH2-24"
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
</template>

<script setup>
import { getVaultList } from "@/api";
import { useDesktop, useReqPages } from "@/hooks";
import { suffixNum, localeNumber, formatVal } from "@/utils";
import { withThrottling } from "@/with";
import numeral from "numeral";

const scroller = ref(null);
const router = useRouter();

const isDesktop = useDesktop();

const { loading, results, loadNext, loadRest } = useReqPages((page, cancel) =>
  getVaultList(page, "COLLECTABLES", cancel)
);

useInfiniteScroll(scroller, withThrottling(loadNext), {
  distance: 44,
});

onMounted(async () => {
  loadRest();
});
</script>

<style lang="scss" scoped></style>
