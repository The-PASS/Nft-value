import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";
import { utils } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const formatAddress = (address: string, bit = 8) => {
  return address.substring(0, bit + 2) + "..." + address.slice(42 - bit);
};

export const copyTx = (text: string) => copy(text);

export const localeNumber = (xnum: number, bit = 0, zero = true) => {
  const num = Math.abs(xnum);
  if (xnum >= 10 ** (-1 * bit)) {
    const intNum = Math.floor(num);
    const floatNum = num - intNum;
    return (
      (xnum < 0 ? "-" : "") +
      (intNum.toLocaleString() +
        (bit == 0
          ? ""
          : zero
          ? floatNum.toFixed(bit).substring(1)
          : new BigNumber(+floatNum.toFixed(bit)).toFixed().substring(1)))
    );
  }

  if (num == 0) {
    return "0";
  }

  let weight = 0;
  let value = num;

  while (value < 1) {
    value *= 10;
    weight++;
  }

  return value < 0
    ? "-"
    : "" +
        "0." +
        Array(Math.max(0, weight - 1))
          .fill(0)
          .join("") +
        (+value.toFixed(3)).toString().replace(".", "");
};

export const suffixNum = (num: number | string) => {
  const flag = +num > 0 ? "+" : "";
  return flag + num;
};

const ethMap = {
  address: "address",
  tx: "tx",
  token: "token",
};
const flowMap: any = {
  address: "account",
  tx: "contract",
  token: "contract",
};

export const toExploreAddress = (
  address: string,
  network: string,
  type = "address"
) => {
  if (network != "Tezos") {
    window.open(
      `${
        (
          {
            Ethereum: "https://etherscan.io",
            Polygon: "https://polygonscan.com",
            Ronin: "https://explorer.roninchain.com",
            Flow: "https://flowscan.org",
            ETHEREUM: "https://etherscan.io",
          } as any
        )[network]
      }/${(network == "Flow" ? flowMap : ethMap)[type]}/${address}`,
      "_blank"
    );
  } else {
    window.open(
      `https://tzkt.io/${address}/${type == "address" ? "operations" : ""}`
    );
  }
};

export const isAddress = (addr: string) => utils.isAddress(addr);

export const getResourceUrl = (name: string) =>
  new URL(name, import.meta.url).href;

export const formatDate = (str: any, type: string) => dayjs(str).format(type);

export const formatDateText = (ms: number) => {
  const now = Date.now();
  const prev = ms; /* + new Date().getTimezoneOffset() * 60000 */
  const x = (now - prev) / 1000;
  return (dayjs(prev) as any).fromNow();
};

export const jumpTokenId = (
  tokenId: string,
  chain: string,
  address: string
) => {
  window.open(
    chain == "tezos"
      ? `https://objkt.com/asset/${address}/${tokenId}`
      : `https://opensea.io/assets/${chain.toLowerCase()}/${address}/${tokenId}`,
    "_blank"
  );
};

export const jumpChainTokenId = (
  tokenAddress: string,
  tokenId: string,
  network: string
) => {
  if (network.toLowerCase() == "ethereum")
    window.open(
      `https://etherscan.io/token/${tokenAddress}?a=${tokenId}`,
      "_blank"
    );
};
