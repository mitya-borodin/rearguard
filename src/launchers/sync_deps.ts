import { ordering_npm_deps } from "../config/components/ordering.npm.deps";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { update_pkg } from "../config/components/update.pkg";

async function run_sync_npm_deps() {
  await update_pkg();
  await ordering_npm_deps();
  await sync_npm_deps();
}

run_sync_npm_deps();
