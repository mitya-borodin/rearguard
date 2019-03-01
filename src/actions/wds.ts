import chalk from "chalk";
import * as webpack from "webpack";
import * as WDS from "webpack-dev-server";
import { build_intermediate_dependencies } from "../components/build_intermediate_dependencies";
import { initProject } from "../components/init_project";
import { watch_deps, watch_deps_event_emitter } from "../components/watch_deps";
import { envConfig } from "../config/env";
import { rearguardConfig } from "../config/rearguard";
import { wdsConfig } from "../config/wds";
import { get_WDS_config } from "../webpack/components/get_WDS_config";
import { main_WS_config } from "../webpack/webpack.config.main";

async function wds() {
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  await initProject();

  watch_deps(envConfig, rearguardConfig);

  const { host, port } = wdsConfig;
  const server: any = new WDS(
    webpack(main_WS_config(envConfig, rearguardConfig)),
    get_WDS_config(envConfig, rearguardConfig),
  );

  server.listen(port, host, () => {
    console.log(``);
    console.log(chalk.bold.cyanBright(`[ WDS ][ LAUNCHED ]`));
    console.log(chalk.cyan(`[ LAUNCHED: https://${host}:${port} ]`));

    watch_deps_event_emitter.on("SYNCED", async () => {
      await build_intermediate_dependencies(envConfig, rearguardConfig);

      server.middleware.invalidate();
    });
  });
}

wds();
