<template>
  <div>
    <div v-if="!!label" class="text-black text-sm mb-3 h-6">
      <span class="mr-2" style="color: #831828" v-if="required">*</span>
      <span> {{ label }} </span>
    </div>
    <div v-click-away="onClose" class="text-sm relative">
      <div
        class="ui-dropdown--box pl-4 pr-2 flex items-center justify-between text-whitebase cursor-pointer font-bold outline-none"
        :class="{
          [props.boxStyle]: true,
          ' text-xs h-8': props.size == 'sm',
          'h-10': props.size == 'base',
        }"
        @click="state.open = !state.open"
        tabIndex="1"
        @keyup="onKeyup"
      >
        <div class="flex-1">
          {{ props.modelValue.label }}
        </div>

        <i
          class="iconfont icon-right transition-all"
          :class="{
            'transform rotate-90': state.open,
          }"
        ></i>
      </div>
      <transition name="fade">
        <div
          v-if="state.open"
          class="absolute w-full ui-dropdown--options mt-2 z-40 bg-white"
          role="listbox"
        >
          <div
            v-for="(item, i) in options"
            :key="item"
            class="h-10 ui-dropdown--option"
            :class="{ 'ui-dropdown--option--active': state.selectIndex == i }"
            role="option"
            tabindex="-1"
            @click="change(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch, watchEffect } from "vue";
import TWEEN from "@tweenjs/tween.js";

const $emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  options: Array,
  modelValue: Object,
  label: String,
  required: {
    type: Boolean,
    default: false,
  },
  boxStyle: String,
  size: { type: String, default: "base" },
});

const state = reactive({
  open: false,
  selectIndex: 0,
});

watchEffect(() => {
  const index = props.options.findIndex(
    (x) => x.label == props.modelValue?.label
  );
  state.selectIndex = index == -1 ? 0 : index;
});

const onClose = () => {
  state.open = false;
};

const onKeyup = (e) => {
  if (e.keyCode == "38") {
    state.selectIndex = Math.max(0, state.selectIndex - 1);
  }
  if (e.keyCode == "40") {
    state.selectIndex = Math.min(
      props.options.length - 1,
      state.selectIndex + 1
    );
  }
  // do->select
  if (e.keyCode == "13") {
    const obj = props.options[state.selectIndex];
    $emits("update:modelValue", obj);
    state.open = false;
  }
};

const change = (item) => {
  $emits("update:modelValue", item);
  state.open = false;
};
</script>

<style scoped>
.ui-dropdown--box {
  border-radius: 4px;
  border: 1px solid #2a2e33;
}
.ui-dropdown--options {
  border-radius: 4px;
  border: 1px solid #831828;
}
.ui-dropdown--option {
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 16px;
  cursor: pointer;
  color: #fff;
}
.ui-dropdown--option:hover,
.ui-dropdown--option--active {
  background: rgba(255, 255, 255, 0.1);
}
</style>
