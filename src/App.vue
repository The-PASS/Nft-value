<template>
  <div class="w-full h-full flex flex-col">
    <Header :search="$route.meta.search" v-if="!$route.meta.noHeader"></Header>

    <div
      class="flex-1 min-h-0"
      :class="{ 'px-[16px] md:px-[125px]': !$route.meta.nopadding }"
    >
      <router-view></router-view>
    </div>
    <Footer v-if="$route.meta.footer"></Footer>
  </div>
</template>

<script setup>
const $route = useRoute();
</script>

<style>
@import url("@/assets/font/iconfont.css");
@import url("tippy.js/dist/tippy.css");
@import url("vue-skeletor/dist/vue-skeletor.css");
@import url("gitart-vue-dialog/dist/style.css");
html {
  background: rgba(18, 20, 22, 1);
  font-family: Helvetica !important;
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
}

#app {
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
}

input {
  box-shadow: none !important;
}

.line-clamp-1 {
  word-break: break-all;
}

.vue-skeletor {
  background: rgba(42, 46, 51, 1);
  -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
}

.os-content {
  height: auto !important;
}

table th,
table td {
  padding: 0 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

.link-hover:hover {
  color: #26aaffff;
  text-decoration: underline;
  cursor: pointer;
}

.g-dialog-content {
  --content-bg: var(--g-dialog-content-bg, #121416);
}
.g-dialog-content:not(.g-dialog-content--fullscreen) {
  max-width: 1200px;
  min-width: 1200px;
  height: auto;
  box-shadow: 0px 0px 16px 0px #898a8b;
  border-radius: 8px;
}

.bar-time-btn {
  display: flex;
  align-items: center;
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
