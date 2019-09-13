import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_install_executor(flags: any) {
  console.log("group_install____EXECUTOR", flags);
}

export const group_install: ICommand = new Command("install", group_install_executor);
