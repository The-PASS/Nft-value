<template>
  <div
    class="w-96 px-4 flex items-center rounded-lg border-white border-[1px] cursor-pointer"
    ref="box"
    @click="showSearch"
  >
    <div class="flex-1 min-w-0 mr-4 relative">
      <div
        class="text-xs px-0 py-2 w-full h-9 flex items-center text-[#ffffff4d] bg-transparent border-none"
      >
        Search
      </div>
    </div>

    <iconfont-icon
      name="icon-sousuo1"
      class="font-bold text-sm"
    ></iconfont-icon>
  </div>

  <transition name="fade">
    <div
      v-if="state.flag"
      ref="floatBox"
      class="absolute z-50 text-xs bg-wall w-96 flex flex-col px-4 pb-4 rounded-lg border-white border-[1px] cursor-pointer"
      :style="`top:${state.top}px;right:${state.right}px`"
    >
      <div class="flex items-center">
        <div class="flex-1 min-w-0 mr-4 relative h-9">
          <input
            ref="searchInput"
            class="text-xs px-0 py-2 w-full h-full placeholder-[#ffffff4d] bg-transparent border-none"
            type="text"
            placeholder="Search"
            v-model="state.searchKey"
          />
          <iconfont-icon
            v-if="state.searchKey"
            name="icon-guanbi"
            class="text-[#ffffff4d] font-bold text-xs cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2"
            @click="state.searchKey = ''"
          ></iconfont-icon>
        </div>
        <iconfont-icon
          name="icon-sousuo1"
          class="font-bold text-sm"
        ></iconfont-icon>
      </div>

      <div v-if="state.searchKey">
        <div
          class="text-[#ffffff4d] h-12 flex items-center justify-center"
          v-if="state.loading"
        >
          <img class="w-4 h-4" src="@/assets/svgs/spin.svg" alt="" />
        </div>

        <div
          class="text-[#ffffff4d] h-12 flex items-center"
          v-else-if="state.searchList.length == 0"
        >
          Not found any results～
        </div>
        <div class="w-full h-full max-h-[20rem] overflow-y-scroll" v-else>
          <div
            class="flex h-12 items-center p-2 hover:bg-[#ffffff1a]"
            v-for="(item, i) in state.searchList"
            :key="i"
            @click="jump(item)"
          >
            <ui-img
              class="w-8 h-8 rounded-full mr-4 overflow-hidden"
              :src="item.logo"
              alt=""
            />
            <span class="font-bold"> {{ item.projectName }} </span>
          </div>
        </div>
      </div>

      <div v-if="state.searchList.length == 0">
        <div class="mb-2">Popular</div>
        <div
          class="flex h-12 items-center p-2 hover:bg-[#ffffff1a]"
          v-for="(item, i) in state.list"
          :key="i"
          @click="jump(item)"
        >
          <ui-img
            class="w-8 h-8 rounded-full mr-4 overflow-hidden"
            :src="item.logo"
            alt=""
          />
          <span class="font-bold"> {{ item.projectName }} </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { searchProject } from "@/api";

const box = ref(null);
const floatBox = ref(null);
const searchInput = ref(null);

const router = useRouter();

const state = reactive({
  flag: false,
  top: 0,
  right: 0,
  searchKey: "",
  searchList: [],
  list: [],
  loading: 0,
});

onClickOutside(floatBox, (event) => (state.flag = false));

const showSearch = () => {
  state.flag = true;
  const { top, right } = box.value.getBoundingClientRect();
  state.top = top;
  state.right = window.innerWidth - right;
  nextTick(() => {
    searchInput.value.focus();
  });
};

// TODO 这里差一个鼠标点击操作

const loadData = async (key) => {
  try {
    if (!key) {
      state.list = await searchProject();
    } else {
      state.loading++;
      const list = await searchProject(key, true);
      state.loading--;
      if (list) {
        state.searchList = list;
      }
    }
  } catch (error) {
    state.loading--;
  }
};

const jump = (item) => {
  state.flag = false;
  router.push(`/detail/${item.path}`);
};

// TODO 热度列表元素只会在加载的时候进行请求，其他不进行更新
onMounted(() => {
  loadData();
});

watch(
  () => state.flag,
  (val) => {
    if (!val) {
      state.searchKey = "";
      state.searchList = [];
    }
  }
);

watch(
  () => state.searchKey,
  (key) => {
    if (key) {
      loadData(key);
    } else {
      state.searchList = [];
    }
  }
);

// TODO 搜索元素会在请求的时候出现

/*
  - 聚焦的时候显示 popular 列表
  - 输入文字进行模糊查询
  - 查找不到显示 popular + 无结果
  - 查找到了只显示结果
 */
</script>

<style lang="scss" scoped></style>
