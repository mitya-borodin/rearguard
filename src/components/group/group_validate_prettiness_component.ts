import { group_command_executor } from "./executor";

export const group_validate_prettiness_component = async (): Promise<void> => {
  await group_command_executor(["npm", "run", "validate-prettiness"]);
};
