import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_publish_executor(flags: Flags = {}): Promise<void> {
  console.log("group_publish____EXECUTOR", flags);
}

export const group_publish = new Command("publish", group_publish_executor);

group_publish.addFlag("--patch");
group_publish.addFlag("--minor");
group_publish.addFlag("--major");
