import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_sync_executor(flags: Flags = {}): Promise<void> {
  console.log("group_sync____EXECUTOR", flags);
}

export const group_sync = new Command("sync", group_sync_executor);
