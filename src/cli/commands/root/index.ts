import { init_command } from "../../commands/init";
import { Command } from "../../common/Command";
import { build } from "../build";
import { group } from "../group";
import { lint } from "../lint";
import { refresh_command } from "../refresh";
import { start } from "../start";
import { sync } from "../sync";
import { test } from "../test";
import { watch } from "../watch";

// Root command
export const rearguard = new Command("rearguard");

// Project Initialization / Refresh
rearguard.addCommand(init_command);
rearguard.addCommand(refresh_command);

// Develop mode
rearguard.addCommand(start);

// Develop mode only for node libs
rearguard.addCommand(watch);

// Build mode
rearguard.addCommand(build);

// Testing mode
rearguard.addCommand(test);

// Validating mode
rearguard.addCommand(lint);

// Service
rearguard.addCommand(sync);

// Group service
rearguard.addCommand(group);
