import { refresh_executor } from "../../../components/refresh";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

export const refresh_command = new Command(
  "refresh",
  async (flags: Flags = { force: false }): Promise<void> => {
    await refresh_executor({ force: flags.force });
  },
);

refresh_command.addFlag("--force");
