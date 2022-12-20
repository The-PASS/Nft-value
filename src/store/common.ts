import { defineStore } from "pinia";

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
