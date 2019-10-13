import { Command } from "../../common/Command";
import { init_browser } from "./init_browser";
import { init_isomorphic } from "./init_isomorphic";
import { init_node } from "./init_node";

export const init_command = new Command("init");

init_command.addFlag("--force");

init_command.addCommand(init_browser);
init_command.addCommand(init_node);
init_command.addCommand(init_isomorphic);
