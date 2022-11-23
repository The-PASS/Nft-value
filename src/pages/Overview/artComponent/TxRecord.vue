<template>
  <div>
    <div class="flex space-x-4 mb-4">
      <div
        class="txrecord-btn flex justify-center items-center"
        :class="{
          'txrecord-btn-active': state.selected == i,
        }"
        v-for="(text, i) in evaType"
        :key="i"
        @click="state.selected = i"
      >
        {{ text }}
      </div>
    </div>

    <div>
      <div class="w-full h-12 bg-[#2A2E33] text-[#FFFFFFB3] flex">
        <div class="flex-1 flex justify-start items-center pl-12">Platform</div>
        <div class="flex-1 flex items-center justify-center">Valuation</div>
        <div class="flex-1 flex items-center justify-end pr-12">Cut time</div>
      </div>

      <div v-if="loading">
        <div class="h-12 flex items-center justify-center font-bold">
          <div class="h-full flex items-center justify-center">
            <img class="w-4 h-4" src="@/assets/svgs/spin.svg" alt="" />
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="state.list.length > 0">
          <TxRecordCard
            :info="item"
            v-for="(item, i) in state.list"
            :key="i"
          ></TxRecordCard>
        </div>

        <div v-else class="h-12 pl-12 flex items-center font-bold">
          No Items Found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReqByBool } from "@/hooks";
import { getArtTxRecord } from "@/api";
import { useArtStore } from "@/store/art";
import TxRecordCard from "./TxRecordCard.vue";

const $route = useRoute();

const evaType = ["Single", "Edition"];

const store = useArtStore();

const state = reactive({
  selected: 0,
  list: [],
});

provide("pState", state);

const { loadData, loading } = useReqByBool(async () => {
  state.list = await getArtTxRecord($route.params.name, state.selected, true);
});

watch(
  () => state.selected,
  () => {
    loadData();
  }
);

watch(
  () => store.selectedArtwork,
  (val) => {
    console.log(val.valueType);
  }
);

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.txrecord-btn {
  width: 80px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}
.txrecord-btn-active {
  width: 80px;
  height: 32px;
  color: #121416;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: #fff;
}
</style>
