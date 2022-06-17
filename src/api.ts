import { passHttp } from "./request";

export const searchProject = async (key: string, cancel = false) => {
  const res = await passHttp.get(
    "/nftvalue/search",
    {
      params: {
        search: key,
      },
    },
    cancel
  );

  return key ? res : res.slice(0, 5);
};

enum VaultType {
  ART = "ART",
  COLLECTABLES = "COLLECTABLES",
}

export const getVaultList = (type: VaultType, cancel = false) =>
  passHttp.get(
    "/nftvalue/home",
    {
      params: {
        type,
      },
    },
    cancel
  );

export const getProjectInfoById = (id: number) =>
  passHttp.get("/nftvalue/project/info", {
    id,
  });
export const getProjectInfoByName = (name: string) =>
  passHttp.get("/nftvalue/project/info", {
    name,
  });
export const getTokenListByCid = (cid: string) =>
  passHttp.get(`/nftvalue/project/token/owner/${cid}`);
