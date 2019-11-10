import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_make_prettier_executor(flags: Flags = {}): Promise<void> {
  console.log("group_make_prettier____EXECUTOR", flags);
}

export const group_make_prettier = new Command("make-prettier", group_make_prettier_executor);
