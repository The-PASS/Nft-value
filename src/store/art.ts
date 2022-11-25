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
  getArtTxRecord,
} from "@/api";
import { number } from "echarts/core";

const versionString =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_VERSION + "-dev"
    : import.meta.env.VITE_APP_VERSION;

const defaultDashboard = (): any => ({
  baseInfo: {},
  selectedArtwork: {},
  singleList: [],
  editionList: [],
  singleValueType: "",
  editionValueType: "",
  selectedEvaType: 0,
});

export const useArtStore = defineStore("Art", {
  state: () => defaultDashboard(),
  actions: {
    async loadInfo(name: string) {
      const res = await getArtInfo(name);
      this.baseInfo = { ...this.baseInfo, ...res };
    },
    async loadEvaList(name: string) {
      const res = await getArtTxRecord(name, true);
      this.singleList = res[0];
      this.editionList = res[1];
    },
    selectToken(artwork: any) {
      if (artwork.tokenId == this.selectedArtwork.tokenId) {
        this.selectedArtwork = {};
      } else {
        this.selectedArtwork = artwork;
        this.singleValueType = artwork.valueType;
        this.editionValueType = artwork.valueType;
      }
    },
    selectTx(tx: any) {
      const isClose = tx.valueType == this.curType;
      if (this.evaTypes[this.selectedEvaType] == "Single") {
        this.singleValueType = isClose ? "" : tx.valueType;
      } else {
        this.editionValueType = isClose ? "" : tx.valueType;
      }
    },
    resetDashboard() {
      const fallback = defaultDashboard();

      Object.entries(fallback).forEach((xkey: any, xvalue: any) => {
        (this as any)[xkey] = xvalue;
      });
    },
  },

  getters: {
    evaTypes() {
      const res = [];
      if (this.selectedArtwork.valueType) {
        if (
          this.singleList.findIndex(
            (x: any) => x.valueType == this.selectedArtwork.valueType
          ) != -1
        ) {
          res.push("Single");
        } else if (
          this.editionList.findIndex(
            (x: any) => x.valueType == this.selectedArtwork.valueType
          ) != -1
        ) {
          res.push("Edition");
        }
      } else {
        if (this.singleList.length > 0) {
          res.push("Single");
        }
        if (this.editionList.length > 0) {
          res.push("Edition");
        }
      }

      return res;
    },
    evaList() {
      const type = this.evaTypes[this.selectedEvaType];
      let list: any = type == "Single" ? this.singleList : this.editionList;

      if (this.selectedArtwork.valueType) {
        const index = this.singleList.findIndex(
          (x: any) => x.valueType == this.selectedArtwork?.valueType
        );
        if (index != -1) {
          list = [this.singleList[index]];
        }
        const xindex = this.editionList.findIndex(
          (x: any) => x.valueType == this.selectedArtwork?.valueType
        );

        if (xindex != -1) {
          list = [this.editionList[xindex]];
        }
      }

      return list;
    },
    curType(): any {
      const type = this.evaTypes[this.selectedEvaType];
      console.log(
        type == "Single",
        this.singleValueType,
        this.editionValueType
      );
      return type == "Single" ? this.singleValueType : this.editionValueType;
    },
    curEvaType(): any {
      const type = this.evaTypes[this.selectedEvaType];
      return type == "Single" ? 0 : 1;
    },
  },
});
