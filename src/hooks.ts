export const useReqPages = (req: any) => {
  const loading = ref(0);
  const isEnd = ref(false);
  const current = ref(0);
  const next: any = ref(1);
  const rows = ref(-1);
  const total = ref(-1);
  const pages = ref(-1);
  const results: any = ref([]);

  const loadNext = async () => {
    if (isEnd.value) {
      return;
    }
    current.value = next.value;

    loading.value++;
    let result = null;
    try {
      result = await req(current.value);
      console.log(result);
    } catch (error) {
      /*  */
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

    if (next.value > pages.value) {
      next.value = null;
      isEnd.value = true;
    }
    loading.value--;
  };

  const loadRest = () => {
    current.value = 0;
    next.value = 1;
    isEnd.value = false;
    results.value = [];
    loadNext();
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
