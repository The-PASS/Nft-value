<template>
  <div class="w-full">
    <div class="flex justify-between">
      <div class="text-xl font-bold mb-4">ITEM TRADE HISTORY</div>
      <div>
        <ui-tabs
          v-model="state.mode"
          :tabs="['7D', '1M', '3M', '1Y', 'ALL']"
        ></ui-tabs>
      </div>
    </div>
    <div class="flex mt-6">
      <div class="text-xl font-bold mb-4 space-y-6 w-60 pr-8">
        <!-- Max -->
        <div
          class="ml-4"
          v-for="(item, i) in [
            {
              text: 'Max',
              value: state.info.maxPrice,
              rate: state.info.maxPriceRate,
            },
            {
              text: 'Medium',
              value: state.info.median,
              rate: state.info.medianRate,
            },
            {
              text: 'Min',
              value: state.info.minPrice,
              rate: state.info.minPriceRate,
            },
          ]"
          :key="i"
        >
          <div class="flex items-center text-sm mb-2">
            <div
              class="w-2 h-2 rounded-full mr-2"
              :class="{
                'bg-[#F72585FF]': i == 0,
                'bg-[#9317B5FF]': i == 1,
                'bg-[#3F37C9FF]': i == 2,
              }"
            ></div>
            {{ item.text }}
          </div>
          <div class="break-all">
            {{ item.value }} ETH
            <span
              class="font-normal ml-4"
              :class="{
                'text-[#5EFF6A]': item.rate > 0,
                'text-[#FF5166]': item.rate < 0,
              }"
              >{{ item.rate }}%</span
            >
          </div>
        </div>
      </div>
      <div class="rounded bg-[#121416FF] flex-1" style="height: 284px">
        <VChart class="w-full h-full" :option="lineOptions"></VChart>
      </div>
    </div>
  </div>
  <div class="flex mt-10">
    <div class="text-xl font-bold mb-4 w-60 pr-8">
      <div>Volume</div>
      <div class="ml-4 mt-8">
        {{ state.info.volume }} ETH
        <span
          class="font-normal"
          :class="{
            'text-[#5EFF6A]': state.info.volumeRate > 0,
            'text-[#FF5166]': state.info.volumeRate < 0,
          }"
          >{{ state.info.volumeRate }}%</span
        >
      </div>
    </div>
    <div class="rounded bg-[#121416FF] flex-1" style="height: 284px">
      <VChart class="w-full h-full" :option="barOptions"></VChart>
    </div>
  </div>
</template>

<script setup>
import { getBoardTradeHistory } from "@/api";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from "echarts/components";
import VChart from "vue-echarts";

const pid = inject("pid");

const state = reactive({
  mode: 0,
  info: {
    maxPrice: 0,
    minPrice: 0,
    volume: 0,
    median: 0,
    maxPriceRate: 0,
    minPriceRate: 0,
    volumeRate: 0,
    medianRate: 0,
    datas: [],
  },
});

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
]);

const periodMap = [7, 30, 90, 365];

const lineOptions = computed(() => {
  console.log(state.mode);

  const data = periodMap[state.mode]
    ? state.info.datas.slice(state.info.datas.length - periodMap[state.mode])
    : state.info.datas;

  let labels = data.map((x) => x.ctime);

  return {
    color: ["#F72585FF", "#9317B5FF", "#3F37C9FF"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      borderColor: "#FFFFFF66",
      backgroundColor: "#1e1f21",
      textStyle: {
        color: "#fff",
      },
      valueFormatter: (value) => value.toFixed(4) + " ETH",
    },
    yAxis: [
      {
        splitLine: {
          show: false,
        },
        type: "value",
      },
    ],
    xAxis: [{ type: "category", data: labels }],
    series: [
      {
        name: "Max",
        type: "line",
        data: data.map((x) => x.maxPrice),
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
      },
      {
        name: "Medium",
        type: "line",
        data: data.map((x) => x.median),
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
      },
      {
        name: "Min",
        type: "line",
        data: data.map((x) => x.minPrice),
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
      },
    ],
  };
});
const barOptions = computed(() => {
  const data = periodMap[state.mode]
    ? state.info.datas.slice(state.info.datas.length - periodMap[state.mode])
    : state.info.datas;

  const labels = data.map((x) => x.ctime);
  return {
    color: ["#F72585FF"],
    yAxis: [
      {
        splitLine: {
          show: false,
        },
        type: "value",
      },
    ],
    xAxis: [{ data: labels }],
    tooltip: {
      trigger: "axis",
      borderColor: "#FFFFFF66",
      backgroundColor: "#1e1f21",
      textStyle: {
        color: "#fff",
      },
      valueFormatter: (value) => value.toFixed(4) + " ETH",
    },
    series: {
      type: "bar",
      data: data.map((x) => x.volume),
    },
  };
});

onMounted(async () => {
  const res = await getBoardTradeHistory(pid);
  state.info = res;
});
</script>

<style lang="scss" scoped></style>
