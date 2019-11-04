import { RearguardConfig } from "../../configs/RearguardConfig";
import * as webpack from "webpack";

export const getChunkOptimization = (CWD: string): webpack.Options.Optimization => {
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isApp = rearguardConfig.isApp();

  if (isBrowser && isApp) {
    return {
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: "all",
        name: false,
        automaticNameDelimiter: "-",
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: (entrypoint): string => `runtime-${entrypoint.name}.chunk`,
      },
    };
  }

  return {};
};
