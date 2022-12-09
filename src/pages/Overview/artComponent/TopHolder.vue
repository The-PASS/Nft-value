<template>
  <div
    class="md:ml-6 px-6 py-4 bg-white-005 flex-shrink-0 rounded flex flex-col w-full"
    style="max-width: 384px; height: 448px"
  >
    <div class="font-bold text-xl mb-4">Top Artists favored by DAOs</div>

    <div class="w-full space-x-2 flex pb-4">
      <div
        class="topa-btn px-2 text-xs font-bold"
        :class="{
          'topa-btn__active': state.sortIndex == i,
        }"
        v-for="(text, i) in ['By Value', 'By Quantity', 'By DAOs']"
        :key="i"
        @click="state.sortIndex = i"
      >
        {{ text }}
      </div>
    </div>

    <div class="flex-1 min-h-0">
      <Skeletor class="w-full h-full rounded" v-if="props.loading"></Skeletor>
      <div
        class="space-y-2 h-full overflow-y-scroll"
        v-else
        :key="state.sortIndex"
      >
        <div
          class="flex items-center h-14 cursor-pointer"
          v-for="(item, i) in dataList"
          :key="i"
          @click="jump(item.artistName)"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center font-bold italic mr-4"
            :style="`background:${getColor(i)}`"
          >
            {{ i + 1 }}
          </div>
          <div class="flex">
            <UiImg
              class="w-10 h-10 rounded-full overflow-hidden mr-2"
              :src="multiavatar(item.address)"
            ></UiImg>
            <div>
              <div class="font-bold">{{ item.artistFullName }}</div>
              <div class="text-xs">
                <span class="text-white-070">{{ keyName }}: </span
                ><span>{{ getValue(item) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { localeNumber } from "@/utils";
import { Skeletor } from "vue-skeletor";
import multiavatar from "@multiavatar/multiavatar";

const getColor = (i) => {
  if (i == 0) {
    return "#F23089FF";
  }
  if (i == 1) {
    return "#4997F2FF";
  }
  if (i == 2) {
    return "#CE49F2FF";
  }
  return "#2A2E33FF";
};

const state = reactive({
  sortIndex: 0,
});

const getValue = (item) => {
  const values = ["artistTotalUsd", "artWorkCount", "daoInfo"];

  if (state.sortIndex == 0) {
    return `$${localeNumber(item.artistTotalUsd, 2)}`;
  }
  if (state.sortIndex == 1) {
    return item.artWorkCount;
  }

  return item.daoInfo.length;
};

const keyName = computed(
  () =>
    ["Collected Value", "Collected Quantity", "Collected DAOs"][state.sortIndex]
);

const dataList = computed(() => {
  const list = JSON.parse(JSON.stringify(props.data));

  // list.sort((a, b) => +b.artistTotalUsd - +a.artistTotalUsd);

  if (state.sortIndex == 1) {
    list.sort((a, b) => +b.artWorkCount - +a.artWorkCount);
  } else if (state.sortIndex == 2) {
    list.sort((a, b) => b.daoInfo.length - a.daoInfo.length);
  }
  return list.slice(0, 20);
});

const jump = (name) => {
  if (name) {
    window.open(`${process.env.VUE_APP_VAULT_PATH}#/Art/${name}`, "_blank");
  }
};

const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.topa-btn {
  height: 32px;
  border-radius: 4px;
  border: 1px solid #2a2e33;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}
.topa-btn__active {
  background: #ff5166ff;
  border: 1px solid #ff5166ff;
}
</style>
