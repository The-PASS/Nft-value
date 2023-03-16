<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="flex-1 min-h-0 flex flex-col justify-center items-center px-4 md:px-0"
    >
      <div class="text-[2.5rem] md:text-[4rem] font-bold text-center">
        <p>PRICE IS WHAT YOU PAY ,</p>
        <p>VALUE IS WHAT YOU GET.</p>
      </div>
      <div class="mt-4 font-[300] text-center opacity-60">
        <p>
          NFT Value is a NFT Data Analysis Platform, helping you evaluate and
          learn better
        </p>
        <p>about your NFT assets.</p>
      </div>
      <Button type="main-weak" class="mt-16" @click="router.push('/list')"
        >Explore Evaluation</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// useRoute, useHead, and HelloWorld are automatically imported. See vite.config.ts for details.
const router = useRouter();

// useHead({
//   bodyAttrs: {
//     title: route.meta.title,
//   },
//   meta: [
//     {
//       property: "og:title",
//       content: route.meta.title,
//     },
//     {
//       name: "twitter:title",
//       content: route.meta.title,
//     },
//   ],
// });

// const VERSION = import.meta.env.VITE_APP_VERSION
// const BUILD_DATE = import.meta.env.VITE_APP_BUILD_EPOCH
//   ? new Date(Number(import.meta.env.VITE_APP_BUILD_EPOCH))
//   : undefined
// const thisYear = new Date().getFullYear()
</script>
