<template>
  <div class="p-4 flex w-auto z-30 bg-[#FFFFFF0D]">
    <ui-img
      class="w-48 h-48 rounded overflow-hidden mr-6 flex-shrink-0"
      :src="info.image || dpng"
    ></ui-img>
    <div class="text-xs flex-1 min-w-0">
      <div class="font-bold text-sm flex items-center mb-2">
        {{ info.tokenName }}
        <img
          class="w-5 h-5 ml-2 cursor-pointer"
          :src="$route.params.chain == 'tezos' ? TezosImg : OpenSeaImg"
          @click="
            jumpTokenId(
              info.tokenId,
              info.chain.toLowerCase(),
              info.tokenAddress
            )
          "
        />
      </div>

      <div class="font-bold">
        <span class="pr-2 text-[#FFFFFF66]">|</span>
        Details
      </div>

      <div class="flex justify-between">
        <div class="text-[#FFFFFF66]">Token Standard</div>
        <div>{{ info.contractType }}</div>
      </div>

      <div class="flex justify-between">
        <div class="text-[#FFFFFF66]">Blockchain</div>
        <div>{{ info.chain }}</div>
      </div>

      <div class="flex justify-between">
        <div class="text-[#FFFFFF66]">Contract Address</div>
        <div
          :class="{
            'text-[#26AAFFFF] link-hover': info.tokenAddress,
          }"
          @click="toExploreAddress(info.tokenAddress, info.chain.toUpperCase())"
        >
          {{ formatAddress(info.tokenAddress, 4) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="text-[#FFFFFF66]">Token ID</div>
        <div
          :class="{
            'text-[#26AAFFFF] link-hover': info.tokenId,
          }"
          @click="
            jumpChainTokenId(
              info.tokenAddress,
              info.tokenId,
              info.chain.toLowerCase()
            )
          "
        >
          #{{ info.tokenId }}
        </div>
      </div>

      <div class="flex justify-between">
        <div class="text-[#FFFFFF66]">Metadata</div>
        <div
          :class="{
            'text-[#26AAFFFF] link-hover': info.metadataUri,
          }"
          @click="jump(info)"
          v-if="info.metadataUri"
        >
          metadata
        </div>
      </div>

      <div class="flex justify-between">
        <div class="font-bold">
          <span class="pr-2 text-[#FFFFFF66]">|</span> Platform:
        </div>
        <span>
          {{ info.plat }}
        </span>
      </div>

      <div class="flex justify-between">
        <div class="font-bold">
          <span class="pr-2 text-[#FFFFFF66]">|</span> Last price:
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
          <EthText iconClass="text-xs">
            {{ info.lastPrice }}
          </EthText>
        </span>
      </div>

      <div class="flex justify-between">
        <div class="font-bold">
          <span class="pr-2 text-[#FFFFFF66]">|</span> Evaluation:
        </div>
        <span>
          <EthText iconClass="text-xs">
            {{ info.valuation }}
          </EthText>
        </span>
      </div>

      <div class="flex justify-between">
        <div></div>
        <div class="text-[#FFFFFF66]">
          {{ formatDate(info.transactionTime, "YYYY-MM-DD HH:mm") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  formatAddress,
  toExploreAddress,
  jumpTokenId,
  jumpChainTokenId,
  formatDate,
} from "@/utils";
import OpenSeaImg from "@/assets/images/opensea.png";
import dpng from "@/assets/images/nftnologo.png";
import TezosImg from "@/assets/images/objkt.png";

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

<style scoped></style>
