import { group_command_executor } from "./executor";

export const group_refresh_component = async (options: { force: boolean }): Promise<void> => {
  await group_command_executor(["npm", "run", "refresh", ...(options.force ? ["--force"] : [])]);
};
