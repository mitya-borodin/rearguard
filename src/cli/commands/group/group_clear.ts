import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_clear_executor(flags) {
  console.log("group_clear____EXECUTOR", flags);
}

export const group_clear: ICommand = new Command("clear", group_clear_executor);
