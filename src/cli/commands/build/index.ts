import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function build_executor(flags: Flags = {}): Promise<void> {
  console.log("BUILD__EXECUTOR", flags);
}

export const build = new Command("build", build_executor);

build.addFlag("--only_dev");
build.addFlag("--debug");
build.addFlag("--need_update_build_time");
