import { group_command_executor } from "./executor";

export const group_un_link_component = async (): Promise<void> => {
  await group_command_executor(["npm", "unlink"], true);
};
