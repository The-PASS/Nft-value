<template>
  <div class="w-full h-full flex flex-col">
    <Header :search="$route.meta.search"></Header>
    <div
      class="flex-1 min-h-0"
      :class="{ 'px-[125px]': !$route.meta.nopadding }"
    >
      <router-view :key="$route.path"></router-view>
      <!-- <router-view v-slot="{ Component }">
        <KeepAlive>
          <component
            :is="Component"
            v-if="$route.meta.keepAlive"
            :key="$route.path"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-if="!$route.meta.keepAlive"
          :key="$route.path"
        />
      </router-view> -->
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

.vue-skeletor {
  background: rgba(42, 46, 51, 1);
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
</style>
