import * as moment from "moment";
import * as webpack from "webpack";
import { merge } from "lodash";
import { RearguardDevConfig } from "../../../configs/RearguardDevConfig";

export class HashWebpackPlugin {
  private isDevelopment: boolean;
  private needUpdateBuildTime: boolean;
  private rearguardLocalConfig: RearguardDevConfig;

  constructor(CWD: string, isDevelopment: boolean, needUpdateBuildTime: boolean) {
    this.isDevelopment = isDevelopment;
    this.needUpdateBuildTime = needUpdateBuildTime;
    this.rearguardLocalConfig = new RearguardDevConfig(CWD);

    this.apply = this.apply.bind(this);
  }

  public apply(compiler: webpack.Compiler): void {
    // ! See https://webpack.js.org/api/plugins/compiler/#event-hooks
    compiler.plugin(
      "after-emit",
      async (compilation: any, callback: any): Promise<void> => {
        const config = await this.rearguardLocalConfig.getConfig();
        const hash = compilation.hash;

        let hashType: "hash_dev" | "hash_prod" = "hash_dev";

        if (this.isDevelopment) {
          hashType = "hash_dev";
        } else {
          hashType = "hash_prod";
        }

        const curHash = config.build[hashType];

        // ! needUpdateBuildTime need only for rebuild outdated deps
        // ! because after build hash can be like a before as content didn't change.
        if (curHash !== hash || this.needUpdateBuildTime) {
          await this.rearguardLocalConfig.setConfig(
            merge(config, { build: { last_build_time: moment() } }),
          );
        }

        await this.rearguardLocalConfig.setConfig(merge(config, { build: { [hashType]: hash } }));

        callback(null);
      },
    );
  }
}
