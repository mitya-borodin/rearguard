import { group_command_executor } from "./executor";

export const group_clear_component = async (): Promise<void> => {
  await group_command_executor(["rm", "-rf", "./node_modules", "./package-lock.json"], true);
};
