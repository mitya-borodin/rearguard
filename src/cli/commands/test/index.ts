import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";

async function test_executor(flags: any) {
  console.log("TEST____EXECUTOR", flags);
}

export const test: ICommand = new Command("test", test_executor);

test.addFlag("--debug");
