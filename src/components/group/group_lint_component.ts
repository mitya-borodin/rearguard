import { group_command_executor } from "./executor";

export const group_lint_component = async (): Promise<void> => {
  await group_command_executor(["npm", "run", "lint"]);
};
