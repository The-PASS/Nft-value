import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";

export const formatAddress = (address: string, bit = 8) => {
  return address.substring(0, bit + 2) + "..." + address.slice(42 - bit);
};

export const copyTx = (text: string) => copy(text);

export const localeNumber = (num: number, bit = 0, zero = true) => {
  const intNum = Math.floor(num);
  const floatNum = num - intNum;

  return (
    intNum.toLocaleString() +
    (bit == 0
      ? ""
      : zero
      ? floatNum.toFixed(bit).substring(1)
      : new BigNumber(+floatNum.toFixed(bit)).toFixed().substring(1))
  );
};

export const suffixNum = (num) => {
  const flag = +num > 0 ? "+" : "";
  return flag + num;
};
