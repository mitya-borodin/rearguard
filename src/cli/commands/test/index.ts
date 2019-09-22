import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function test_executor(flags: Flags = {}): Promise<void> {
  console.log("TEST____EXECUTOR", flags);
}

export const test = new Command("test", test_executor);

test.addFlag("--debug");
