import * as moment from "moment";
import { build_intermediate_dependencies } from "../../components/build_intermediate_dependencies";
import { initProject } from "../../components/init_project";
import { watch_deps } from "../../components/watch_deps";
import { buildStatusConfig } from "../../config/buildStatus";
import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";

export async function sync() {
  await build_intermediate_dependencies(envConfig, rearguardConfig);

  await initProject();

  buildStatusConfig.last_build_time = moment();

  if (envConfig.isWatch) {
    watch_deps(envConfig, rearguardConfig);
  }
}
