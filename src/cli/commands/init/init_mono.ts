import { Command } from "../../common/Command";
import { init_component } from "../../../components/init";

async function mono_executor(): Promise<void> {
  await init_component({
    dll: false,
    browser: false,
    node: false,
    app: false,
    lib: false,
    mono: true,
    force: false,
  });
}

export const init_mono = new Command("mono", mono_executor);
