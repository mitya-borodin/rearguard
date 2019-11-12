import webpack from "webpack";

export const getHotModuleReplacementPlugin = (
  isDevelopment: boolean,
  isBuild: boolean,
): webpack.Plugin[] => {
  if (isDevelopment && !isBuild) {
    return [
      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),

      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
    ];
  }

  return [];
};
