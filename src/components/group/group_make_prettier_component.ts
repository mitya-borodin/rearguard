import { group_command_executor } from "./executor";

export const group_make_prettier_component = async (): Promise<void> => {
  await group_command_executor(["npm", "run", "make-prettier"]);
};
