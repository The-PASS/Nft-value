<template>
  <Page>
    <div v-if="state.loading" class="h-full flex items-center justify-center">
      <img class="w-16 h-16" src="@/assets/svgs/spin.svg" alt="" />
    </div>
    <div class="text-whitebase mt-16 text-xs" v-else>
      <!-- section 1 -->
      <div class="flex justify-between">
        <div class="flex">
          <ui-img
            class="w-20 h-20 rounded-full overflow-hidden bg-white mr-6 flex-shrink-0"
            :src="state.info.logo"
          />
          <div class="mt-4 w-2/3">
            <p class="font-bold text-xl">{{ state.info.projectName }}</p>
            <p class="text-xs">
              {{ state.info.des }}
            </p>
          </div>
        </div>

        <!-- <div class="font-bold text-gray-level self-end">
          Data powered by NFTVALUE
        </div> -->
      </div>
      <!-- section 2 -->
      <div class="mt-16">
        <div class="text-xl font-bold mb-4">Basic data</div>
        <div class="flex justify-between">
          <div
            class="w-56 h-24 rounded basic-data-box flex flex-col items-center justify-center"
            :class="{
              'basic-data-box__red': +item.gains < 0,
              'basic-data-box__green': +item.gains > 0,
            }"
            v-for="(item, i) in basicData"
            :key="i"
          >
            <div class="text-xl font-bold">{{ item.value }}</div>
            <div class="text-sm m-2 relative flex items-center">
              {{ item.name }}
              <tippy
                v-if="item.tip"
                :content="item.tip"
                :arrow="false"
                placement="bottom"
                ><i class="iconfont icon-tishi cursor-pointer ml-2"></i
              ></tippy>
              <div
                class="font-bold absolute -right-2 top-0 transform translate-x-full"
                :class="{
                  'text-green': +item.gains > 0,
                  'text-red': +item.gains < 0,
                }"
                v-if="item.gains"
              >
                {{ item.gains }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- section 3 -->
      <div class="flex mt-8">
        <div class="mr-8">
          <div class="text-xl font-bold mb-4">ITEMS</div>
          <div class="w-[760px] h-[364px]">
            <ui-scrollbars
              class="w-full h-full"
              v-if="state.info.tokenList.length > 0"
            >
              <div class="grid grid-cols-4 gap-4">
                <div
                  v-for="(item, i) in state.info.tokenList"
                  :key="i"
                  class="w-44 h-44 rounded overflow-hidden bg-white relative group cursor-pointer"
                >
                  <ui-img class="w-full h-full" :src="item.logo"></ui-img>
                  <div
                    class="absolute p-2 space-y-1 w-full bottom-0 token-list__float hidden group-hover:block"
                  >
                    <div>Estimated Price</div>
                    <div class="flex justify-between">
                      <div>history:</div>
                      <div>{{ item.history }} ETH</div>
                    </div>
                    <div class="flex justify-between">
                      <div>floor:</div>
                      <div>{{ item.floor }} ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </ui-scrollbars>
            <div v-else class="w-full h-full relative">
              <img
                class="w-full h-full"
                src="@/assets/images/no-tokenlist.png"
                alt=""
              />
              <div class="absolute right-28 bottom-36 space-y-2">
                <p class="text-sm">NFT asset fetch fails or no asset exists.</p>
                <p class="text-[#ffffff4d]">· Please refresh your</p>
                <p class="text-[#ffffff4d]">· connection Check your network</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="text-xl font-bold mb-4">Whales</div>
          <div
            class="flex-1 min-h-0 flex flex-col px-8 py-4 bg-[#1e1f21] rounded-lg"
          >
            <div class="px-2 flex justify-between text-[#5E6873] mb-4">
              <div>Address</div>
              <div>Number owned</div>
            </div>
            <div class="flex-1 min-h-0 text-base" style="height: 368px">
              <ui-scrollbars class="w-full h-full">
                <div
                  class="flex h-9 items-center justify-between px-2"
                  v-for="(item, i) in state.info.holders"
                  :key="i"
                >
                  <div
                    class="text-[#26AAFF] hover: underline cursor-pointer"
                    @click="copyTx(item.address)"
                  >
                    {{ formatAddress(item.address) }}
                  </div>
                  <div class="w-20">{{ item.numberOwned }}</div>
                </div>
              </ui-scrollbars>
            </div>
          </div>
        </div>
      </div>

      <!-- section 4 -->
      <div class="mt-8">
        <div class="text-xl font-bold mb-4">Core traits Rank</div>
        <div class="flex">
          <div class="flex-1 mr-6" style="height: 364px">
            <ui-scrollbars class="w-full h-full">
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
                    class="h-11"
                    v-for="(item, i) in state.info.ranks"
                    :key="i"
                  >
                    <td class="text-left w-[20%]">
                      {{ item.traitType }}
                    </td>
                    <td class="text-left w-[16%]">
                      <div class="line-clamp-1">
                        {{ item.value }}
                      </div>
                    </td>
                    <td class="w-[w-[20%]]x">{{ item.rarity }}</td>
                    <td class="w-[14%]">{{ item.rank }}</td>
                    <td class="w-[20%]">
                      <div class="flex items-center">
                        <iconfont-icon
                          name="icon-ETH"
                          class="mr-2"
                        ></iconfont-icon>
                        {{ item.history }}
                      </div>
                    </td>
                    <td class="w-[20%]">
                      <div class="flex items-center">
                        <iconfont-icon
                          name="icon-ETH"
                          class="mr-2"
                        ></iconfont-icon>
                        {{ item.floor }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </ui-scrollbars>
          </div>
          <div class="flex-1" style="background: #1e1f21; height: 364px"></div>
        </div>
      </div>

      <!-- section 5 -->
      <div
        class="mt-8 rounded w-full p-6"
        style="background: #1e1f21; height: 720px"
      >
        <div>
          <div class="flex justify-between">
            <div class="text-xl font-bold mb-4">Item trade history</div>
            <div>年月日</div>
          </div>
          图表
        </div>
        <div>
          <div class="text-xl font-bold mb-4">Volume</div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup>
import { getProjectDetails } from "@/api";
import { formatAddress, copyTx } from "@/utils";

const route = useRoute();

const state = reactive({
  loading: true,
  info: {},
});

const basicData = computed(() => [
  { value: "19,328", name: "Items" },
  {
    value: "259",
    name: "Evaluation",
    tip: "Based on estimated price by history.",
  },
  { value: state.info.holderNumber, name: "Owners" /* gains: "+14.31" */ },
  {
    value: `${state.info.floorPrice} ETH`,
    name: "Floor Price",
    // gains: "-14.31",
  },
  {
    value: `${state.info.volume} ETH`,
    name: "Volume",
    gains: (state.info.volumeRate * 100).toFixed(2),
  },
]);

onMounted(async () => {
  state.loading = true;
  state.info = await getProjectDetails(route.params.id);
  state.loading = false;
});
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
.text-green {
  color: rgba(94, 255, 106, 1);
}
.text-red {
  color: rgba(255, 81, 102, 1);
}

.token-list__float {
  background: linear-gradient(180deg, rgba(18, 20, 22, 0) 0%, #121416 100%);
  opacity: 0.8;
}
</style>
