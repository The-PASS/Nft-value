import { defineStore } from "pinia";
import {
  getProjectInfoById,
  getTokenList,
  getTokenRanks,
  getBoardOwnerList,
  getBoardTraitHistory,
  getProjectInfoByPath,
} from "@/api";
import { number } from "echarts/core";

const versionString =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_VERSION + "-dev"
    : import.meta.env.VITE_APP_VERSION;

const defaultDashboard = () => ({
  id: "",
  projectName: "",
  logo: "",
  des: "",
  volume: 0,
  volumeRate: 0,
  floorPrice: 0,
  marketCap: 0,
  owners: 0,
  items: 0,
  tokenList: [],
  ownerList: [],
  traitList: [],
  traitHistoryIndex: 0,
  traitType: "",
  traitValue: "",
  traitHistory: {
    trades: [],
    cutData: {},
  },
  tokenId: "",
});

export const useStore = defineStore("main", {
  state: () => ({
    debug: import.meta.env.MODE === "development",
    version: versionString,
    isInitialized: false,
    count: 0,
    dashboard: defaultDashboard(),
    loading: {
      dashboardInfo: true,
      dashboardWhales: true,
      dashboardTraitHistory: true,
    },
  }),

  actions: {
    initApp() {
      this.isInitialized = true;
      console.log("app initialized!");
    },

    increment(value = 1) {
      this.count += value;
    },
    async loadBoardBaseInfo(id: any) {
      this.loading.dashboardInfo = true;
      const res = await getProjectInfoByPath(id);
      this.dashboard = { ...this.dashboard, ...res };
      this.loading.dashboardInfo = false;
    },
    async loadBoardTokenList(id: any) {
      const tokenls = await getTokenList(id);
      this.dashboard.tokenList = tokenls;

      console.log(tokenls);

      if (tokenls.length > 0) {
        const traits = await getTokenRanks(id, tokenls[0]);
        this.dashboard.traitList = traits;
        if (traits.length > 0) {
          const x = await getBoardTraitHistory(
            id,
            traits[0].traitType,
            traits[0].value
          );
          this.dashboard.traitHistory = x;
        }
      }
    },
    async loadBoardOwnerList(pid: any, page: number) {
      const res = await getBoardOwnerList(pid, page);
      this.dashboard.ownerList = res;
    },
    async loadBoardTraitList(id: any, tokenId: any) {
      const traits = await getTokenRanks(id, tokenId);
      this.dashboard.traitList = traits;
      this.loadBoardTraitHistory(id, traits[0].traitType, traits[0].value);
    },
    async loadBoardTraitHistory(pid: any, traitType: any, value: any) {
      this.loading.dashboardTraitHistory = true;
      const x = await getBoardTraitHistory(pid, traitType, value);
      this.dashboard.traitHistory = x;
      this.loading.dashboardTraitHistory = false;
    },
    selectTraits(type: string, value: string) {
      this.dashboard.traitType = type;

      this.dashboard.traitValue = value;

      this.loadBoardTraitHistory(this.dashboard.id, type, value);
    },
    selectToken(tokenId: string) {
      if (this.dashboard.tokenId == tokenId) {
        this.dashboard.tokenId = "";
        return;
      }
      this.dashboard.tokenId = tokenId;
    },
    resetDashboard() {
      this.dashboard = defaultDashboard();
      this.loading.dashboardInfo = true;
    },
  },

  getters: {
    isReady: (state) => {
      return !state.isInitialized;
    },
  },
});
