import * as webpack from "webpack";
import { stats as statsConfig } from "../config/target.config";
import webpackConfig from "../config/webpack.config";

async function bundle() {
  await new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err: any, stats: any) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString(statsConfig));
      return resolve();
    });
  });
}

export default bundle;
