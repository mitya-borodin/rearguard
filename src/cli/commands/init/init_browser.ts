import { init_component } from "../../../components/init";
import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function app_executor(flags) {
  await init_component({ browser: true, node: false, app: true, lib: false, force: flags.force });
}
async function lib_executor(flags) {
  await init_component({ browser: true, node: false, app: false, lib: true, force: flags.force });
}

const app: ICommand = new Command("app", app_executor);
const lib: ICommand = new Command("lib", lib_executor);

export const init_browser: ICommand = new Command("browser");

init_browser.addCommand(app);
init_browser.addCommand(lib);
