<template>
  <div class="os-host" ref="container">
    <div class="os-resize-observer-host"></div>
    <div class="os-padding">
      <div class="os-viewport">
        <div class="os-content">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="os-scrollbar os-scrollbar-horizontal">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
    <div class="os-scrollbar os-scrollbar-vertical">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
    <div class="os-scrollbar-corner"></div>
  </div>
</template>

<script setup>
import OverlayScrollbars from "overlayscrollbars";

const position = ref({ x: 0, y: 0 });

const container = ref(null);

const osInstance = ref(null);

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  extensions: {
    type: [String, Array, Object],
  },
  onIns: Function,
});

watch(
  () => props.options,
  (newer) => {
    if (OverlayScrollbars.valid(osInstance.value)) {
      osInstance.value.options(newer);
    }
  }
);

onMounted(() => {
  osInstance.value = OverlayScrollbars(
    container.value,
    props.options,
    props.extensions
  );

  if (props.onIns) {
    props.onIns(osInstance.value);
  }
});

/* 页面初次加载不会触发它的更新，但是由其他路由导入进来，会出发它的更新 */

onDeactivated(() => {
  console.log();
  const y = osInstance.value
    .getElements("scrollbarVertical.handle")
    .style.transform.match(/(\d+)/gi);

  position.value.y = y != null ? y[1] : 0;

  const x = osInstance.value
    .getElements("scrollbarHorizontal.handle")
    .style.transform.match(/(\d+)/gi);

  position.value.x = x != null ? x[0] : 0;
});

onActivated(() => {
  setTimeout(() => {
    osInstance.value.scroll({
      x: position.value.x + "px",
      y: position.value.y + "px",
    });
  }, 3000);
});

onBeforeUnmount(() => {
  if (OverlayScrollbars.valid(osInstance.value)) {
    osInstance.value.destroy();
  }
});
</script>

<style scoped>
@import url("overlayscrollbars/css/OverlayScrollbars.css");
</style>
