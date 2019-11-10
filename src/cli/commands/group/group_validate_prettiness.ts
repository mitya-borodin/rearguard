import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_validate_prettiness_executor(flags: Flags = {}): Promise<void> {
  console.log("group_validate_prettiness____EXECUTOR", flags);
}

export const group_validate_prettiness = new Command(
  "validate-prettiness",
  group_validate_prettiness_executor,
);
