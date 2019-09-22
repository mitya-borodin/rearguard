import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function group_link_executor(flags: Flags = {}): Promise<void> {
  console.log("group_link____EXECUTOR", flags);
}

export const group_link = new Command("link", group_link_executor);
