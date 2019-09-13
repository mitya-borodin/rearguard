import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_check_deps_on_npm_executor(flags: any) {
  console.log("group_check_deps_on_npm____EXECUTOR", flags);
}

export const group_check_deps_on_npm: ICommand = new Command("check_deps_on_npm", group_check_deps_on_npm_executor);
