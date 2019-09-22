import { rearguard } from "../cli/commands/root";

export const cli = (): void => {
  const [, , ...other_argv] = process.argv;
  const command = ["rearguard", ...other_argv];
  const executor = rearguard.getExecutor(command);

  if (executor) {
    executor(rearguard.getFlags(command));
  } else {
    const help = rearguard.getHelp(command);

    console.log(help);
  }
};
