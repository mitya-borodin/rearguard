import { init_command } from "../../commands/init";
import { Command } from "../../common/Command";
import { build } from "../build";
import { check_deps_on_npm } from "../check_deps_on_npm";
import { group } from "../group";
import { lint } from "../lint";
import { start } from "../start";
import { sync } from "../sync";
import { test } from "../test";
import { clear_process_queue } from "../clear_process_queue";

// Root command
export const rearguard = new Command("rearguard");

// Project Initialization / Reinitialization
rearguard.addCommand(init_command);

// Develop mode
rearguard.addCommand(start);

// Build mode
rearguard.addCommand(build);

// Testing mode
rearguard.addCommand(test);

// Validating mode
rearguard.addCommand(lint);

// Project Service
rearguard.addCommand(sync);
rearguard.addCommand(check_deps_on_npm);
rearguard.addCommand(clear_process_queue);

// Group service
rearguard.addCommand(group);
