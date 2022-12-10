import { defineStore } from "pinia";

const versionString =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_VERSION + "-dev"
    : import.meta.env.VITE_APP_VERSION;

const defaultDashboard = (): any => ({
  chain: "ethereum",
});

export const useCommonStore = defineStore("Common", {
  state: () => defaultDashboard(),
  actions: {
    setChain(chain: string) {
      this.chain = chain;
    },
  },
});
