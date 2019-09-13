import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_link_executor(flags: any) {
  console.log("group_link____EXECUTOR", flags);
}

export const group_link: ICommand = new Command("link", group_link_executor);
