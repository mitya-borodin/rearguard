import { check_project } from "../config/components/chek.project";
import { ordering_npm_deps } from "../config/components/ordering.npm.deps";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { tsc as tsc_compile } from "../config/components/tsc";
import { update_pkg } from "../config/components/update.pkg";

async function tsc() {
  check_project();
  await ordering_npm_deps();
  await sync_npm_deps(false);
  await ts_tsLint_config_builder();
  await update_pkg();
  tsc_compile();
}

tsc();
