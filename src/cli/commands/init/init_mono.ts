import { init_component } from "../../../components/init";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function mono_executor(flags: Flags = {}): Promise<void> {
  await init_component({
    dll: false,
    browser: false,
    node: false,
    app: false,
    lib: false,
    mono: true,
    force: flags.force,
  });
}

export const init_mono = new Command("mono", mono_executor);

init_mono.addFlag("--force");
