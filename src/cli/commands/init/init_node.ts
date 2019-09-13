import { init_component } from "../../../components/init";
import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function app_executor(flags: any) {
  await init_component({ browser: false, node: true, app: true, lib: false, force: flags.force });
}

async function lib_executor(flags: any) {
  await init_component({ browser: false, node: true, app: false, lib: true, force: flags.force });
}

const app: ICommand = new Command("app", app_executor);
const lib: ICommand = new Command("lib", lib_executor);

export const init_node: ICommand = new Command("node");

init_node.addCommand(lib);
init_node.addCommand(app);
