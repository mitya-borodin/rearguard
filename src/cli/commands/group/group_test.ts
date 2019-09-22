import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_test_executor(flags: Flags = {}): Promise<void> {
  console.log("group_test____EXECUTOR", flags);
}

export const group_test = new Command("test", group_test_executor);

group_test.addFlag("--debug");
