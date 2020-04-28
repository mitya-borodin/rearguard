/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { watch_component } from "../../../components/watch";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";

async function watch_executor(flags: Flags = {}): Promise<void> {
  await watch_component();
}

export const watch = new Command("watch", watch_executor);
