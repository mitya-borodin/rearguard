import { group_command_executor } from "./executor";

export const group_build_component = async (options: {
  only_dev: boolean;
  debug: boolean;
}): Promise<void> => {
  await group_command_executor(["npm", "link"], true);
  await group_command_executor(
    [
      "npm",
      "run",
      "build",
      ...(options.debug ? ["--", "--debug"] : []),
      ...(options.only_dev ? ["--", "--only_dev"] : []),
      ...["--", "--bypass_the_queue"],
    ],
    true,
  );
};
