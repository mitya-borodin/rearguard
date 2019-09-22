import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_build_executor(flags: Flags = {}): Promise<void> {
  console.log("group_build____EXECUTOR", flags);
}

export const group_build = new Command("build", group_build_executor);

group_build.addFlag("--only_dev");
group_build.addFlag("--debug");
