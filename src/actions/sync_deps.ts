import { ordering_npm_deps } from "../config/components/ordering.npm.deps";
import { pre_publish_shell } from "../config/components/pre.publish.shell";
import { sync_npm_deps } from "../config/components/sync.npm.deps";
import { update_pkg } from "../config/components/update.pkg";

async function run_sync_npm_deps() {
  pre_publish_shell();
  await ordering_npm_deps();
  await sync_npm_deps();
  await update_pkg();
}

run_sync_npm_deps();
