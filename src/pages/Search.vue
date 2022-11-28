<template>
  <div class="flex flex-col">
    <div
      class="w-full my-4 px-4 flex items-center rounded-lg cursor-pointer"
      :class="{
        'border-white border-[1px]': state.focus,
        'border-[#2A2E33] border-[1px]': !state.focus,
      }"
    >
      <div class="flex-1 min-w-0 mr-4 relative h-9">
        <input
          ref="searchInput"
          class="text-xs py-2 w-full h-full placeholder-[#ffffff4d] bg-transparent border-none"
          type="text"
          placeholder="Search"
          v-model="state.searchKey"
          @focus="state.focus = true"
          @blur="state.focus = false"
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

    <div class="flex-1 min-h-0">
      <div
        class="text-[#ffffff4d] h-12 flex items-center justify-center"
        v-if="state.loading"
      >
        <img class="w-5 h-5" src="@/assets/svgs/spin.svg" alt="" />
      </div>

      <div
        class="text-[#ffffff4d] h-12 flex items-center"
        v-if="state.searchKey && state.searchList.length == 0"
      >
        Not found any results～
      </div>

      <div
        class="w-full h-full overflow-y-scroll"
        v-if="!state.loading && state.searchList.length > 0"
      >
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

      <div v-if="state.searchList.length == 0">
        <div class="mb-2">🔥 Popular</div>
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
  </div>
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
  router.push(`/Collectables/${item.path}`);
};

// TODO 热度列表元素只会在加载的时候进行请求，其他不进行更新
onMounted(() => {
  state.focus = true;
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
