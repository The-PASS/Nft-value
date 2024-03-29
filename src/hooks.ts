import { defineProps, defineEmits } from "vue";

export const useReqPages = (req: any) => {
  const loading = ref(0);
  const isEnd = ref(false);
  const isEmpty = ref(false);
  const current = ref(0);
  const next: any = ref(1);
  const rows = ref(-1);
  const total = ref(-1);
  const pages = ref(-1);
  const results: any = ref([]);

  const loadNext = async (cancel = false) => {
    if (isEnd.value) {
      return;
    }
    current.value = next.value;

    loading.value++;
    let result = null;
    try {
      result = await req(current.value, cancel);
    } catch (error) {
      // console.log(error);
    }

    if (!result) {
      loading.value--;
      return;
    }

    next.value = current.value + 1;
    rows.value = result.size;
    total.value = result.total;
    pages.value = result.pages;

    if (current.value === 1) {
      results.value = result.records;
    } else {
      results.value = [...results.value, ...result.records];
    }

    if (results.value.length == 0) {
      isEmpty.value = true;
    }

    if (next.value > pages.value) {
      next.value = null;
      isEnd.value = true;
    }
    loading.value--;
  };

  const loadRest = async (cancel = false) => {
    current.value = 0;
    next.value = 1;
    isEnd.value = false;
    results.value = [];
    isEmpty.value = false;
    await loadNext(cancel);
  };

  return {
    isEnd,
    loading,
    current,
    next,
    rows,
    total,
    results,
    loadNext,
    loadRest,
  };
};

export const useDesktop = () => {
  const isLargeScreen = useMediaQuery("(min-width: 768px)");
  return isLargeScreen;
};

export const useSideBar = (onChange: any) => {
  const props: any = defineProps({
    tabs: Array,
    modelValue: { type: Number, default: 0 },
  });

  const comState = reactive({
    selectIndex: 0,
  });

  const $emits = defineEmits(["update:modelValue"]);

  const onSelect = (i: any) => {
    if (props.tabs[i].disabled) {
      return;
    }
    comState.selectIndex = i;
  };

  watch(
    () => comState.selectIndex,
    (val) => {
      onChange && onChange(val);
      $emits("update:modelValue", val);
    }
  );

  // watch(
  //   () => props.modelValue,
  //   (val) => (comState.selectIndex = val)
  // );

  return {
    props,
    $emits,
    comState,
    onSelect,
  };
};

export const useReqByBool = (req: any) => {
  const loading = ref(true);

  const loadData = async (...args: any) => {
    loading.value = true;
    try {
      const res = await req(...args);
      loading.value = false;
      return res;
    } catch (error) {
      loading.value = false;
    }
  };

  return {
    loading,
    loadData,
  };
};
