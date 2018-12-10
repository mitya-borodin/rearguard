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

  const pkg = require(pkg_path);

  /**
   * INIT PROJECT STATUS
   */

  if (envConfig.isInit) {
    rearguardConfig.has_project = envConfig.has_project;
    rearguardConfig.has_dll = envConfig.has_dll;
    rearguardConfig.has_ui_lib = envConfig.has_ui_lib;
    rearguardConfig.has_node_lib = envConfig.has_node_lib;
    rearguardConfig.load_on_demand = envConfig.load_on_demand;
  }

  const files: string[] = [];

  if (rearguardConfig.has_dll) {
    files.push(DLL_BUNDLE_DIR_NAME);
  }

  if (rearguardConfig.has_ui_lib) {
    files.push(LIB_BUNDLE_DIR_NAME);
  }

  if (rearguardConfig.has_node_lib || rearguardConfig.has_ui_lib) {
    files.push(LIB_DIR_NAME);
  }

  console.log(chalk.green(`[ FILES ][ ${files.join(", ")} ]`));
  console.log("");

  pkg.files = files;

  /**
   * INIT ENTRY FILES
   */

  const src = path.resolve(process.cwd(), "src");

  mkdirp.sync(src);

  if (rearguardConfig.has_project) {
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

  if (rearguardConfig.has_ui_lib || rearguardConfig.has_node_lib) {
    const lib_entry = path.resolve(src, rearguardConfig.lib_entry);

    if (!fs.existsSync(lib_entry)) {
      fs.writeFileSync(lib_entry, `// Точка экспорта API из библиотеки;\n`);

      console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${lib_entry} ]`));
      console.log("");
    }
  }

  if (rearguardConfig.has_ui_lib || rearguardConfig.has_node_lib) {
    const lib_entry = path.resolve(src, rearguardConfig.lib_entry);
    const basename = path.basename(lib_entry, ".ts");

    pkg.main = `${LIB_DIR_NAME}/${basename}.js`;
    pkg.module = `${LIB_DIR_NAME}/${basename}.js`;
    pkg.types = `${LIB_DIR_NAME}/${basename}.d.ts`;
  }

  /**
   * INIT SCRIPTS
   */

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  /**
   * BUILD_SCRIPTS
   */

  const args: string[] = [];

  if (rearguardConfig.has_dll) {
    args.push("--dll");
  }

  if (rearguardConfig.has_ui_lib) {
    args.push("--ui_lib");
  }

  if (rearguardConfig.has_node_lib) {
    args.push("--node_lib");
  }

  pkg.scripts.build = "rearguard build " + args.join(" ");
  pkg.scripts["build:release"] = "rearguard build -r " + args.join(" ");
  pkg.scripts["build:both"] = "rearguard build --both " + args.join(" ");

  /**
   * START
   */

  if (rearguardConfig.has_project) {
    pkg.scripts.start = "rearguard wds";
    pkg.scripts["start:release"] = "rearguard wds -r";

    if (rearguardConfig.has_dll) {
      if (!(rearguardConfig.has_ui_lib || rearguardConfig.has_node_lib)) {
        pkg.scripts.build = pkg.scripts.build.replace("--dll", "");
        pkg.scripts["build:release"] = pkg.scripts["build:release"].replace("--dll", "");
        pkg.scripts["build:both"] = pkg.scripts["build:both"].replace("--dll", "");
      }

      pkg.scripts.dll = "rearguard build --dll";
      pkg.scripts["dll:release"] = "rearguard build --dll -r";
    }

    if (!(rearguardConfig.has_ui_lib || rearguardConfig.has_node_lib)) {
      pkg.scripts.build += " --project";
      pkg.scripts["build:release"] += " --project";
      pkg.scripts["build:both"] += " --project";
    }
  } else {
    delete pkg.scripts.start;
    delete pkg.scripts["start:release"];

    delete pkg.scripts.dll;
    delete pkg.scripts["dll:release"];
  }

  /**
   * PRE_PUBLISH_ONLY
   */

  if (!rearguardConfig.has_dll && !rearguardConfig.has_ui_lib && rearguardConfig.has_node_lib) {
    pkg.scripts.prepublishOnly = "npm run build:release";
  } else {
    pkg.scripts.prepublishOnly = "npm run build:both";
  }

  fs.writeFileSync(pkg_path, prettier_package_json.format(pkg));

  // Config file
  typescriptConfig.init(true);
  tsLintConfig.init(true);
  prettierConfig.init(true);

  // Meta files init
  dockerIgnore.init(true);
  gitIgnore.init(true);
  editorConfig.init(true);
  npmrc.init(true);

  if (rearguardConfig.has_project || rearguardConfig.has_ui_lib) {
    prePublish.init(true);
    typings.init(true);
    postcssPlugins.init();
  }

  console.log("");

  await ordering_project_deps();
  await sync_with_linked_modules();

  if (rearguardConfig.has_project || rearguardConfig.has_dll || rearguardConfig.has_ui_lib) {
    await delete_bundles();
    await copy_bundles();
  }

  rearguardConfig.order_config_fields();

  console.log(chalk.bold.magenta(`============================================`));
  console.log("");
}
// tslint:enable:variable-name
