import { defineStore } from "pinia";
import {
  getProjectInfoById,
  getTokenList,
  getTokenRanks,
  getBoardOwnerList,
  getBoardTraitHistory,
  getProjectInfoByPath,
  getArtInfo,
  getArtwork,
} from "@/api";
import { number } from "echarts/core";

const versionString =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_VERSION + "-dev"
    : import.meta.env.VITE_APP_VERSION;

const defaultDashboard = (): any => ({
  baseInfo: {},
  infoLoading: true,
  selectedArtwork: {},
  selectedTx: {},
});

export const useArtStore = defineStore("Art", {
  state: () => defaultDashboard(),
  actions: {
    async loadInfo(name: string) {
      this.infoLoading = true;
      const res = await getArtInfo(name);
      this.baseInfo = { ...this.baseInfo, ...res };
      this.infoLoading = false;
    },
    selectToken(artwork: any) {
      if (artwork.tokenId == this.selectedArtwork.tokenId) {
        this.selectedArtwork = {};
      } else {
        this.selectedArtwork = artwork;
      }
    },
    selectTx(tx: any) {
      if (tx.valueType == this.selectedTx.valueType) {
        this.selectedTx = {};
      } else {
        this.selectedTx = tx;
      }
    },
    resetDashboard() {
      const fallback = defaultDashboard();

      Object.entries(fallback).forEach((xkey: any, xvalue: any) => {
        (this as any)[xkey] = xvalue;
      });
    },
  },

  getters: {},
});
