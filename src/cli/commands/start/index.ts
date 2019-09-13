import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function start_browser_executor(flags: any) {
  console.log("START_BROWSER____EXECUTOR", flags);
}

export const start: ICommand = new Command("start", start_browser_executor);

start.addFlag("--release");
start.addFlag("--debug");
