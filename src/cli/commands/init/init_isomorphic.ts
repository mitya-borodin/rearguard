import { init_component } from "../../../components/init";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function isomorphic_executor(flags: Flags = {}): Promise<void> {
  await init_component({ browser: true, node: true, app: false, lib: true, force: flags.force });
}

export const init_isomorphic = new Command("isomorphic", isomorphic_executor);
