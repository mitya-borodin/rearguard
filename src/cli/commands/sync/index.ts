import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function sync_executor(flags) {
  console.log("SYNC____EXECUTOR", flags);
}

export const sync: ICommand = new Command("sync", sync_executor);
