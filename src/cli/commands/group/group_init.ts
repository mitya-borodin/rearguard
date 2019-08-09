import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_init_executor(flags) {
  console.log("group_init____EXECUTOR", flags);
}

export const group_init: ICommand = new Command("init", group_init_executor);

group_init.addFlag("--force");
