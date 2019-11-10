import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_lint_executor(flags: Flags = {}): Promise<void> {
  console.log("group_lint____EXECUTOR", flags);
}

export const group_lint = new Command("lint", group_lint_executor);
