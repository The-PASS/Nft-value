<template>
  <div class="flex-1 px-5 py-4" style="background: #1e1f21; height: 364px">
    <div class="text-base font-bold">“ Type+value ” price by history.</div>
    <VChart class="chart" :option="option"></VChart>
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
} from "echarts/components";
import VChart from "vue-echarts";

const store = useStore();

const pid = inject("pid");

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

onMounted(() => {
  store.loadBoardTraitHistory(pid, "Clothing", "Kimono with Jacket");
});

const option = computed(() => {
  // echarts.registerTransform(ecStat.transform.clustering);
  return {
    markLine: {
      symbol: "Test",
      lineStyle: {
        type: "dotted",
      },
      data: [90],
    },
    tooltip: {
      axisPointer: { type: "cross" },
    },
    xAxis: {
      data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yAxis: {
      show: false,
    },
    color: "#FF5166FF",
    series: [
      {
        type: "scatter",
        data: [220, 182, 191, 234, 290, 330, 310],
        symbolSize: (...params) => {
          console.log(params);
          return 8;
        },
      },
    ],
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
