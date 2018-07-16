import { npmHardSyncStart } from "../config/components/npmHardSync";

async function npmHardSync() {
  await npmHardSyncStart();
}

npmHardSync();
