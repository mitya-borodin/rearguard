import { group_command_executor } from "./executor";

export const group_sync_component = async (): Promise<void> => {
  await group_command_executor(["rearguard", "sync", "--", "--bypass_the_queue"], true);
};
