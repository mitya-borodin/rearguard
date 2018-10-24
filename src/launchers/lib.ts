import chalk from "chalk";
import * as webpack from "webpack";
import { css_typing_builder } from "../config/components/css.typing.builder";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { stats as statsConfig } from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { tsc } from "../config/components/tsc";
import { update_pkg } from "../config/components/update.pkg";
import { library as library_WP_config } from "../config/webpack.config.lib";

async function lib() {
  console.log(
    chalk.bold.blue(`==================Prepare LIB=================`),
  );

  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await css_typing_builder();
  await update_pkg();

  console.log(
    chalk.bold.blue(`==============================================`),
  );
  console.log("");

  console.log(chalk.bold.blue(`==================BUILD TS=================`));

  tsc();

  console.log(chalk.bold.blue(`===========================================`));
  console.log("");

  console.log(
    chalk.bold.blue(`==================BUILD LIB===================`),
  );

  webpack(library_WP_config).run((err: any, stats: any) => {
    if (err) {
      throw new Error(err);
    }

    console.info(stats.toString(statsConfig));
    console.log(
      chalk.bold.blue(`=================BUILD LIB END================`),
    );
  });
}

lib();
