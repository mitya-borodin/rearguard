import { group_bootstrap_component } from "../../../components/group/group_bootstrap_component";
import { group_build_component } from "../../../components/group/group_build_component";
import { group_clear_component } from "../../../components/group/group_clear_component";
import { group_link_component } from "../../../components/group/group_link_component";
import { group_lint_component } from "../../../components/group/group_lint_component";
import { group_lint_fix_component } from "../../../components/group/group_lint_fix_component";
import { group_make_prettier_component } from "../../../components/group/group_make_prettier_component";
import { group_publish_component } from "../../../components/group/group_publish_component";
import { group_refresh_component } from "../../../components/group/group_refresh_component";
import { group_test_component } from "../../../components/group/group_test_component";
import { group_typecheck_component } from "../../../components/group/group_typecheck_component";
import { group_validate_component } from "../../../components/group/group_validate_component";
import { group_validate_prettiness_component } from "../../../components/group/group_validate_prettiness_component";
import { Command } from "../../common/Command";
import { Flags } from "../../common/Flags";
import { group_start_component } from "../../../components/group/group_start_component";
import { group_install_component } from "../../../components/group/group_install_component";

const group_bootstrap = new Command(
  "bootstrap",
  async (flags: Flags = { force: false, only_dev: false, debug: false }): Promise<void> => {
    await group_bootstrap_component({
      only_dev: flags.only_dev,
      debug: flags.debug,
    });
  },
);

group_bootstrap.addFlag("--only_dev");
group_bootstrap.addFlag("--debug");

const group_build = new Command(
  "build",
  async (flags: Flags = { only_dev: false, debug: false }): Promise<void> => {
    await group_build_component({ only_dev: flags.only_dev, debug: flags.debug });
  },
);

group_build.addFlag("--only_dev");
group_build.addFlag("--debug");

const group_clear = new Command("clear", group_clear_component);

const group_install = new Command("install", group_install_component);

const group_link = new Command("link", group_link_component);

const group_start = new Command(
  "start",
  async (flags: Flags = { release: false, debug: false, ts_node_dev: false }): Promise<void> => {
    await group_start_component({
      release: flags.release,
      debug: flags.debug,
      ts_node_dev: flags.ts_node_dev,
    });
  },
);

group_start.addFlag("--release");
group_start.addFlag("--debug");
group_start.addFlag("--ts_node_dev");

const group_lint_fix = new Command("lint-fix", group_lint_fix_component);

const group_lint = new Command("lint", group_lint_component);

const group_make_prettier = new Command("make-prettier", group_make_prettier_component);

const group_publish = new Command(
  "publish",
  async (flags: Flags = { patch: false, minor: false, major: false }): Promise<void> => {
    await group_publish_component({
      patch: flags.patch,
      minor: flags.minor,
      major: flags.major,
    });
  },
);

group_publish.addFlag("--patch");
group_publish.addFlag("--minor");
group_publish.addFlag("--major");

const group_refresh = new Command(
  "refresh",
  async (flags: Flags = { force: false }): Promise<void> => {
    await group_refresh_component({ force: flags.force });
  },
);

group_refresh.addFlag("--force");

const group_test = new Command(
  "test",
  async (flags: Flags = { debug: false }): Promise<void> => {
    await group_test_component({ debug: flags.debug });
  },
);

group_test.addFlag("--debug");

const group_typecheck = new Command("typecheck", group_typecheck_component);

const group_validate_prettiness = new Command(
  "validate-prettiness",
  group_validate_prettiness_component,
);

const group_validate = new Command("validate", group_validate_component);

export const group = new Command("group");

group.addCommand(group_bootstrap);
group.addCommand(group_clear);
group.addCommand(group_install);
group.addCommand(group_link);
group.addCommand(group_start);
group.addCommand(group_lint);
group.addCommand(group_lint_fix);
group.addCommand(group_typecheck);
group.addCommand(group_validate_prettiness);
group.addCommand(group_validate);
group.addCommand(group_make_prettier);
group.addCommand(group_build);
group.addCommand(group_test);
group.addCommand(group_publish);
group.addCommand(group_refresh);
