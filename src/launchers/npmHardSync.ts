import { syncNPM } from "../config/components/syncNPM";

async function npmHardSync() {
  await syncNPM();
}

npmHardSync();
