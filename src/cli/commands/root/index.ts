import { init_command } from "../../commands/init";
import { Command } from "../../common/Command";
import { build } from "../build";
import { check_deps_on_npm } from "../check_deps_on_npm";
import { group } from "../group";
import { lint } from "../lint";
import { start } from "../start";
import { sync } from "../sync";
import { test } from "../test";
import { refresh_command } from "../refresh";

// Root command
export const rearguard = new Command("rearguard");

// Project Initialization / Refresh
rearguard.addCommand(init_command);
rearguard.addCommand(refresh_command);

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

// Group service
rearguard.addCommand(group);
