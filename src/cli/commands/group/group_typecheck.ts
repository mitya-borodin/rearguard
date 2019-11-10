import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_typecheck_executor(flags: Flags = {}): Promise<void> {
  console.log("group_typecheck____EXECUTOR", flags);
}

export const group_typecheck = new Command("typecheck", group_typecheck_executor);
