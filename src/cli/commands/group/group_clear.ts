import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_clear_executor(flags: Flags = {}): Promise<void> {
  console.log("group_clear____EXECUTOR", flags);
}

export const group_clear = new Command("clear", group_clear_executor);
