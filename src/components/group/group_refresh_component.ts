import { group_command_executor } from "./executor";

export const group_refresh_component = async (options: { force: boolean }): Promise<void> => {
  await group_command_executor(
    ["rearguard", "refresh", ...(options.force ? ["--force"] : [])],
    true,
  );
};
