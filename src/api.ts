import dayjs from "dayjs";
import { isAddress } from "ethers/lib/utils";
import { passHttp } from "./request";

export const searchProject = async (
  key: string,
  type = "Collectables",
  cancel = false
) => {
  let res = await passHttp.get(
    "/nftvalue/search",
    {
      params: {
        search: key,
        type,
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

export const getVaultList = async (
  page = 1,
  type: VaultType,
  sortConfig = {},
  cancel = false
) => {
  const res = await passHttp.get(
    "/nftvalue/home",
    {
      params: {
        type,
        page,
        pageSize: 20,
        ...sortConfig,
      },
    },
    cancel
  );

  res.records = res.records.filter((x: any) => x != null);

  res.records.forEach((el: any) => {
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

/* Art */
export const getArtistDao = async (creatorName: string) =>
  passHttp.get("/artist/collectedDao", {
    params: {
      creatorName,
    },
  });

export const getArtInfo = async (name: string) => {
  const res = await passHttp.get("/artist/info", {
    params: {
      name,
    },
  });

  const ethAddress: Array<string> = [];
  const tezosAddress: Array<string> = [];

  res.artistAddressList.forEach((addr: string) => {
    if (isAddress(addr)) {
      ethAddress.push(addr);
    } else {
      tezosAddress.push(addr);
    }
  });

  const daoInfo = await getArtistDao(name);

  return { ...res, ethAddress, tezosAddress, ...daoInfo };
};

export const getArtwork = (page: number, options: any, cancel = false) =>
  passHttp.get(
    "/artist/artwork",
    {
      params: {
        pageSize: 24,
        page,
        ...options,
      },
    },
    cancel
  );

export const getArtDount = async (name: string) => {
  const res = await passHttp.get("/artist/nftDount", {
    params: {
      creatorName: name,
    },
  });

  [res.value, res.quantity].forEach((list) => {
    const sum = list.reduce((a: any, b: any) => a + b.value, 0);
    list.forEach((x: any) => {
      x.rate = ((x.value / sum) * 100).toFixed(2);
    });
  });

  return [res.value, res.quantity];
};

export const getArtTransaction = async (name: string) => {
  const res = await passHttp.get("/artist/nftTransaction", {
    params: {
      creatorName: name,
    },
  });

  [res.value, res.quantity].forEach((list) => {
    list.forEach((x: any) => {
      const sum = x.platSum.reduce((a: number, b: any) => a + b.sum, 0);
      x.totalSum = sum;
    });
  });

  return [res.value, res.quantity];
};

export const getArtTxRecord = async (creatorName: string, cancel: boolean) => {
  const res = await passHttp.get(
    "/artist/getColumnList",
    {
      params: {
        creatorName,
      },
    },
    cancel
  );

  res.singleArtColumn.forEach((x: any) => (x.isSingle = true));
  res.editionArtColumn.forEach((x: any) => (x.isSingle = false));

  return [res.singleArtColumn, res.editionArtColumn];
};

export const getArtTxRecordDetails = (
  page: number,
  creatorName: string,
  txType: string,
  valueType: string,
  plat: string,
  cancel: boolean
) =>
  passHttp.get(
    "/artist/getTransaction",
    {
      params: {
        page,
        size: 20,
        creatorName,
        txType,
        valueType,
        plat,
      },
    },
    cancel
  );

export const getArtScatter = async (
  creatorName: string,
  txtype: number,
  valueType: any,
  cancel = false
) =>
  passHttp.get(
    "/artist/transactionChart",
    {
      params: {
        creatorName,
        txtype,
        valueType,
      },
    },
    cancel
  );

export const getArtScatterAll = async (creatorName: string, valueType = "") => {
  const res = await Promise.all([
    getArtScatter(creatorName, 0, valueType),
    getArtScatter(creatorName, 1, valueType),
  ]);

  const [single, edition] = res;

  return res;
};

export const getArtHolder = async (creatorName: string, order: string) =>
  passHttp.get("/artist/topHolders", {
    params: {
      creatorName,
      order,
    },
  });

export const getArtworkList = (
  page: number,
  creatorName: string,
  text: string,
  config: Object,
  // txType: string,
  // valueType: string,
  // plat: string,
  // orderItem: string,
  // orderType: string,

  cancel: boolean
) =>
  passHttp.get(
    "/artist/getTransaction",
    {
      params: {
        page,
        pageSize: 12,
        creatorName,
        text,
        ...config,
      },
    },
    cancel
  );

export const getArtistPlats = (creatorName: string) =>
  passHttp.get("/artist/platformList", {
    params: {
      creatorName,
    },
  });
