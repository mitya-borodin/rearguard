import { init_component } from "../../../components/init";
import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function isomorphic_executor(flags) {
  await init_component({ browser: true, node: true, app: false, lib: true, force: flags.force });
}

export const init_isomorphic: ICommand = new Command("isomorphic", isomorphic_executor);
