<template>
  <router-view></router-view>
</template>

<style>
@import url("@/assets/font/iconfont.css");
@import url("tippy.js/dist/tippy.css");
@import url("vue-skeletor/dist/vue-skeletor.css");

html {
  background: rgba(18, 20, 22, 1);
  font-family: Helvetica !important;
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
</style>
