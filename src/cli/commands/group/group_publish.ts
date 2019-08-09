import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_publish_executor(flags) {
  console.log("group_publish____EXECUTOR", flags);
}

export const group_publish: ICommand = new Command("publish", group_publish_executor);

group_publish.addFlag("--patch");
group_publish.addFlag("--minor");
group_publish.addFlag("--major");
