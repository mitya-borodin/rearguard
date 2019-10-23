import { build_component } from "../../../components/build";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function build_executor(flags: Flags = {}): Promise<void> {
  await build_component({
    only_dev: flags.only_dev,
    debug: flags.debug,
    need_update_build_time: flags.need_update_build_time,
    bypass_the_queue: flags.bypass_the_queue,
  });
}

export const build = new Command("build", build_executor);

build.addFlag("--only_dev");
build.addFlag("--debug");
build.addFlag("--need_update_build_time");
build.addFlag("--bypass_the_queue");
