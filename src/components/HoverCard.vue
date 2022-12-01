<template>
  <ui-tippyer
    :arrow="false"
    interactive
    trigger="click"
    :maxWidth="600"
    placement="right-start"
    :popperOptions="{ escapeWithReference: false }"
    theme="tomato"
  >
    <slot></slot>

    <template #content>
      <div class="p-6 flex w-auto z-30">
        <ui-img
          class="w-64 h-64 rounded overflow-hidden mr-6 flex-shrink-0"
          :src="info.logo"
        ></ui-img>
        <div class="space-y-[10px] text-sm w-80">
          <div class="font-bold flex items-center">
            {{ info.tokenName }}
            <img class="w-6 h-6 ml-2" :src="OpenSeaImg" />
          </div>
          <div class="flex justify-between">
            <div class="font-bold">
              <iconfont-icon name="icon-jiazhi" class="text-xs mr-1" />
              Valuation :
            </div>
            <span>
              <EthText>
                {{ info.valuation }}
              </EthText>
            </span>
          </div>
          <div class="flex justify-between">
            <div class="font-bold">
              <iconfont-icon name="icon-biaoji" class="text-xs mr-1" />
              Last price :
            </div>
            <span
              class="link-hover text-[#26AAFFFF]"
              @click="
                toExploreAddress(
                  info.transactionHash,
                  info.chain.toUpperCase(),
                  'tx'
                )
              "
            >
              <EthText>
                {{ info.lastPrice }}
              </EthText>
            </span>
          </div>
          <div class="font-bold">
            <iconfont-icon name="icon-xiangqing" class="text-xs mr-1" />
            Details
          </div>
          <div class="flex justify-between">
            <div class="text-[#FFFFFFB3]">Contract Address</div>
            <div
              class="text-[#26AAFFFF] link-hover"
              @click="
                toExploreAddress(info.tokenAddress, info.chain.toUpperCase())
              "
            >
              {{ formatAddress(info.tokenAddress, 4) }}
            </div>
          </div>
          <div class="flex justify-between">
            <div class="text-[#FFFFFFB3]">Token ID</div>
            <div
              class="hover:underline cursor-pointer"
              @click="
                jumpTokenId(
                  info.tokenId,
                  info.chain.toLowerCase(),
                  info.tokenAddress
                )
              "
            >
              {{ info.tokenId }}
            </div>
          </div>
          <div class="flex justify-between">
            <div class="text-[#FFFFFFB3]">Token Standard</div>
            <div>{{ info.contractType }}</div>
          </div>
          <div class="flex justify-between">
            <div class="text-[#FFFFFFB3]">Blockchain</div>
            <div class="text-[#26AAFFFF]">{{ info.chain }}</div>
          </div>
          <div class="flex justify-between">
            <div class="text-[#FFFFFFB3]">Metadata</div>
            <div class="text-[#26AAFFFF] link-hover" @click="jump(info)">
              metadata
            </div>
          </div>
        </div>
      </div>
    </template>
  </ui-tippyer>
</template>

<script setup>
import { formatAddress, toExploreAddress, jumpTokenId } from "@/utils";
import OpenSeaImg from "@/assets/images/opensea.png";

const container = ref(null);

const state = reactive({
  show: false,
});

defineProps({
  info: Object,
});

const enter = () => {
  state.show = true;
};

const leave = () => {
  state.show = false;
};

const jump = (info) => {
  if (info.metadataUri) window.open(info.metadataUri, "_blank");
};

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
