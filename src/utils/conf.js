export const envFn = (obj) => {
  return obj[process.env.VUE_APP_BUILD_ENV];
};
