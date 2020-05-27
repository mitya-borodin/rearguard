#!/usr/bin/env node
import { cli } from "../src/cli";
import { removeMacOSMeta } from "../src/components/procedures/removeMacOSMeta";

(async (): Promise<void> => {
  await removeMacOSMeta(process.cwd());

  cli();
})();
