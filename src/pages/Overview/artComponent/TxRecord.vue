<template>
  <div class="mt-8">
    <div v-if="loading">
      <div class="h-96 flex items-center justify-center font-bold">
        <Skeletor class="w-full h-full rounded"></Skeletor>
      </div>
    </div>

    <div v-else>
      <div class="flex space-x-4 mb-4">
        <div
          class="txrecord-btn flex justify-center items-center"
          :class="{
            'txrecord-btn-active': store.selectedEvaType == i,
          }"
          v-for="(text, i) in store.evaTypes"
          :key="i"
          @click="store.selectedEvaType = i"
        >
          {{ text }}
        </div>
      </div>

      <div>
        <div
          v-if="store.evaTypes[store.selectedEvaType] == 'Single'"
          class="w-full h-12 bg-[#2A2E33] text-[#FFFFFFB3] flex"
        >
          <div class="flex-1 flex justify-start items-center">
            <span class="pl-12"> Platform </span>
          </div>
          <div class="flex-1 flex justify-start items-center">
            <span class="pl-12"> Tag </span>
          </div>
          <div class="flex-1 flex items-center">
            <span class="pl-12"> Valuation </span>
          </div>
          <div class="flex-1 flex items-center justify-end">
            <span class="pr-12"> Cut time </span>
          </div>
        </div>

        <div v-else class="w-full h-12 bg-[#2A2E33] text-[#FFFFFFB3] flex">
          <div class="flex-1 flex justify-start items-center">
            <span class="pl-12">Collection</span>
          </div>
          <div class="flex-1 flex items-center">
            <div class="pl-12">Edition</div>
          </div>
          <div class="flex-1 flex items-center">
            <div class="pl-12">Valuation</div>
          </div>
          <div class="flex-1 flex items-center justify-end">
            <div class="pr-12">Cut time</div>
          </div>
        </div>

        <div class="max-h-72 overflow-y-scroll">
          <TxRecordCard
            :type="store.evaTypes[store.selectedEvaType]"
            :info="item"
            v-for="(item, i) in store.evaList"
            :key="i"
          ></TxRecordCard>
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
import { Skeletor } from "vue-skeletor";

const $route = useRoute();

const store = useArtStore();

const { loadData, loading } = useReqByBool(async () => {
  await store.loadEvaList($route.params.name);
});

watch(
  () => store.evaTypes,
  () => {
    store.selectedEvaType = 0;
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
