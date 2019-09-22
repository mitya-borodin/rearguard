import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_check_deps_on_npm_executor(flags: Flags = {}): Promise<void> {
  console.log("group_check_deps_on_npm____EXECUTOR", flags);
}

export const group_check_deps_on_npm = new Command(
  "check_deps_on_npm",
  group_check_deps_on_npm_executor,
);
