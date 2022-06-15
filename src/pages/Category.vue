<template>
  <Page>
    <div class="w-full h-full flex pb-16 pt-12">
      <div
        class="w-44 flex flex-col justify-between border-r-[1px] border-[#9797971a]"
      >
        <side-bar :tabs="['Collectables', 'Art', 'Game Assets']"></side-bar>
        <third-link></third-link>
      </div>
      <div class="flex-1 h-full min-w-0 rounded ml-6 bg-[#9797971a]">
        <UiScrollbars class="w-full h-full">
          <div class="flex items-center justify-center">
            <Button @click="router.push('/detail')">下一页</Button>
          </div>
          <p
            v-for="(_, i) in [
              1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 1, 1, 1, 1, 1, 1,
            ]"
          >
            {{ i }}
          </p>
        </UiScrollbars>
      </div>
    </div>
  </Page>
</template>

<script setup>
const router = useRouter();
</script>

<style lang="scss" scoped></style>
