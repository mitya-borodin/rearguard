import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_init_executor(flags: Flags = {}): Promise<void> {
  console.log("group_init____EXECUTOR", flags);
}

export const group_init = new Command("init", group_init_executor);

group_init.addFlag("--force");
