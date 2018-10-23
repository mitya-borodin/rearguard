import chalk from "chalk";
import * as webpack from "webpack";
import { css_typing_builder } from "../config/components/css.typing.builder";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { stats as statsConfig } from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { dll as dll_WP_config } from "../config/webpack.config.dll";

async function dll() {
  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await css_typing_builder();

  console.log("");
  console.log(chalk.bold.cyanBright(`[ BUILD DLL ]`));
  webpack(dll_WP_config).run((err: any, stats: any) => {
    if (err) {
      throw new Error(err);
    }

    console.info(stats.toString(statsConfig));
    console.log(chalk.bold.cyanBright(`[ BUILD DLL END ]`));
  });
}

dll();
