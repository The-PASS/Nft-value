import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";

export const formatAddress = (address: string, bit = 8) => {
  return address.substring(0, bit + 2) + "..." + address.slice(42 - bit);
};

export const copyTx = (text: string) => copy(text);

export const localeNumber = (xnum: number, bit = 0, zero = true) => {
  const num = Math.abs(xnum || 0);
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
};

export const suffixNum = (num: number | string) => {
  const flag = +num > 0 ? "+" : "";
  return flag + num;
};

export const toExploreAddress = (
  address: string,
  network: string,
  type = "address"
) => {
  window.open(
    `${
      (
        {
          Ethereum: "https://etherscan.io",
          Polygon: "https://polygonscan.com",
          Ronin: "https://explorer.roninchain.com",
        } as any
      )[network]
    }/${type}/${address}`,
    "_blank"
  );
};
