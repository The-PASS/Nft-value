<template>
  <div class="flex-1 px-5 py-4" style="background: #1e1f21; height: 364px">
    <div class="text-base font-bold">
      “
      {{ store.dashboard.traitType }}
      +
      {{ store.dashboard.traitValue }}
      ” price by history.
    </div>
    <div
      v-if="store.loading.dashboardTraitHistory"
      class="chart flex justify-center items-center"
    >
      <img src="@/assets/svgs/spin.svg" class="w-10 h-10" alt="" />
    </div>
    <VChart class="chart" :option="option" v-else></VChart>
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
import { max } from "lodash";

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

/* 图表数据的完整性还有待调整 */
const option = computed(() => {
  // echarts.registerTransform(ecStat.transform.clustering);
  return {
    xAxis: {
      // show: false,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: (value) => dayjs(value).format("MMM DD"),
      },
      min: store.dashboard.traitHistory.trades[
        store.dashboard.traitHistory.trades.length - 1
      ].tradeTime,
      max: store.dashboard.traitHistory.trades[0].tradeTime,
    },
    yAxis: {
      show: false,
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
        return `${data[1]} ETH <br/> ${dayjs(data[0]).format(
          "MMM DD YYYY  hh:mmA"
        )} `;
      },
    },
    color: "#FF5166FF",
    series: [
      {
        type: "scatter",
        data: store.dashboard.traitHistory.trades.map((x) => [
          x.tradeTime,
          x.historyPrice,
        ]),
        symbolSize: 8,
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
              xAxis: store.dashboard.traitHistory.cutData.cutPoint,
            },
          ],
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
