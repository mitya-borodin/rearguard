import { init_component } from "../../../components/init";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function isomorphic_executor(flags: Flags = {}): Promise<void> {
  await init_component({
    dll: false,
    browser: true,
    node: true,
    app: false,
    lib: true,
    mono: false,
    force: flags.force,
  });
}

export const init_isomorphic = new Command("isomorphic", isomorphic_executor);

init_isomorphic.addFlag("--force");
