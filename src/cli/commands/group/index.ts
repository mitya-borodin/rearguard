import { Command } from "../../common/implementation/Command";
import { ICommand } from "../../common/interfaces/ICommand";
import { group_bootstrap } from "./group_bootstrap";
import { group_build } from "./group_build";
import { group_check_deps_on_npm } from "./group_check_deps_on_npm";
import { group_clear } from "./group_clear";
import { group_init } from "./group_init";
import { group_install } from "./group_install";
import { group_link } from "./group_link";
import { group_publish } from "./group_publish";
import { group_sync } from "./group_sync";
import { group_test } from "./group_test";

export const group: ICommand = new Command("group");

group.addCommand(group_bootstrap);
group.addCommand(group_clear);
group.addCommand(group_init);
group.addCommand(group_install);
group.addCommand(group_build);
group.addCommand(group_link);
group.addCommand(group_test);
group.addCommand(group_publish);
group.addCommand(group_sync);
group.addCommand(group_check_deps_on_npm);
