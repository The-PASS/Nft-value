<template>
  <div class="h-full rounded-lg p-6 bg-[#FFFFFF0D] flex flex-col">
    <div class="flex justify-between">
      <div class="font-bold text-xl">NFT Transaction</div>

      <div class="flex space-x-8">
        <div class="flex space-x-2" v-if="showList.length > 12">
          <div
            class="bar-time-btn flex items-center justify-center"
            :class="{
              'bar-time-btn-active': state.selected == i,
            }"
            v-for="(text, i) in ['1Y', 'ALL']"
            :key="i"
            @click="state.selected = i"
          >
            {{ text }}
          </div>
        </div>

        <div class="flex space-x-2">
          <div
            class="bar-time-btn flex items-center justify-center"
            :class="{
              'bar-time-btn-active': state.selectedType == i,
            }"
            v-for="(text, i) in ['By value', 'By quantity']"
            :key="i"
            @click="state.selectedType = i"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-0">
      <div
        v-if="loading"
        class="w-full h-full flex items-center justify-center"
      >
        <img class="w-8 h-8" src="@/assets/svgs/spin.svg" alt="" />
      </div>
      <VChart class="chart" :option="option" v-else-if="!isNull"></VChart>
      <div
        v-else
        class="w-full h-full flex justify-center items-center font-bold text-xl text-[#5E6873FF]"
      >
        No Data
      </div>
    </div>
  </div>
</template>

<script setup>
import { getArtTransaction } from "@/api";
import { useReqByBool } from "@/hooks";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { localeNumber } from "@/utils";

const chartColor = [
  "#F72585FF",
  "#B5179EFF",
  "#9317B5FF",
  "#560BADFF",
  "#3A0CA3FF",
  "#3F37C9FF",
  "#4361EEFF",
  "#4895EFFF",
  "#4CC9F0FF",
  "#3DFFE6FF",
  "#F6FF3DFF",
];

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
]);

const $route = useRoute();

const state = reactive({
  source: [],
  selected: 0,
  selectedType: 0,
});

const { loadData, loading } = useReqByBool(async () => {
  const res = await getArtTransaction($route.params.name);
  state.source = res;
});

const showList = computed(() => {
  const list =
    (state.selectedType == 0 ? state.source[0] : state.source[1]) || [];

  return state.selected == 0 ? list.slice(0, 12) : list;
});

const isNull = computed(
  () => showList.value.filter((x) => x.platSum.length > 0).length == 0
);

const option = computed(() => {
  const originList = showList.value;

  const datas = originList.map((x) => x.month);

  const data = [];
  Array(4)
    .fill(0)
    .forEach((_, i) => {
      const arr = [];
      originList.forEach((x) => {
        const y = x.platSum[i];
        arr.push({
          name: y ? y.platform : "",
          value: y ? y.sum : 0,
          label: {
            show: false,
          },
          itemStyle: {
            color: chartColor[i],
          },
        });
      });

      data.push(arr);
    });

  const series = data.map((x) => {
    return {
      // name: 'Direct',
      type: "bar",
      stack: "total",
      label: {
        show: true,
        color: "#fff",
      },
      emphasis: {
        // focus: 'series',
      },
      color: chartColor,
      data: x,
      tooltip: {
        borderColor: "#FFFFFF66",
        backgroundColor: "#1e1f21bb",
        textStyle: {
          color: "#fff",
        },
        formatter: (params) => {
          const { dataIndex } = params;

          console.log("data", params);

          const filterData = originList[dataIndex].platSum;

          const str = `<div class="text-xs"><div>${
            originList[dataIndex].month
          }</div>
          ${[
            { platform: "Total", sum: originList[dataIndex].totalSum },
            ...filterData,
          ]
            .map((value, i) => {
              return `<div class='flex justify-between items-center w-full'>
                        <div class="flex items-center">
                          <div class="w-2 h-2 rounded-full mr-2" style='background-color:${
                            chartColor[i]
                          }'></div>
                          <span class="mr-4 font-bold">${value.platform}</span>
                        </div>
                        <div>${
                          state.selectedType == 0
                            ? '<i class="iconfont icon-ETH2-24 mr-1 text-xs"></i>'
                            : ""
                        }${localeNumber(value.sum)}</div>
                      </div>`;
            })
            .reverse()
            .join("")}</div>`;

          return str;
        },
      },
    };
  });

  return {
    tooltip: {
      // trigger: 'axis',
      // axisPointer: {
      //   // Use axis to trigger tooltip
      //   type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      // },
    },
    // legend: {},
    grid: {
      left: "0",
      right: "0",
      bottom: "0",
      top: "16%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#FFFFFF1A",
        },
      },
    },
    xAxis: {
      type: "category",
      data: datas,
    },
    series,
  };
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.bar-time-btn {
  min-width: 60px;
  padding: 0 8px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ffffff4d;
  transition: all 0.3s;
  font-weight: bold;
  cursor: pointer;
}
.bar-time-btn-active {
  background: #fff;
  border: 1px solid #fff;
  color: #121416ff;
}
</style>
