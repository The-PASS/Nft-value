<template>
  <div class="w-full">
    <div class="text-xl font-bold">Artwork Transaction history</div>
    <!-- <div class="flex justify-between mb-2 mt-4 text-base">
      <div class="flex space-x-4">
        <div class="flex items-center" v-for="(flag, i) in flags" :key="i">
          <div
            class="w-4 h-4 rounded-full mr-2"
            :style="`background:${flag.color}`"
          ></div>
          {{ flag.text }}
        </div>
      </div>
    </div> -->
    <div class="w-full h-[362px] relative">
      <div class="absolute top-2">
        Valuation by history
        <span v-if="store.selectedTx.valueType">
          <span v-if="!store.selectedTx.isSingle"
            >- {{ store.selectedTx.collectionName }}:
            {{ store.selectedTx.editionCount }}
          </span>
          <span v-else
            >- Single
            {{ store.selectedTx.tag }}
          </span>
        </span>
      </div>
      <div
        v-if="loading"
        class="w-full h-full flex items-center justify-center"
      >
        <img class="w-8 h-8" src="@/assets/svgs/spin.svg" alt="" />
      </div>
      <VChart
        class="chart"
        :option="option"
        v-else-if="state.source.length > 0"
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
import { getArtScatter, getArtScatterAll } from "@/api";
import { useArtStore } from "@/store/art";

const $route = useRoute();
const store = useArtStore();
const color = ["#FF5166FF", "#9317B5FF"];

const state = reactive({
  source: [],
});

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
]);

// TODO 选择对应的 artwork 的时候显示对应的值
const flags = computed(() => {
  // const { single, edition } = state.source;

  // const flag = [];
  // if (single && single.length > 0) {
  //   flag.push({ text: "Single" });
  // }
  // if (edition && edition.length > 0) {
  //   flag.push({ text: "Edition" });
  // }

  // flag.forEach((x, i) => {
  //   x.color = color[i];
  // });

  return [];

  // return flag;
});

const { loadData, loading } = useReqByBool(async () => {
  let list;

  try {
    if (store.selectedArtwork.valueType) {
      const res = await getArtScatter(
        $route.params.name,
        store.curEvaType,
        store.selectedArtwork.valueType
      );
      list = res.length > 0 ? [res] : res;
    } else if (!store.selectedTx.valueType) {
      list = await getArtScatterAll($route.params.name);
    } else {
      const res = await getArtScatter(
        $route.params.name,
        store.curEvaType,
        store.selectedTx.valueType
      );
      list = res.length > 0 ? [res] : res;
    }
  } catch (error) {
    list = [];
  }

  state.source = list;
});

const option = computed(() => {
  let maxPoint = 0;
  let minPoint = 0;

  const series = [];
  state.source.forEach((list, i) => {
    list.forEach((x) => {
      if (minPoint == 0) {
        minPoint = x.transactionTime;
        maxPoint = x.transactionTime;
      } else {
        maxPoint = Math.max(maxPoint, x.transactionTime);
        minPoint = Math.min(minPoint, x.transactionTime);
      }
    });

    series.push({
      name: store.evaTypes[i],
      symbolSize: 10,
      type: "scatter",
      data: list.map((x) => [x.transactionTime, x.lastPrice]),
    });
  });

  if (series.length == 1 && store.selectedTx.cutPoint) {
    series[0].markLine = {
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
          xAxis: new Date(store.selectedTx.cutPoint).getTime(),
        },
      ],
    };
  }

  const res = {
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
      min: minPoint,
      max: maxPoint,
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    legend: {
      data: ["Single", "Edition"],
      left: "right",
      top: 10,
      textStyle: {
        color: "#fff",
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
      formatter: ({ componentType, data, dataIndex, seriesIndex }) => {
        console.log(seriesIndex, dataIndex);
        if (componentType == "markLine") {
          return "";
        }
        return `${state.source[seriesIndex][dataIndex].tokenName}<br/>${
          data[1]
        } ETH <br/> ${formatDate(data[0], "MMM DD YYYY  hh:mmA")} `;
      },
    },

    color,
    series,
  };

  return res;
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
