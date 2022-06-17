<template>
  <div class="relative">
    <div ref="box" class="text-xl space-y-10">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        @click="onSelect(i)"
        class="cursor-pointer"
      >
        <span
          class="transition-all"
          :class="{
            'font-bold': state.selectIndex == i,
            ' cursor-not-allowed text-[#fff6]': tab.disabled,
          }"
        >
          {{ tab.key }}
        </span>
      </div>
    </div>

    <!-- TODO 这里需要添加一个拉伸的动画 -->
    <div
      class="h-[1.5px] bg-white absolute"
      :style="`width:${state.width}px;top:${state.top}px`"
    ></div>
  </div>
</template>

<script setup>
import TWEEN from "@tweenjs/tween.js";

const box = ref(null);

const props = defineProps({
  tabs: Array,
  modelValue: { type: Number, default: 0 },
});

const state = reactive({
  selectIndex: props.modelValue,
  width: 0,
  top: 0,
});

const $emits = defineEmits(["update:modelValue"]);

const onSelect = (i) => {
  if (props.tabs[i].disabled) {
    return;
  }
  state.selectIndex = i;
};

const calPosition = (i) => {
  const el = box.value.children[i];
  const width = el.children[0].offsetWidth;
  state.top = el.offsetTop + el.offsetHeight + 4;

  new TWEEN.Tween({ y: 0 })
    .to({ y: width }, 400)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ y }) => {
      state.width = y;
    })
    .start();
};

watch(
  () => state.selectIndex,
  (val) => {
    calPosition(val);
    $emits("update:modelValue", val);
  }
);

watch(
  () => props.modelValue,
  (val) => (state.selectIndex = val)
);

onMounted(() => {
  calPosition(state.selectIndex);
});
</script>

<style lang="scss" scoped></style>
