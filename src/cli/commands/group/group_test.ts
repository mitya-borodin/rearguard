import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function group_test_executor(flags: any) {
  console.log("group_test____EXECUTOR", flags);
}

export const group_test: ICommand = new Command("test", group_test_executor);

group_test.addFlag("--debug");
