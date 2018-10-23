import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import * as webpack from "webpack";

import { css_typing_builder } from "../config/components/css.typing.builder";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import {
  dll_path,
  output,
  root,
  stats as statsConfig,
} from "../config/components/target.config";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { main as main_WS_config } from "../config/webpack.config";

del([output.path || path.resolve(root, "dist")]).then(() => {
  console.log("");
  console.log(chalk.bold.cyan(`[ CLEAN DIST ]`));
  console.log(
    chalk.cyan(`[ DELETE ] ${output.path || path.resolve(root, "dist")}`),
  );

  copy([`${dll_path}/*.js`, `${dll_path}/*.css`], output.path, async () => {
    console.log("");
    console.log(chalk.bold.cyan(`[ COPY DLL ]`));
    console.log(chalk.cyan(`[ JS: ${dll_path}/*.js ]`));
    console.log(chalk.cyan(`[ CSS: ${dll_path}/*.css ]`));
    console.log(chalk.cyan(`[ TO: ${output.path} ]`));

    await sync_npm_deps(false);
    await ts_tsLint_config_builder();
    await css_typing_builder();

    console.log(chalk.bold.cyan(`[ BUILD START ]`));
    webpack(main_WS_config).run((err: any, stats: any) => {
      if (err) {
        throw new Error(err);
      }

      console.log("");
      console.info(stats.toString(statsConfig));
      console.log(chalk.bold.cyan(`[ BUILD END ]`));
    });
  });
});
