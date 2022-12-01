<template>
  <div
    ref="container"
    class="h-6 relative"
    style="border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1)"
  >
    <div
      class="absolute h-full bg-[#2A2E33FF]"
      :style="`left:${Math.min(state.x1, state.x2) + 4}px;width:${Math.abs(
        state.x1 - state.x2
      )}px`"
    ></div>
    <div
      class="w-2 h-6 rounded border-[1px] cursor-col-resize absolute top-[-1px]"
      :style="`left:${state.x1}px`"
      @mousedown="onDown($event, true)"
      @mousemove="onMove($eventvent, true)"
      @mouseup="onUp($event, true)"
    ></div>
    <div
      class="w-2 h-6 rounded border-[1px] cursor-col-resize absolute top-[-1px]"
      :style="`left:${state.x2}px`"
      @mousedown="onDown($event, false)"
      @mousemove="onMove($event, false)"
      @mouseup="onUp($event, false)"
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
  width: 0,
  xPoint1: null,
  xPoint2: null,
  x1: -k,
  x2: -k,
  width: 0,
});

const onDown = (e, isLeft) => {
  if (isLeft) {
    state.xPoint1 = e;
  } else {
    state.xPoint2 = e;
  }
};

const onMove = (e, isLeft) => {};

const onUp = (e, isLeft) => {
  if (isLeft) {
    state.xPoint1 = null;
  } else {
    state.xPoint2 = null;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    state.point = val;
  }
);

watch(
  () => state.point,
  (val) => {
    $emit("update:modelValue", val);
  }
);

watch(
  () => [state.x1, state.x2],
  (val) => {
    const a = (Math.min(val[0], val[1]) + k) / state.width;
    const b = (Math.max(val[0], val[1]) + k) / state.width;
    state.point = [a, b];
  }
);

onMounted(() => {
  const { width } = container.value.getBoundingClientRect();
  state.width = width;
  state.x1 = width * state.point[0] - k;
  state.x2 = width * state.point[1] - k;

  document.addEventListener("mousemove", (e) => {
    if (state.xPoint2) {
      state.x2 = Math.min(
        Math.max(state.x2 + e.clientX - state.xPoint2.clientX, 0),
        width - k
      );
      state.xPoint2 = e;
    }
    if (state.xPoint1) {
      state.x1 = Math.min(
        Math.max(state.x1 + e.clientX - state.xPoint1.clientX, 0),
        width - k
      );
      state.xPoint1 = e;
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (state.xPoint2) {
      state.xPoint2 = null;
    }
    if (state.xPoint1) {
      state.xPoint1 = null;
    }
  });
});
</script>

<style lang="scss" scoped></style>
