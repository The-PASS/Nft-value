<template>
  <div class="flex-1 flex flex-col">
    <div class="text-xl font-bold mb-4">Whales</div>
    <div
      class="flex-1 min-h-0 flex flex-col px-8 pt-6 pb-4 bg-[#1e1f21] rounded-lg"
    >
      <div class="px-2 flex justify-between text-[#5E6873] mb-4">
        <div>Address</div>
        <div>Number owned</div>
      </div>
      <div class="flex-1 min-h-0 text-base" style="height: 368px">
        <ui-scrollbars class="w-full h-full">
          <div
            class="flex h-9 items-center justify-between px-2"
            v-for="(item, i) in store.dashboard.ownerList"
            :key="i"
          >
            <div
              class="text-[#26AAFF] hover: underline cursor-pointer line-clamp-1 w-40 break-words"
              @click="copyTx(item.address)"
            >
              {{ item.address }}
            </div>
            <div class="w-20">{{ item.numberOwned }}</div>
          </div>
        </ui-scrollbars>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatAddress, copyTx } from "@/utils";
const store = useStore();

const pid = inject("pid");

onMounted(() => {
  store.loadBoardOwnerList(pid);
});
</script>

<style lang="scss" scoped></style>
