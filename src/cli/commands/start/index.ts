import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";
import { start_component } from "../../../components/start";

async function start_executor(flags: Flags = {}): Promise<void> {
  await start_component({
    release: flags.release,
    debug: flags.debug,
    ts_node_dev: flags.ts_node_dev,
  });
}

export const start = new Command("start", start_executor);

start.addFlag("--release");
start.addFlag("--debug");
start.addFlag("--ts_node_dev");
