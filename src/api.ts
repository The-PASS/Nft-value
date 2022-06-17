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

  return key ? res : (res || []).slice(0, 5);
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

export const getProjectInfoById = (id: number | string) =>
  passHttp.get("/nftvalue/project/info", {
    params: {
      id,
    },
  });
export const getProjectInfoByName = (name: string) =>
  passHttp.get("/nftvalue/project/info", {
    params: {
      name,
    },
  });
export const getTokenListByCid = (cid: string | number) =>
  passHttp.get(`/nftvalue/project/tokens/${cid}`);

export const getTokenRanks = (
  contractId: string | number,
  tokenId: string | number
) =>
  passHttp.get(`/nftvalue/project/token/info/${contractId}`, {
    params: {
      tokenId,
    },
  });

export const getProjectDetails = async (id: string | number) => {
  const baseInfo = await getProjectInfoById(id);
  const tokenList =
    ((await getTokenListByCid(baseInfo.bprojectContractId)) || {}).records ||
    [];
  const holderList: any[] = [];
  const ranks = await getTokenRanks(baseInfo.bprojectContractId, id);

  const owers = holderList.reduce((a: any, b: any) => {
    return a + b.numberOwned;
  }, 0);
  baseInfo.holderNumber = owers;
  baseInfo.holders = holderList;
  baseInfo.ranks = ranks;
  baseInfo.tokenList = tokenList;
  return baseInfo;
};
