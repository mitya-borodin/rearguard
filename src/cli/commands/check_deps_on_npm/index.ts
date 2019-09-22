import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function sync_executor(flags: Flags = {}): Promise<void> {
  console.log("CHECK_DEPS_ON_NPM____EXECUTOR", flags);
}

export const check_deps_on_npm = new Command("check_deps_on_npm", sync_executor);
