import { sync_component } from "../../../components/sync";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function sync_executor(flags: Flags = { bypass_the_queue: false }): Promise<void> {
  await sync_component({
    bypass_the_queue: flags.bypass_the_queue,
  });
}

export const sync = new Command("sync", sync_executor);

sync.addFlag("--bypass_the_queue");
