<template>
  <div class="flex-1 mr-6" style="height: 364px">
    <ui-scrollbars class="w-full h-full">
      <table class="w-full text-[#5E6873] sticky top-0 bg-wall">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 16%" />
          <col style="width: 10%" />
          <col style="width: 14%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead class="text-left">
          <th style="width: 20%">Type</th>
          <th style="width: 16%">Value</th>
          <th style="width: 10%">Rarity</th>
          <th style="width: 14%">
            <div class="flex items-center">
              Rank
              <tippy content="Based on history trade weights.">
                <iconfont-icon
                  name="icon-tishi"
                  class="text-white ml-2"
                ></iconfont-icon
              ></tippy>
            </div>
          </th>
          <th style="width: 20%">Price by history</th>
          <th class="w-[20%]">Price by floor</th>
        </thead>
      </table>
      <table class="w-full">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 16%" />
          <col style="width: 10%" />
          <col style="width: 14%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <tbody>
          <tr
            class="h-11"
            v-for="(item, i) in store.dashboard.traitList"
            :key="i"
          >
            <td class="text-left w-[20%]">
              {{ item.traitType }}
            </td>
            <td class="text-left w-[16%]">
              <div class="line-clamp-1">
                {{ item.value }}
              </div>
            </td>
            <td class="w-[w-[20%]]x">{{ item.rarity }}</td>
            <td class="w-[14%]">{{ item.rank }}</td>
            <td class="w-[20%]">
              <div class="flex items-center">
                <iconfont-icon name="icon-ETH" class="mr-2"></iconfont-icon>
                {{ item.history }}
              </div>
            </td>
            <td class="w-[20%]">
              <div class="flex items-center">
                <iconfont-icon name="icon-ETH" class="mr-2"></iconfont-icon>
                {{ item.floor }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </ui-scrollbars>
  </div>
</template>

<script setup>
const store = useStore();

const pid = inject("pid");

onMounted(() => {
  store.loadBoardTraitList(pid, "29");
});
</script>

<style lang="scss" scoped></style>
