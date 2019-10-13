import { RearguardConfig } from "../../configs/RearguardConfig";
import webpack from "webpack";
import * as path from "path";

export function getWebpackStats(CWD: string): webpack.Stats.ToStringOptionsObject {
  const rearguardConfig = new RearguardConfig(CWD);

  return {
    assets: true,
    env: true,
    context: path.resolve(CWD, rearguardConfig.getContext()),
    colors: true,
    hash: true,
    modules: false,
    publicPath: true,
    performance: false,
    timings: true,
    version: true,
  };
}
