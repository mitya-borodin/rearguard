import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_validate_executor(flags: Flags = {}): Promise<void> {
  console.log("group_validate____EXECUTOR", flags);
}

export const group_validate = new Command("validate", group_validate_executor);
