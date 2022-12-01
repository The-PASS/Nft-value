<template>
  <div
    ref="container"
    class="relative w-6 h-full"
    style="border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1)"
  >
    <div
      class="absolute w-full bg-[#2A2E33FF]"
      :style="`top:${Math.min(state.y1, state.y2) + 4}px;height:${Math.abs(
        state.y1 - state.y2
      )}px`"
    ></div>
    <div
      class="w-6 h-2 rounded border-[1px] cursor-row-resize absolute top-[-1px]"
      :style="`top:${state.y1}px`"
      @mousedown="onDown($event, true)"
    ></div>
    <div
      class="w-6 h-2 rounded border-[1px] cursor-row-resize absolute top-[-1px]"
      :style="`top:${state.y2}px`"
      @mousedown="onDown($event, false)"
    ></div>
  </div>
</template>

<script setup>
const container = ref(null);

const k = 4;

const $emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 1],
  },
});

/* w 8px */
const state = reactive({
  point: props.modelValue,
  height: 0,
  yPoint1: null,
  yPoint2: null,
  y1: -4,
  y2: -4,
  width: 0,
});

const onDown = (e, isLeft) => {
  if (isLeft) {
    state.yPoint1 = e;
  } else {
    state.yPoint2 = e;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    state.modelValue = val;
  }
);

watch(
  () => state.point,
  (val) => {
    $emit("update:modelValue", val);
  }
);

watch(
  () => [state.y1, state.y2],
  (val) => {
    const a = (Math.min(val[0], val[1]) + k) / state.height;
    const b = (Math.max(val[0], val[1]) + k) / state.height;
    state.point = [a, b];
  }
);

onMounted(() => {
  const { height } = container.value.getBoundingClientRect();

  state.height = height;
  state.y1 = height * state.point[0] - k;
  state.y2 = height * state.point[1] - k;

  document.addEventListener("mousemove", (e) => {
    if (state.yPoint2) {
      state.y2 = Math.min(
        Math.max(state.y2 + e.clientY - state.yPoint2.clientY, 0),
        height - k
      );
      state.yPoint2 = e;
    }
    if (state.yPoint1) {
      state.y1 = Math.min(
        Math.max(state.y1 + e.clientY - state.yPoint1.clientY, 0),
        height - k
      );
      state.yPoint1 = e;
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (state.yPoint2) {
      state.yPoint2 = null;
    }
    if (state.yPoint1) {
      state.yPoint1 = null;
    }
  });
});
</script>

<style lang="scss" scoped></style>
