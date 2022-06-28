<template>
  <div class="mr-8">
    <div class="text-xl font-bold mb-4">ITEMS</div>
    <div class="w-[760px] h-[364px]">
      <ui-scrollbars
        class="w-full h-full"
        v-if="store.dashboard.tokenList.length > 0"
      >
        <div class="grid grid-cols-4 gap-4 pb-4">
          <div
            v-for="(item, i) in store.dashboard.tokenList"
            :key="i"
            class="w-44 p-2 bg-[#FFFFFF0D] rounded overflow-hidden relative cursor-pointer transition-all border-[1px] border-transparent hover:border-white"
          >
            <div
              class="absolute left-2 top-2 p-2 space-y-1 w-40 token-list__idfloat"
            >
              ID:{{ item.tokenId }}
            </div>

            <ui-img
              class="w-40 h-40 rounded bg-white"
              :src="item.logo"
            ></ui-img>
            <div class="mt-4 space-y-1 w-full">
              <div>Estimated Price</div>
              <div class="flex justify-between">
                <div class="text-[#5E6873FF]">history:</div>
                <div>{{ item.history }} ETH</div>
              </div>
              <div class="flex justify-between">
                <div class="text-[#5E6873FF]">floor:</div>
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
</template>

<script setup>
const store = useStore();

const pid = inject("pid");

onMounted(() => {
  store.loadBoardTokenList(pid);
});
</script>

<style scoped>
.token-list__float {
  background: linear-gradient(180deg, rgba(18, 20, 22, 0) 0%, #121416 100%);
  opacity: 0.8;
}
.token-list__idfloat {
  background: linear-gradient(180deg, #121416 0%, rgba(18, 20, 22, 0) 100%);
  opacity: 0.6;
}
</style>
