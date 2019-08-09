import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_bootstrap_executor(flags) {
  console.log("GROUP_BOOTSTRAP____EXECUTOR", flags);
}

export const group_bootstrap: ICommand = new Command("bootstrap", group_bootstrap_executor);

group_bootstrap.addFlag("--force");
group_bootstrap.addFlag("--only_dev");
group_bootstrap.addFlag("--debug");
