import { group_command_executor } from "./executor";

export const group_install_component = async (): Promise<void> => {
  await group_command_executor(["npm", "i"], true);
};
