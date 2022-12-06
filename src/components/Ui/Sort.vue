<template>
  <div @click="doSort" class="cursor-pointer flex items-center">
    <div class="mr-2">
      <slot></slot>
    </div>
    <img
      v-if="state.value[props.index] == -1"
      class="w-3 h-3"
      src="@/assets/images/sort-default.png"
      alt=""
    />
    <img
      v-if="state.value[props.index] == 0"
      class="w-3 h-3"
      src="@/assets/images/sort-down.png"
      alt=""
    />
    <img
      v-if="state.value[props.index] == 1"
      class="w-3 h-3 transform rotate-180"
      src="@/assets/images/sort-down.png"
      alt=""
    />
  </div>
</template>

<script setup>
const emits = defineEmits(["change"]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  index: Number,
  // noDefault: {
  //   type: Boolean,
  //   default: false,
  // },
});

const state = reactive({
  value: props.modelValue,
});

watch(
  () => state.value,
  (val) => {
    emits("change", val, props.name);
  }
);

watch(
  () => props.modelValue,
  (val) => {
    state.value = state.value.map((x, i) => (i == props.index ? val : -1));
  }
);

const doSort = () => {
  state.value.forEach((x, i) => {
    if (i == props.index) {
      if (++state.value[i] == 2) {
        state.value[i] = state.value[i] == 0 ? 1 : 0;
      }
    } else {
      state.value[i] = -1;
    }
  });
};
</script>

<style lang="scss" scoped></style>
