import { ts_tsLint_config_builder } from "../config/components/ts.tsLint.config.builder";
import { tsc as tsc_compile } from "../config/components/tsc";
import { update_pkg } from "../config/components/update.pkg";

async function tsc() {
  await ts_tsLint_config_builder();
  await update_pkg();
  tsc_compile();
}

tsc();
