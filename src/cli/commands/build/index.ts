import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function build_executor(flags: any) {
  console.log("BUILD__EXECUTOR", flags);
}

export const build: ICommand = new Command("build", build_executor);

build.addFlag("--only_dev");
build.addFlag("--debug");
build.addFlag("--need_update_build_time");
