import chalk from "chalk";
import * as moment from "moment";
import * as webpack from "webpack";
import { check_project } from "../config/components/chek.project";
import { copy_bundles_to_dist } from "../config/components/copy.bundles_to_dist";
import { css_typing_builder } from "../config/components/css.typing.builder";
import { ordering_npm_deps } from "../config/components/ordering.npm.deps";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { stats as statsConfig } from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { update_pkg } from "../config/components/update.pkg";
import { main_WS_config } from "../config/webpack.config";

async function build() {
  check_project();
  await ordering_npm_deps();
  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await css_typing_builder();
  await update_pkg();

  console.log(chalk.bold.blue(`=================WEBPACK===============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ WEBPACK ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  webpack(main_WS_config()).run((err: any, stats: any) => {
    if (err) {
      throw new Error(err);
    }

    console.info(stats.toString(statsConfig));
    const endTime = moment();

    console.log("");
    console.log(
      chalk.bold.blue(`[ WEBPACK ][ COMPILE_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
    );
    console.log(chalk.bold.blue(`[ WEBPACK ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
    console.log(chalk.bold.blue(`=======================================`));
    console.log("");

    copy_bundles_to_dist();
  });
}

build();
