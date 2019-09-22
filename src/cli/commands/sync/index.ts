import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function sync_executor(flags: Flags = {}): Promise<void> {
  console.log("SYNC____EXECUTOR", flags);
}

export const sync = new Command("sync", sync_executor);
