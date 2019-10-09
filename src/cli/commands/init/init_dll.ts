import { init_component } from "../../../components/init";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function dll_executor(flags: Flags = {}): Promise<void> {
  await init_component({
    dll: true,
    browser: false,
    node: false,
    app: false,
    lib: true,
    force: flags.force,
  });
}

const dll = new Command("dll", dll_executor);

export const init_dll = new Command("browser");

init_dll.addCommand(dll);
