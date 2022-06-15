<template>
  <Page>
    <div class="text-whitebase mt-16">
      <!-- section 1 -->
      <div class="flex justify-between">
        <div class="flex">
          <div
            class="w-20 h-20 rounded-full overflow-hidden bg-red-400 mr-6"
          ></div>
          <div class="mt-4">
            <p class="font-bold text-xl">CLONE X - X TAKASHI MURAKAMI</p>
            <p class="text-xs">🧬 CLONE X 🧬</p>
            <p class="text-xs">
              20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸
            </p>
          </div>
        </div>

        <div class="font-bold text-gray-level self-end">
          Data powered by NFTVALUE
        </div>
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
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(_, i) in Array(8).fill(0)"
              :key="i"
              class="w-44 h-44 rounded overflow-hidden bg-red-300"
            ></div>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-xl font-bold mb-4">Whales</div>
          <div style="background: #1e1f21; height: 368px"></div>
        </div>
      </div>

      <!-- section 4 -->
      <div class="mt-8">
        <div class="text-xl font-bold mb-4">Core traits Rank</div>
        <div class="flex">
          <div
            class="flex-1 mr-6"
            style="background: #1e1f21; height: 364px"
          ></div>
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
const basicData = [
  { value: "19,328", name: "Items" },
  {
    value: "259",
    name: "Evaluation",
    tip: "Based on estimated price by history.",
  },
  { value: "5351", name: "Owners", gains: "+14.31" },
  { value: "64.33 ETH", name: "Floor Price", gains: "-14.31" },
  { value: "30.1K ETH", name: "Volume", gains: "-14.31" },
];
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
</style>
