import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_build_executor(flags: any) {
  console.log("group_build____EXECUTOR", flags);
}

export const group_build: ICommand = new Command("build", group_build_executor);

group_build.addFlag("--only_dev");
group_build.addFlag("--debug");
