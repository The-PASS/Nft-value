<template>
  <div ref="target">
    <Skeletor
      class="w-full h-full rounded-none"
      v-if="state.status == STATUS.LOADING"
    ></Skeletor>
    <img
      v-if="state.status == STATUS.SUCCESS"
      :src="props.src"
      class="w-full h-full object-cover"
      alt=""
    />
    <div
      v-if="state.status == STATUS.ERROR"
      class="w-full h-full flex justify-center items-center bg-[#232323]"
    >
      <i class="iconfont icon-jinggao text-red-500"></i>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from "vue-skeletor";

const target = ref(null);
const targetIsVisible = ref(false);

const STATUS = {
  IDEL: -1,
  LOADING: 0,
  SUCCESS: 1,
  ERROR: 2,
};

const props = defineProps({
  src: String,
});

const state = reactive({
  status: STATUS.IDEL,
  loaded: false,
});

const loadImg = () => {
  state.status = STATUS.IDEL;
  const img = document.createElement("img");
  if (!props.src) {
    state.status = STATUS.ERROR;
    return;
  }
  img.src = props.src;
  state.status = STATUS.LOADING;
  img.onload = () => {
    state.status = STATUS.SUCCESS;
  };
  img.onerror = () => {
    state.status = STATUS.ERROR;
  };
};

useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
  if (isIntersecting && !state.loaded) {
    state.loaded = true;
    loadImg();
  }
});
</script>

<style lang="scss" scoped></style>
