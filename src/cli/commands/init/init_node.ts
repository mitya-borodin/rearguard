import { init_component } from "../../../components/init";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function app_executor(flags: Flags = {}): Promise<void> {
  await init_component({
    dll: false,
    browser: false,
    node: true,
    app: true,
    lib: false,
    force: flags.force,
  });
}

async function lib_executor(flags: Flags = {}): Promise<void> {
  await init_component({
    dll: false,
    browser: false,
    node: true,
    app: false,
    lib: true,
    force: flags.force,
  });
}

const app = new Command("app", app_executor);
const lib = new Command("lib", lib_executor);

export const init_node = new Command("node");

init_node.addCommand(lib);
init_node.addCommand(app);
