import { Flags } from "../../common/Flags";
import { Command } from "../../common/Command";

async function group_bootstrap_executor(flags: Flags = {}): Promise<void> {
  console.log("GROUP_BOOTSTRAP____EXECUTOR", flags);
}

export const group_bootstrap = new Command("bootstrap", group_bootstrap_executor);

group_bootstrap.addFlag("--force");
group_bootstrap.addFlag("--only_dev");
group_bootstrap.addFlag("--debug");
