import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_lint_fix_executor(flags: Flags = {}): Promise<void> {
  console.log("group_lint_fix____EXECUTOR", flags);
}

export const group_lint_fix = new Command("lint-fix", group_lint_fix_executor);
