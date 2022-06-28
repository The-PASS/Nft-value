export const withThrottling = (fn: any) => {
  let flag = false;
  return async function (this: any, ...args: any[]) {
    if (flag) {
      return;
    }
    flag = true;
    try {
      const res = await fn.bind(this)(...args);
      flag = false;
      return res;
    } catch (e) {
      flag = false;
      throw e;
    }
  };
};
