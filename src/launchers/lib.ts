import chalk from "chalk";
import * as moment from "moment";
import * as webpack from "webpack";
import { check_project } from "../config/components/chek.project";
import { css_typing_builder } from "../config/components/css.typing.builder";
import { ordering_npm_deps } from "../config/components/ordering.npm.deps";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { stats as statsConfig } from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { tsc } from "../config/components/tsc";
import { update_pkg } from "../config/components/update.pkg";
import { library_WP_config } from "../config/webpack.config.lib";

async function lib() {
  check_project();
  await ordering_npm_deps();
  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await css_typing_builder();
  await update_pkg();
  tsc();

  console.log(chalk.bold.blue(`=================WEBPACK===============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ WEBPACK ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  webpack(library_WP_config()).run((err: any, stats: any) => {
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
  });
}

lib();
