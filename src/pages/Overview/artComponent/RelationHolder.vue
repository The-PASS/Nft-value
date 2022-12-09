<template>
  <div
    class="w-full rounded absolute top-0 left-0"
    style="height: 448px"
    ref="container"
  >
    <div id="3d-graph" class="w-full"></div>

    <transition name="fade">
      <div
        class="absolute top-0 left-0 w-full h-full"
        style="background: #121416b3"
        v-if="state.show"
      >
        <div
          class="w-full h-full flex items-center justify-center"
          v-if="loadingx"
        >
          <Spin style="width: 2em; height: 2em"></Spin>
        </div>

        <div
          class="flex flex-col md:flex-row h-full justify-center items-center"
          v-else
        >
          <UiImg
            class="w-60 h-60 rounded overflow-hidden md:mr-12"
            :src="state.current.img || require('@/assets/icons/nftnologo.png')"
          ></UiImg>

          <div
            class="p-6 space-y-2 w-full md:w-1/2 mt-4 md:mt-0"
            style="
              background: rgba(18, 20, 22, 0.8);
              border-radius: 8px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              min-height: 240px;
            "
          >
            <div class="flex justify-between items-center">
              <router-link
                class="link-hover"
                v-if="state.current.elType == 0"
                :to="`/dao/${state.current.daoPath}`"
              >
                {{ state.current.name }}
              </router-link>

              <a
                class="link-hover"
                :href="getLink(state.current.artistPath)"
                target="_blank"
                v-else
                >{{ state.current.name }}</a
              >

              <div class="flex">
                <a
                  class="px-2 py-0.5 rounded transition-all hover:bg-pass-border"
                  :href="state.current.twitter"
                  target="_blank"
                  v-if="state.current.twitter"
                  ><i class="iconfont icon-Twitterlanse-40 text-xl"></i
                ></a>

                <a
                  class="px-2 py-0.5 rounded transition-all hover:bg-pass-border"
                  :href="state.current.website"
                  target="_blank"
                  v-if="state.current.website"
                >
                  <i class="iconfont icon-wangzhi-43 text-xl"></i>
                </a>
              </div>
            </div>

            <div
              class="px-4 py-0.5 text-xs"
              v-if="state.current.elType == 0"
              style="
                border-radius: 4px;
                border: 1px solid #5e6873;
                width: fit-content;
              "
            >
              {{ state.current.daoType }}
            </div>

            <div v-if="state.current.elType == 0" class="flex space-x-2 pb-2">
              <div
                class="px-2 text-xs"
                style="background: rgba(255, 255, 255, 0.1); border-radius: 2px"
                v-for="(_, i) in state.current.daoTag"
                :key="i"
              >
                #{{ _ }}
              </div>
            </div>

            <div class="text-xs pb-2" style="word-break: break-all">
              {{ state.current.intro }}
            </div>

            <div v-if="state.current.elType == 1" class="space-y-2">
              <div
                v-for="({ name, value, type }, i) in [
                  { name: 'Price', value: state.current.range.join(' ~ ') },
                  {
                    name: 'Related DAOS',
                    value: state.current.daoInfos,
                    type: 'dao',
                  },
                  {
                    name: 'Collected Artworks',
                    value: state.current.artworkes,
                  },
                  {
                    name: 'Collected Value',
                    value: `$${localeNumber(state.current.valueUsd)}`,
                  },
                ]"
                :key="i"
                class="flex items-center"
              >
                <span class="text-white-070 mr-2">{{ name }}:</span>
                <span class="font-bold" v-if="type != 'dao'">{{ value }}</span>

                <div v-else>
                  <div class="flex items-center">
                    <VMenu
                      :delay="{ hide: 0 }"
                      placement="top"
                      :autoHide="false"
                      :arrowOverflow="true"
                    >
                      <div class="flex items-center">
                        <UiImg
                          v-for="(dao, j) in value.slice(0, 3)"
                          :key="j"
                          class="h-8 w-8 overflow-hidden rounded-full"
                          :src="
                            dao.daoLogo ||
                            require('@/assets/icons/nftnologo.png')
                          "
                          :style="{
                            marginLeft: j != 0 ? -12 + 'px' : undefined,
                          }"
                        ></UiImg>

                        <div
                          class="w-2 h-2 rounded-full bg-gradientRed -ml-1"
                          v-if="value.length > 2"
                        ></div>

                        <div v-if="value.length > 2" class="font-bold">
                          +{{ value.length }}
                        </div>
                      </div>

                      <template #popper>
                        <div class="flex items-center space-x-2">
                          <div v-for="(dao, j) in value" :key="j">
                            <router-link :to="`/dao/${dao.daoPath}`">
                              <UiImg
                                class="h-8 w-8 overflow-hidden rounded-full"
                                :src="
                                  dao.daoLogo ||
                                  require('@/assets/icons/nftnologo.png')
                                "
                              ></UiImg>
                            </router-link>
                          </div>
                        </div>
                      </template>
                    </VMenu>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <span class="text-white-070 mr-2">Collected Value:</span>
              <span class="font-bold">{{
                `$${localeNumber(state.current.valueUsd)}`
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="absolute top-6 right-10 w-6 h-6 rounded-full flex justify-center items-center transition-all transform hover:scale-125 cursor-pointer"
          @click="onClose"
          style="background: #ffffff1a"
        >
          <i class="iconfont icon-guanbi text-xs"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import ForceGraph from "3d-force-graph";
import * as THREE from "three";
import { queryArtistRank, queryArtistDetail } from "@/api/common";
import { useReqByBool } from "@/hooks";
import { useElementSize } from "@vueuse/core";
import { onMounted, ref, watch, reactive, defineProps } from "vue";
import { Skeletor } from "vue-skeletor";
import Spin from "@/components/Spin.vue";
import gData from "@/x.json";
import { localeNumber } from "@/utils";
import UiImg from "@/components/UiImg.vue";

const container = ref(null);

const { width, height } = useElementSize(container);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  data: [],
  show: false,
  current: null,
});

const Graph = ref(null);

const getGdata = () => {
  const nodes = [];
  const links = [];
  const daoMap = {};
  const artists = [];
  let daoIndex = 0;

  const data = JSON.parse(JSON.stringify(props.data));

  // console.log('props.data', props.data);

  data.forEach((x, i) => {
    console.log(x);

    nodes.push({
      id: i,
      name: x.artistFullName,
      img: x.artistLogo || require("@/assets/icons/nftnologo.png"),
      image: x.artistThumbLogo,
      twitter: x.artistTwitter,
      valueUsd: x.artistTotalUsd,
      intro: x.artistIntroduction,
      artworkes: x.artWorkCount,
      daoInfos: x.daoInfo || [],
      artistPath: x.artistName,
      range: [
        "$" + localeNumber(x.minArtworkValue, 2),
        "$" + localeNumber(x.maxArtworkValue, 2),
      ],
      elType: 1,
    });
    x.daoInfo.forEach((dao) => {
      if (!daoMap[dao.daoName]) {
        daoMap[dao.daoName] = data.length + daoIndex++;
        nodes.push({
          id: daoMap[dao.daoName],
          name: dao.daoName,
          img: dao.daoLogo || require("@/assets/icons/nftnologo.png"),
          requestId: dao.daoId,
        });
      }

      links.push({
        source: daoMap[dao.daoName],
        target: i,
      });
    });
  });

  return {
    links,
    nodes,
  };
};

const position = ref({});

const initGrapy = () => {
  // console.log(links, nodes);

  const gData = getGdata();

  const Graphx = ForceGraph()(document.getElementById("3d-graph"));
  Graphx.graphData(gData)
    .backgroundColor("#00001100")
    .width(width.value)
    .height(height.value)
    .showNavInfo(false)
    .nodeThreeObject(({ img, image }) => {
      const imgTexture = new THREE.TextureLoader().load(image || img);
      const material = new THREE.SpriteMaterial({ map: imgTexture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(12, 12);
      return sprite;
    })
    .linkOpacity(0.1)
    .onNodeClick((node) => {
      const { x, y, z } = node;
      const k = 1.05;

      position.value = { x, y, z };

      Graphx.cameraPosition(
        { x: x * k, y: y * k, z: z * k },
        { x: 0, y: 0, z: 0 },
        1500
      );

      setTimeout(async () => {
        loadDatax(node);
      }, 1500);
    })
    .d3Force("link")
    .distance(500);
  Graphx.controls().maxDistance = 2000;
  console.log([Graphx]);
  Graph.value = Graphx;
};

/*
    // origin
        // Graphx.cameraPosition(
        //   { x: 0, y: 0, z: 1000 },
        //   { x: 0, y: 0, z: 0 },
        //   3000,
        // );
   */

watch(
  () => [width.value, height.value],
  () => {
    if (Graph.value) {
      Graph.value.width(width.value).height(height.value);
    }
  }
);

watch(
  () => props.data,
  () => {
    if (props.data && props.data.length > 0 && Graph.value) {
      const gData = getGdata();
      Graph.value.graphData(gData);
    }
  }
);

const onClose = () => {
  state.show = false;
  const k = 2;
  const { x, y, z } = position.value;
  Graph.value.cameraPosition(
    { x: x * k, y: y * k, z: z * k },
    { x: 0, y: 0, z: 0 },
    1500
  );
};

const { loadData: loadDatax, loading: loadingx } = useReqByBool(
  async (node) => {
    state.current = {};
    state.show = true;

    let daoInfo = {};

    if (node.requestId) {
      const res = await queryArtistDetail(node.requestId);
      const {
        name,
        logo: img,
        daoType,
        daoTag,
        twitter,
        website,
        daoPath,
        totalValueUsd: valueUsd,
        intro,
      } = res.data;
      daoInfo = {
        name,
        img,
        daoType,
        daoTag,
        twitter,
        website,
        daoPath,
        valueUsd,
        elType: 0,
        intro,
      };
    }
    state.current = { ...node, ...daoInfo };
  }
);

// const { loadData, loading } = useReqByBool(async () => {
//   const res = await queryArtistRank();
//   state.data = res.data;
// });

const getLink = (path) => {
  return `${process.env.VUE_APP_VAULT_PATH}/#/Art/${path}`;
};

onMounted(async () => {
  // await loadData();
  initGrapy();
});
</script>

<style scoped>
.bgg {
  background: linear-gradient(180deg, #262626 0, #121416 100%);
}
.link-hover:hover {
  color: #26aaffff;
  text-decoration: underline;
}
</style>
