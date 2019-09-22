import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_install_executor(flags: Flags = {}): Promise<void> {
  console.log("group_install____EXECUTOR", flags);
}

export const group_install = new Command("install", group_install_executor);
