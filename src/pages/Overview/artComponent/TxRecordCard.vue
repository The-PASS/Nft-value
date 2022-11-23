<template>
  <div
    class="h-12 hover:bg-[#FFFFFF0D] flex font-bold text-xs cursor-pointer"
    :class="{
      'bg-[#FFFFFF0D]': isSelected,
    }"
    style="border-bottom: 1px solid rgba(255, 255, 255, 0.1)"
    @click="store.selectTx(info)"
  >
    <div class="flex-1 flex justify-start items-center">
      <div class="w-12 flex items-center justify-center">
        <IconfontIcon
          class="text-xl cursor-pointer"
          :name="isSelected ? 'icon-jian2-63' : 'icon-chuangjian'"
        ></IconfontIcon>
      </div>

      <span v-if="!isSelected"> ALL </span>

      <div v-else @click.stop="() => {}">
        <UiDropdown
          class="w-28"
          v-model="state.dropdownValue"
          :options="dropDownOption"
        ></UiDropdown>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center">
      {{ info.valuation }}
    </div>
    <div class="flex-1 flex items-center justify-end">
      <span class="pr-12">
        {{ formatDate(info.cutPoint, "YYYY-MM-DD HH:mm") }}
      </span>
    </div>
  </div>
  <div
    class="overflow-y-scroll max-h-[240px] w-full"
    ref="scrollEl"
    v-if="isSelected"
  >
    <div v-if="results.length > 0" class="px-10">
      <div class="flex h-12 text-[#5E6873FF]">
        <div class="cell-left" style="width: 23.3%">Name</div>
        <div class="cell-left" style="width: 20.6%">Token address</div>
        <div class="cell-left" style="width: 19%">Token id</div>
        <div class="cell-right" style="width: 14.9%">Platform</div>
        <div class="cell-right" style="width: 20.7%">Last price</div>
        <div class="cell-right" style="width: 16.5%">Transaction time</div>
      </div>

      <div class="flex h-12 art-cell" v-for="(item, i) in results" :key="i">
        <div class="cell-left" style="width: 23.3%">{{ item.tokenName }}</div>
        <div
          class="cell-left link-pointer"
          style="width: 20.6%"
          @click.stop="jumpAddress(item.tokenAddress)"
        >
          {{ formatAddress(item.tokenAddress, 4) }}
        </div>
        <div class="cell-left" style="width: 19%">{{ item.tokenId }}</div>
        <div class="cell-right" style="width: 14.9%">{{ item.plat }}</div>
        <div class="cell-right" style="width: 20.7%">
          {{ item.lastPrice }} ETH
        </div>
        <div class="cell-right" style="width: 16.5%">
          {{ formatDate(item.transactionTime, "YYYY-MM-DD HH:mm") }}
        </div>
      </div>
    </div>
    <div v-if="loading" class="w-full h-12 flex items-center justify-center">
      <img class="w-4 h-4" src="@/assets/svgs/spin.svg" alt="" />
    </div>
  </div>
</template>

<script setup>
import { getArtTxRecordDetails } from "@/api";
import { useReqPages } from "@/hooks";
import { useArtStore } from "@/store/art";
import { formatDate, formatAddress, toExploreAddress } from "@/utils";
import { withThrottling } from "@/with";

const $route = useRoute();
const store = useArtStore();
const scrollEl = ref(null);

const state = reactive({
  dropdownValue: {
    label: "All",
    value: "",
  },
});

const props = defineProps({
  info: Object,
});

const pState = inject("pState");

const isSelected = computed(() => {
  return store.selectedTx.valueType == props.info.valueType;
});

const dropDownOption = computed(() => {
  const res = props.info.platform.map((x) => ({
    label: x,
    value: x,
  }));

  res.unshift({
    label: "All",
    value: "",
  });

  return res;
});

const jumpAddress = (address, network) => {
  window.open(toExploreAddress(address, network), "_blank");
};

const { loadRest, loading, loadNext, results } = useReqPages((page, cancel) => {
  return getArtTxRecordDetails(
    page,
    $route.params.name,
    pState.selected,
    store.selectedTx.valueType,
    state.dropdownValue.value,
    cancel
  );
});

watch(
  () => [isSelected.value, state.dropdownValue.value],
  (val) => {
    const [flag] = val;
    if (flag) {
      loadRest(true);
    }
  }
);

useInfiniteScroll(scrollEl, withThrottling(loadNext), {
  distance: 44,
});

onMounted(() => {
  if (isSelected.value) {
    loadRest(true);
  }
});
</script>

<style scoped>
.cell-left,
.cell-right {
  display: flex;
  align-items: center;
}
.cell-left {
  padding-left: 16px;
}
.cell-right {
  justify-content: end;
  padding-right: 16px;
}
.link-pointer {
  cursor: pointer;
  color: #26aaffff;
}
.link-pointer:hover {
  text-decoration: underline;
}

.art-cell:nth-child(2n) {
  background: #ffffff08;
}
</style>