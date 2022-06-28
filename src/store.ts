import { defineStore } from "pinia";
import {
  getProjectInfoById,
  getTokenList,
  getTokenRanks,
  getBoardOwnerList,
  getBoardTraitHistory,
} from "@/api";

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
  tokenList: [],
  ownerList: [],
  traitList: [],
  traitHistory: [],
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
      const res = await getProjectInfoById(id);
      this.dashboard = { ...this.dashboard, ...res };
      this.loading.dashboardInfo = false;
    },
    async loadBoardTokenList(id: any) {
      const tokenls = await getTokenList(id);
      this.dashboard.tokenList = tokenls;

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
      /*  */
    },
    async loadBoardTraitHistory(pid: any, traitType: any, value: any) {
      /*  */
    },
    resetDashboard() {
      this.dashboard = defaultDashboard();
    },
  },

  getters: {
    isReady: (state) => {
      return !state.isInitialized;
    },
  },
});
