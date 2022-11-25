<template>
  <div class="w-full">
    <div class="text-xl font-bold">Artwork Transaction history</div>
    <div class="flex justify-between mb-2 mt-4 text-base">
      <div>Valuation by history</div>
      <div class="flex space-x-4">
        <div class="flex items-center" v-for="(flag, i) in flags" :key="i">
          <div
            class="w-4 h-4 rounded-full mr-2"
            :style="`background:${flag.color}`"
          ></div>
          {{ flag.text }}
        </div>
      </div>
    </div>
    <div class="w-full h-[362px]">
      <div
        v-if="loading"
        class="w-full h-full flex items-center justify-center"
      >
        <img class="w-8 h-8" src="@/assets/svgs/spin.svg" alt="" />
      </div>
      <VChart
        class="chart"
        :option="option"
        v-else-if="state.source.cutPoint"
      ></VChart>
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
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { formatDate } from "@/utils";
import { useReqByBool } from "@/hooks";
import { getArtScatter } from "@/api";
import { useArtStore } from "@/store/art";

const $route = useRoute();
const store = useArtStore();
const color = ["#FF5166FF", "#9317B5FF"];

const state = reactive({
  source: {},
});

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
]);

const flags = computed(() => {
  const { single, edition } = state.source;

  const flag = [];
  if (single && single.length > 0) {
    flag.push({ text: "Single" });
  }
  if (edition && edition.length > 0) {
    flag.push({ text: "Edition" });
  }

  flag.forEach((x, i) => {
    x.color = color[i];
  });

  return flag;
});

const { loadData, loading } = useReqByBool(async () => {
  const res = await getArtScatter(
    $route.params.name,
    store.selectedTx ? store.selectedTx.valueType : ""
  );

  state.source = res;
});

const option = computed(() => {
  const { single, edition } = state.source;

  return {
    grid: {
      left: "40",
      right: "20",
    },
    xAxis: {
      // show: false,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: (value) => formatDate(value, "MMM DD"),
      },
      min: state.source.minPoint,
      max: state.source.maxPoint,
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    tooltip: {
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#FFFFFF66",
          type: "solid",
        },
        label: {
          show: false,
          formatter: ({ axisDimension, value }) => {
            if (axisDimension == "x") {
              return "";
            }
            return value;
          },
        },
      },
      borderColor: "#FFFFFF66",
      backgroundColor: "#1e1f21",
      textStyle: {
        color: "#fff",
      },
      formatter: ({ componentType, data }) => {
        if (componentType == "markLine") {
          return "";
        }
        return `${data[1]} ETH <br/> ${formatDate(
          data[0],
          "MMM DD YYYY  hh:mmA"
        )} `;
      },
    },
    color,
    series: [
      {
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68],
        ],
        type: "scatter",
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            color: "#fff",
            position: "end",
            formatter: "Cut Time",
          },
          lineStyle: {
            type: "solid",
            color: "#fff",
          },
          data: [
            {
              name: "Cut Time",
              xAxis: 0,
              xAxis: state.source.cutPoint,
            },
          ],
        },
      },
    ],
  };
});

watch(
  () => store.selectedTx.valueType,
  () => {
    loadData();
  }
);

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
