import dayjs from "dayjs";
import { passHttp } from "./request";

export const searchProject = async (key: string, cancel = false) => {
  let res = await passHttp.get(
    "/nftvalue/search",
    {
      params: {
        search: key,
      },
    },
    cancel
  );

  res = res.filter((x: any) => x != null);

  return key ? res : (res || []).slice(0, 5);
};

enum VaultType {
  ART = "ART",
  COLLECTABLES = "COLLECTABLES",
}

export const getVaultList = async (type: VaultType, cancel = false) => {
  const res = (
    await passHttp.get(
      "/nftvalue/home",
      {
        params: {
          type,
        },
      },
      cancel
    )
  ).filter((x: any) => x != null);

  res.forEach((el: any) => {
    el.volumeRate = (el.volumeRate * 100).toFixed(2);
    el.marketCap = (el.marketCap || 0).toFixed(2);
    el.volume = (el.volume || 0).toFixed(2);
    el.floorPrice = (el.floorPrice || 0).toFixed(2);
  });

  return res;
};

export const getProjectInfoById = async (id: number | string) => {
  const res = await passHttp.get("/nftvalue/project/info", {
    params: {
      id,
    },
  });

  res.marketCap = res.marketCap.toFixed(2);
  return res;
};

export const getProjectInfoByName = async (name: string) => {
  const res = await passHttp.get("/nftvalue/project/info", {
    params: {
      name,
    },
  });

  res.marketCap = res.marketCap.toFixed(2);
  return res;
};

export const getProjectInfoByPath = async (path: string) => {
  const res = await passHttp.get("/nftvalue/project/info", {
    params: {
      path,
    },
  });

  console.log(res);

  res.marketCap = res.marketCap.toFixed(2);
  return res;
};

export const getTokenList = async (
  pid: string | number,
  page = 1,
  options = {},
  cancel = false
) => {
  try {
    const res = await passHttp.get(
      `/nftvalue/project/tokens/${pid}`,
      {
        params: {
          pageSize: 16,
          page,
          ...options,
        },
      },
      cancel
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTokenRanks = (
  pid: string | number,
  tokenId?: string | number,
  page = 1,
  cancel = false
) =>
  passHttp.get(
    `/nftvalue/project/token/info/${pid}`,
    {
      params: {
        tokenId,
        page,
      },
    },
    cancel
  );

export const getBoardOwnerList = async (pid: string | number, page = 1) => {
  const res = await passHttp.get(`/nftvalue/project/token/owner/${pid}`, {
    params: {
      page,
    },
  });
  return res;
};

export const getBoardTraitHistory = (pid: any, traitType: any, value: any) =>
  passHttp.get(`/nftvalue/project/token/trades/${pid}`, {
    params: {
      traitType,
      value,
    },
  });

export const getBoardTradeHistory = async (
  pid: number | string,
  size = 365
) => {
  const res = await passHttp.get(`/nftvalue/project/bottom/chart/${pid}`, {
    params: {
      size,
    },
  });

  res.maxPriceRate = (res.maxPriceRate * 100).toFixed(2);
  res.medianRate = (res.medianRate * 100).toFixed(2);
  res.minPriceRate = (res.minPriceRate * 100).toFixed(2);
  res.volumeRate = (res.volumeRate * 100).toFixed(2);
  res.transactionsRate = (res.transactionsRate * 100).toFixed(2);

  res.maxPrice = +res.maxPrice.toFixed(4);
  res.minPrice = +res.minPrice.toFixed(4);
  res.volume = +res.volume.toFixed(4);
  res.median = +res.median.toFixed(4);

  res.datas.forEach((x: any) => {
    if (x.ctime == 1644796800000) {
      console.log(x.id);
    }
    x.ctime = dayjs(x.ctime).format("YYYY MMM DD");
  });

  res.datas.shift();

  return res;
};
