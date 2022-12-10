<template>
  <div class="h-full rounded-lg p-6 bg-[#FFFFFF0D] flex flex-col">
    <div class="flex justify-between">
      <div class="font-bold text-xl">Minting Platform</div>

      <div class="flex space-x-2">
        <div
          class="bar-time-btn flex items-center justify-center"
          :class="{
            'bar-time-btn-active': state.selected == i,
          }"
          v-for="(text, i) in ['By value', 'By quantity']"
          :key="i"
          @click="state.selected = i"
        >
          {{ text }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex-1 min-h-0">
      <Skeletor class="w-full h-full rounded" v-if="loading"></Skeletor>

      <div class="flex w-full h-full" v-else>
        <div class="flex-1">
          <VChart
            class="chart"
            :option="option"
            @mouseover="onOver"
            ref="echartsIns"
          ></VChart>
        </div>
        <div style="width: 220px">
          <div
            class="flex justify-between py-1 px-2 transition-all cursor-pointer h-7"
            @mouseover="onItemOver(i)"
            @mouseleave="onItemLeave(i)"
            :class="{
              'item-active': state.activeIndex == i,
            }"
            v-for="(item, i) in list"
            :key="i"
          >
            <div class="flex items-center">
              <div
                class="w-2 h-2 rounded-full mr-2"
                :style="`background: ${colors[i]}`"
              ></div>
              <div
                class="line-clamp-1"
                style="width: 120px; word-break: break-all"
              >
                {{ item.plat }}
              </div>
            </div>
            <div>{{ +item.rate == 0 ? "- -" : `${item.rate}%` }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, reactive, ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { localeNumber } from "@/utils";
import { Skeletor } from "vue-skeletor";
import { useReqByBool, useReqPages } from "@/hooks";
import { getArtDount } from "@/api";
import nftnologo from "@/assets/images/nftnologo.png";

const $route = useRoute();

const echartsIns = ref(null);

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const colors = [
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

const state = reactive({
  selected: 0,
  activeIndex: -1,
  data: [],
});

const list = computed(() =>
  state.selected == 0 ? state.data[0] : state.data[1]
);

const option = computed(() => {
  const legendData = state.data.map((x) => x.plat);

  return {
    tooltip: {
      trigger: "item",
      formatter: "{b} : ${c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        color: colors,
        // top: -60,
        // bottom: 0,
        // left: 0,
        // right: 0,
        data: list.value,
        radius: ["50%", "84%"],
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
            borderWidth: 0,
            color: "#fff",
          },
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
          formatter: (params) => {
            const { data } = params;
            return data.rate + "%";
          },
        },
        tooltip: {
          borderColor: "#FFFFFF66",
          backgroundColor: "#1e1f21bb",
          textStyle: {
            color: "#fff",
          },
          position: "right",
          formatter: (params) => {
            const { data } = params;

            return `
                <div class="flex mb-1">
                  <img class="w-5 h-5 rounded-full mr-2" src="${
                    data.logo || nftnologo
                  }" />
                  <div class="font-bold" style="width: 160px;word-break: break-word;white-space: normal;">
                  ${data.plat}
                  </div>
                </div>
              ${
                state.selected == 0
                  ? 'Value: <i class="iconfont icon-ETH2-24 mr-1 text-sm"></i>'
                  : "Quantity: "
              }${
              state.selected == 0 ? localeNumber(data.value, 2) : data.value
            }`;
          },
        },
      },
    ],
  };
});

const onOver = (e) => {
  state.activeIndex = e.dataIndex;
};

const onItemOver = (index) => {
  state.activeIndex = index;
  console.log(echartsIns.value);
  echartsIns.value.dispatchAction({
    type: "highlight",
    dataIndex: index,
  });
  echartsIns.value.dispatchAction({
    type: "showTip",
    seriesIndex: 0,
    dataIndex: index,
    position: "right",
  });

  // TODO 触发一个事件
};

const onItemLeave = (index) => {
  state.activeIndex = -1;
  echartsIns.value.dispatchAction({
    type: "downplay",
    dataIndex: index,
  });
  echartsIns.value.dispatchAction({
    type: "hideTip",
  });
};

const { loadData, loading } = useReqByBool(async () => {
  state.data = await getArtDount($route.params.name, $route.params.chain);
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.item-active {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.bar-time-btn {
  height: 32px;
  padding: 0 8px;
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
