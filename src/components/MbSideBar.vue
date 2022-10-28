<template>
  <div class="flex text-whitebase space-x-4 mb-6">
    <div
      v-for="(tab, i) in tabs"
      :key="i"
      class="text-xl font-bold py-2 relative"
      @click="jump(tab)"
      :style="{
        color: tab.disabled ? '#5E6873FF' : '',
      }"
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

      <div
        class="h-1 w-[80%] bg-[#FF5166FF] absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded"
        v-if="state.selectIndex == i"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { useSideBar } from "@/hooks";

const props = defineProps({
  tabs: Array,
  modelValue: { type: Number, default: 0 },
});

const state = reactive({
  selectIndex: 0,
});

const $emits = defineEmits(["update:modelValue"]);

const onSelect = (i) => {
  if (props.tabs[i].disabled) {
    return;
  }
  state.selectIndex = i;
};

watch(
  () => state.selectIndex,
  (val) => {
    $emits("update:modelValue", val);
  }
);

watch(
  () => props.modelValue,
  (val) => (state.selectIndex = val)
);
</script>

<style lang="scss" scoped></style>
