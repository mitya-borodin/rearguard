import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_sync_executor(flags) {
  console.log("group_sync____EXECUTOR", flags);
}

export const group_sync: ICommand = new Command("sync", group_sync_executor);
