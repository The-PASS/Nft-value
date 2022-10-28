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
      {{ tab.name }}

      <transition name="fade">
        <div class="flex justify-center" v-if="$route.name === tab.key">
          <div
            class="absolute bottom-0 h-1 w-10/12"
            style="background: #ff5166"
          ></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { useSideBar } from "@/hooks";

const { props, comState, $emits } = useSideBar(calPosition);
</script>

<style lang="scss" scoped></style>
