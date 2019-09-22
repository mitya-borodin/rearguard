import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function start_browser_executor(flags: Flags = {}): Promise<void> {
  console.log("START_BROWSER____EXECUTOR", flags);
}

export const start = new Command("start", start_browser_executor);

start.addFlag("--release");
start.addFlag("--debug");
