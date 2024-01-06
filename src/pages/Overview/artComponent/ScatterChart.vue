<template>
  <div class="w-full select-none">
    <div class="flex justify-between items-center mb-2 text-base">
      <div class="text-xl font-bold">Artwork Transaction History</div>

      <!-- <div class="flex space-x-4">
        <div
          class="flex items-center cursor-pointer"
          @click="selectChart(flag)"
          v-for="(flag, i) in flags"
          :key="i"
        >
          <div
            class="w-3 h-3 rounded-full mr-2"
            :style="`background:${flag.color}`"
          ></div>
          {{ flag.text }}
        </div>
      </div> -->
    </div>
    <div class="w-full h-[380px] relative">
      <div class="absolute top-2">
        Evaluation by history
        <span v-if="store.selectedTx.valueType">
          <span v-if="!store.selectedTx.isSingle"
            >- {{ store.selectedTx.collectionName }}
            <span v-if="store.selectedTx.editionCount">+</span>
            {{ store.selectedTx.editionCount }}
          </span>
          <span v-else
            >- Single<span v-if="store.selectedTx.tag">+</span
            >{{ store.selectedTx.tag }}
          </span>
        </span>
      </div>
      <div
        v-if="loading"
        class="w-full h-full flex items-center justify-center"
      >
        <img class="w-8 h-8" src="@/assets/svgs/spin.svg" alt="" />
      </div>
      <div class="w-full h-full flex" v-else-if="state.source.length > 0">
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex-1 min-h-0">
            <VChart ref="chart" class="chart" :option="option"></VChart>
          </div>

          <ui-move-bar-x v-model="state.xPoint" class="ml-10"></ui-move-bar-x>
        </div>
        <ui-move-bar-y
          v-model="state.yPoint"
          class="ml-4"
          style="height: calc(100% - 40px)"
        ></ui-move-bar-y>
      </div>

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

const chart = ref(null);
const $route = useRoute();
const store = useArtStore();
const color = ["#FF5166FF", "#9317B5FF"];
const isTezos = inject("isTezos");

const props = defineProps({
  valueType: {
    type: [Number, String],
  },
  cutTime: Number,
});

const state = reactive({
  source: [],
  xPoint: [0, 0.5],
  yPoint: [0, 0.8],
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
  const [single, edition] = state.source;

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

const selectChart = (info) => {
  chart.value.dispatchAction({
    type: "legendUnSelect",
    name: info.text,
  });
};

const { loadData, loading } = useReqByBool(async () => {
  let list;

  try {
    if (props.valueType) {
      const res = await getArtScatter(
        $route.params.name,
        props.valueType,
        $route.params.chain,
        true
      );
      list = res.length > 0 ? [res] : res;
    } else {
      list = await getArtScatterAll($route.params.name, $route.params.chain);
    }

    state.yPoint = [0, 1];
    state.xPoint = [0, 1];
  } catch (error) {
    // list = [];
  }
  console.log(list);
  state.source = list;
});

const xAxis = computed(() => {
  let minPoint = 0;
  let maxPoint = 0;

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
  });

  const detal = maxPoint - minPoint;

  return [
    Math.floor(minPoint + detal * state.xPoint[0]),
    Math.ceil(minPoint + detal * state.xPoint[1]),
  ];
});

const yAxis = computed(() => {
  let minPoint = 0;
  let maxPoint = 0;

  state.source.forEach((list, i) => {
    list.forEach((x) => {
      if (minPoint == 0) {
        minPoint = x.lastPrice;
        maxPoint = x.lastPrice;
      } else {
        maxPoint = Math.max(maxPoint, x.lastPrice);
        minPoint = Math.min(minPoint, x.lastPrice);
      }
    });
  });

  const detal = maxPoint - minPoint;

  return [
    Math.floor(Math.max(minPoint + detal * (1 - state.yPoint[1]), 0)),
    Math.ceil((minPoint + detal * (1 - state.yPoint[0])) * 1.2),
  ];
});

const option = computed(() => {
  const series = [];
  state.source.forEach((list, i) => {
    if (list.length > 0)
      series.push({
        name: list[0].isSingle ? "Single" : "Edition",
        symbolSize: 10,
        type: "scatter",
        data: list.map((x) => [x.transactionTime, x.lastPrice]),
      });
  });

  if (series.length == 1 && props.cutTime) {
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
          xAxis: new Date(props.cutTime).getTime(),
        },
      ],
    };
  }

  const res = {
    grid: {
      left: "80",
      right: "20",
      bottom: "40",
    },
    xAxis: {
      // show: false,
      splitNumber: xAxis.value[0] == xAxis.value[1] ? 1 : 0,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: (value) => formatDate(value, "YYYY MMM DD"),
      },
      min:
        xAxis.value[0] == xAxis.value[1] ? xAxis.value[0] - 1 : xAxis.value[0],
      max:
        xAxis.value[0] == xAxis.value[1] ? xAxis.value[1] + 1 : xAxis.value[1],
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      min: 0,
      max: yAxis.value[1],
    },
    legend: {
      data: flags.value.map((x) => x.text),
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
        } ${isTezos.value ? "ꜩ" : "ETH"} <br/> ${formatDate(
          data[0],
          "MMM DD YYYY  hh:mmA"
        )} `;
      },
    },

    color,
    series,
  };

  return res;
});

watch(
  () => props.valueType,
  () => {
    loadData();
  }
);

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped></style>
