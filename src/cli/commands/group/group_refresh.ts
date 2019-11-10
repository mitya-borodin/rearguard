import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_refresh_executor(flags: Flags = {}): Promise<void> {
  console.log("group_refresh____EXECUTOR", flags);
}

export const group_refresh = new Command("refresh", group_refresh_executor);

group_refresh.addFlag("--force");
