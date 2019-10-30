import { Command } from "../../common/Command";
import { clear_process_queue_executor } from "../../../components/clear_process_queue";

export const clear_process_queue = new Command("clear_process_queue", clear_process_queue_executor);
