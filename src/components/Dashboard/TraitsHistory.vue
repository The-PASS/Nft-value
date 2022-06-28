<template>
  <div class="flex-1 px-5 py-4" style="background: #1e1f21; height: 364px">
    <div class="text-base font-bold">“ Type+value ” price by history.</div>
    <VChart class="chart" :option="option"></VChart>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
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

const testData = {
  cutData: {
    cutPoint: 1645402719000,
    tokenList: "9746,2242,4762,4682,2746,7860,6260,9630,2162,6951,4578",
  },
  trades: [
    {
      historyPrice: 26.5,
      tradeTime: 1648870281000,
    },
    {
      historyPrice: 25,
      tradeTime: 1648864379000,
    },
    {
      historyPrice: 23,
      tradeTime: 1648834027000,
    },
    {
      historyPrice: 15,
      tradeTime: 1648124590000,
    },
    {
      historyPrice: 14,
      tradeTime: 1645402719000,
    },
    {
      historyPrice: 14.98,
      tradeTime: 1644975776000,
    },
    {
      historyPrice: 13.68,
      tradeTime: 1644814317000,
    },
    {
      historyPrice: 13.75,
      tradeTime: 1644188767000,
    },
    {
      historyPrice: 8,
      tradeTime: 1643320535000,
    },
    {
      historyPrice: 3.99,
      tradeTime: 1642810694000,
    },
    {
      historyPrice: 2.88,
      tradeTime: 1642181703000,
    },
  ],
};

testData.trades.forEach(
  (x) => (x.tradeTime = dayjs(x.tradeTime).format("YYYY-MM-DD"))
);

/* 接下来就是调这个图表的样式，就好了 */

const store = useStore();

const pid = inject("pid");

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
]);

// onMounted(() => {
//   store.loadBoardTraitHistory(pid, "Clothing", "Kimono with Jacket");
// });

const option = computed(() => {
  // echarts.registerTransform(ecStat.transform.clustering);
  return {
    markLine: {
      symbol: "Test",
      lineStyle: {
        type: "dotted",
      },
      data: ["90"],
    },
    tooltip: {
      axisPointer: { type: "cross" },
    },
    xAxis: {
      // show: false,
      data: testData.trades.map((x) => x.tradeTime),
    },
    yAxis: {
      show: false,
    },
    color: "#FF5166FF",
    series: [
      {
        type: "scatter",
        data: testData.trades.map((x) => x.historyPrice),
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
