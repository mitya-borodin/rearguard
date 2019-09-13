import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function sync_executor(flags: any) {
  console.log("CHECK_DEPS_ON_NPM____EXECUTOR", flags);
}

export const check_deps_on_npm: ICommand = new Command("check_deps_on_npm", sync_executor);
