import { processQueue } from "../../helpers/processQueue";

// TODO Add logging.
export async function clear_process_queue_executor(): Promise<void> {
  processQueue.dropQueue();
}
