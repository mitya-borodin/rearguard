import chalk from "chalk";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { envConfig } from "../config/env";
import { prettierConfig } from "../config/prettier";
import { rearguardConfig } from "../config/rearguard";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../const";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { postcssPlugins } from "../meta/postcssPlugins";
import { prePublish } from "../meta/PrePublish";
import { typings } from "../meta/Typings";
import { npmrc } from "./../meta/Npmrc/index";
import { copy_bundles } from "./project_deps/copy_bundles";
import { delete_bundles } from "./project_deps/delete_bundles";
import { ordering_project_deps } from "./project_deps/ordering_project_deps";
import { set_list_of_modules_with_deferred_loading } from "./project_deps/set_list_of_modules_with_deferred_loading";
import { sync_with_linked_modules } from "./project_deps/sync_with_linked_modules";

// tslint:disable:variable-name
export async function initProject() {
  console.log(chalk.bold.magenta(`================INIT_PROJECT================`));
  console.log("");

  const pkg_path = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(pkg_path)) {
    console.log(chalk.red(`[ INIT ][ ERROR ][ You haven't package.json, you should do npm init ]`));
    console.log("");

    process.exit(1);
  }

  const update_for_pkg: { [key: string]: any } = {};

  /**
   * INIT PROJECT STATUS
   */

  if (envConfig.isInit) {
    rearguardConfig.has_project = envConfig.has_project;
    rearguardConfig.has_dll = envConfig.has_dll;
    rearguardConfig.has_browser_lib = envConfig.has_browser_lib;
    rearguardConfig.has_node_lib = envConfig.has_node_lib;
    rearguardConfig.load_on_demand = envConfig.load_on_demand;
  }

  const files: string[] = [];

  if (rearguardConfig.has_dll) {
    files.push(DLL_BUNDLE_DIR_NAME);
  }

  if (rearguardConfig.has_browser_lib) {
    files.push(LIB_BUNDLE_DIR_NAME);
  }

  if (rearguardConfig.has_node_lib || rearguardConfig.has_browser_lib) {
    files.push(LIB_DIR_NAME);
  }

  console.log(chalk.green(`[ FILES ][ ${files.join(", ")} ]`));
  console.log("");

  update_for_pkg.files = files;

  /**
   * INIT ENTRY FILES
   */

  const src = path.resolve(process.cwd(), "src");

  mkdirp.sync(src);

  if (rearguardConfig.has_browser_lib || rearguardConfig.has_project) {
    const entry = path.resolve(src, rearguardConfig.entry);

    if (!fs.existsSync(entry)) {
      fs.writeFileSync(entry, `// Точка входа в проект;\n`);

      console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${entry} ]`));
      console.log("");
    }
  }

  if (rearguardConfig.has_dll) {
    const dll_entry = path.resolve(src, rearguardConfig.dll_entry);

    if (!fs.existsSync(dll_entry)) {
      fs.writeFileSync(dll_entry, `// В этом файле указываются импорты пакетов, которые необходимо вынести в dll;\n`);

      console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${dll_entry} ]`));
      console.log("");
    }
  }

  if (rearguardConfig.has_browser_lib || rearguardConfig.has_node_lib) {
    const lib_entry = path.resolve(src, rearguardConfig.lib_entry);

    if (!fs.existsSync(lib_entry)) {
      fs.writeFileSync(lib_entry, `// Точка экспорта API из библиотеки;\n`);

      console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${lib_entry} ]`));
      console.log("");
    }
  }

  if (rearguardConfig.has_browser_lib || rearguardConfig.has_node_lib) {
    const lib_entry = path.resolve(src, rearguardConfig.lib_entry);
    const basename = path.basename(lib_entry, ".ts");

    update_for_pkg.main = `${LIB_DIR_NAME}/${basename}.js`;
    update_for_pkg.module = `${LIB_DIR_NAME}/${basename}.js`;
    update_for_pkg.types = `${LIB_DIR_NAME}/${basename}.d.ts`;
  }

  /**
   * INIT SCRIPTS
   */

  if (!update_for_pkg.scripts) {
    update_for_pkg.scripts = {};
  }

  /**
   * BUILD_SCRIPTS
   */

  const args: string[] = [];

  if (rearguardConfig.has_dll) {
    args.push("--dll");
  }

  if (rearguardConfig.has_browser_lib) {
    args.push("--ui_lib");
  }

  if (rearguardConfig.has_node_lib) {
    args.push("--node_lib");
  }

  update_for_pkg.scripts.build = "rearguard build " + args.join(" ");
  update_for_pkg.scripts["build:release"] = "rearguard build -r " + args.join(" ");
  update_for_pkg.scripts["build:both"] = "rearguard build --both " + args.join(" ");

  /**
   * START
   */

  if (rearguardConfig.has_project) {
    update_for_pkg.scripts.start = "rearguard wds";
    update_for_pkg.scripts["start:release"] = "rearguard wds -r";

    if (rearguardConfig.has_dll) {
      if (!(rearguardConfig.has_browser_lib || rearguardConfig.has_node_lib)) {
        update_for_pkg.scripts.build = update_for_pkg.scripts.build.replace("--dll", "");
        update_for_pkg.scripts["build:release"] = update_for_pkg.scripts["build:release"].replace("--dll", "");
        update_for_pkg.scripts["build:both"] = update_for_pkg.scripts["build:both"].replace("--dll", "");
      }

      update_for_pkg.scripts.dll = "rearguard build --dll";
      update_for_pkg.scripts["dll:release"] = "rearguard build --dll -r";
    }

    if (!(rearguardConfig.has_browser_lib || rearguardConfig.has_node_lib)) {
      update_for_pkg.scripts.build += " --project";
      update_for_pkg.scripts["build:release"] += " --project";
      update_for_pkg.scripts["build:both"] += " --project";
    }
  } else {
    delete update_for_pkg.scripts.start;
    delete update_for_pkg.scripts["start:release"];

    delete update_for_pkg.scripts.dll;
    delete update_for_pkg.scripts["dll:release"];
  }

  if (!rearguardConfig.has_project && rearguardConfig.has_browser_lib) {
    update_for_pkg.scripts.start = "rearguard wds";
    update_for_pkg.scripts["start:release"] = "rearguard wds -r";
  }

  /**
   * PRE_PUBLISH_ONLY
   */

  if (!rearguardConfig.has_dll && !rearguardConfig.has_browser_lib && rearguardConfig.has_node_lib) {
    update_for_pkg.scripts.prepublishOnly = "npm run build:release";
  } else {
    update_for_pkg.scripts.prepublishOnly = "npm run build:both";
  }

  const cur_pkg = require(pkg_path);

  fs.writeFileSync(pkg_path, prettier_package_json.format({ ...cur_pkg, ...update_for_pkg }));

  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  prettierConfig.init(true);

  // Meta files init
  dockerIgnore.init(true);
  gitIgnore.init(true);
  editorConfig.init(true);
  npmrc.init(true);

  if (rearguardConfig.has_project || rearguardConfig.has_browser_lib) {
    prePublish.init(true);
    typings.init(true);
    postcssPlugins.init();
  }

  console.log("");

  await ordering_project_deps();
  await sync_with_linked_modules();

  if (rearguardConfig.has_project || rearguardConfig.has_dll || rearguardConfig.has_browser_lib) {
    await delete_bundles();
    await copy_bundles();
  }

  rearguardConfig.order_config_fields();

  set_list_of_modules_with_deferred_loading();

  console.log(chalk.bold.magenta(`============================================`));
  console.log("");
}
// tslint:enable:variable-name
