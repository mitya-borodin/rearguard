import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as moment from "moment";
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
import { ordering_project_deps } from "./project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "./project_deps/sync_with_linked_modules";

// tslint:disable:variable-name
export async function initProject() {
  console.log(chalk.bold.blue(`=================INIT_PROJECT===============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ INIT_PROJECT ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log("");

  const pkg_path = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(pkg_path)) {
    console.log(chalk.red(`[ INIT ][ ERROR ][ You haven't package.json, you should do npm init ]`));
    console.log("");

    process.exit(1);
  }

  const pkg = require(pkg_path);
  const src = path.resolve(process.cwd(), "src");
  const entry = path.resolve(src, rearguardConfig.entry);
  const dll_entry = path.resolve(src, rearguardConfig.dll_entry);
  const lib_entry = path.resolve(src, rearguardConfig.lib_entry);

  // Init entries
  mkdirp.sync(src);

  if (!fs.existsSync(entry)) {
    fs.writeFileSync(entry, `// Точка входа в проект;\n\r`);

    console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${entry} ]`));
    console.log("");
  }

  if (!fs.existsSync(dll_entry)) {
    fs.writeFileSync(dll_entry, `// В этом файле указываются импорты пакетов, которые необходимо вынести в dll;\n\r`);

    console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${dll_entry} ]`));
    console.log("");
  }

  if (!fs.existsSync(lib_entry)) {
    fs.writeFileSync(lib_entry, `// Точка экспорта API из библиотеки;\n\r`);

    console.log(chalk.green(`[ ENTRY_FILE ][ INIT ][ ${lib_entry} ]`));
    console.log("");
  }

  if (!isString(pkg.main) || !isString(pkg.module) || !isString(pkg.types)) {
    const basename = path.basename(lib_entry, ".ts");

    pkg.main = `${LIB_DIR_NAME}/${basename}.js`;
    pkg.module = `${LIB_DIR_NAME}/${basename}.js`;
    pkg.types = `${LIB_DIR_NAME}/${basename}.d.ts`;

    console.log(
      chalk.green(`[ ENTRY_POINTS ][ INIT ][ main: ${pkg.main} ][ module: ${pkg.module} ][ types: ${pkg.types} ]`),
    );
    console.log("");
  }

  // Scripts init
  if (!pkg.scripts) {
    pkg.scripts = {};

    console.log(chalk.green(`[ SCRIPTS ][ INIT ]`));
  }

  if (!isString(pkg.scripts.start)) {
    pkg.scripts.start = "rearguard wds";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ START ]`));
  }

  if (!isString(pkg.scripts["start:release"])) {
    pkg.scripts["start:release"] = "rearguard wds -r";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ START:RELEASE ]`));
  }

  if (!isString(pkg.scripts["start:debug"])) {
    pkg.scripts["start:debug"] = "rearguard wds -d";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ START:DEBUG ]`));
  }

  if (!isString(pkg.scripts.build)) {
    pkg.scripts.build = "rearguard build --dll --ui_lib --node_lib";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ BUILD ]`));
  }

  if (!isString(pkg.scripts["build:release"])) {
    pkg.scripts["build:release"] = "rearguard build -r --dll --ui_lib --node_lib";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ BUILD:RELEASE ]`));
  }

  if (!isString(pkg.scripts["build:debug"])) {
    pkg.scripts["build:debug"] = "rearguard build -d --dll --ui_lib --node_lib";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ BUILD:DEBUG ]`));
  }

  if (!isString(pkg.scripts.dll)) {
    pkg.scripts.dll = "rearguard build --dll";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ DLL ]`));
  }

  if (!isString(pkg.scripts["dll:release"])) {
    pkg.scripts["dll:release"] = "rearguard build -r --dll";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ DLL:RELEASE ]`));
  }

  if (!isString(pkg.scripts["dll:debug"])) {
    pkg.scripts["dll:debug"] = "rearguard build -d --dll";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ DLL:DEBUG ]`));
  }

  if (!isString(pkg.scripts.lint)) {
    pkg.scripts.lint = "tslint --fix -c tslint.json 'src/**/*.ts' 'src/**/*.tsx'";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ LINT ]`));
  }

  if (!isString(pkg.scripts.test)) {
    pkg.scripts.test = "rearguard test";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ TEST ]`));
  }

  if (!isString(pkg.scripts.pretest)) {
    pkg.scripts.pretest = "npm run lint";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ PRE_TEST ]`));
  }

  if (!isString(pkg.scripts.prepush)) {
    pkg.scripts.prepush = "npm run build && sh ./pre_publish.sh";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ PRE_PUSH ]`));
  }

  if (!isString(pkg.scripts.prepublishOnly)) {
    pkg.scripts.prepublishOnly = "npm run build && sh ./pre_publish.sh";

    console.log(chalk.green(`[ SCRIPTS ][ INIT ][ PRE_PUBLISH_ONLY ]`));
    console.log("");
  }

  if (envConfig.isBuild) {
    if (envConfig.has_dll) {
      rearguardConfig.has_dll = true;
    }

    if (envConfig.has_ui_lib) {
      rearguardConfig.has_ui_lib = true;
    }

    if (envConfig.has_node_lib) {
      rearguardConfig.has_node_lib = true;
    }
  }

  if (rearguardConfig.has_dll || rearguardConfig.has_ui_lib || rearguardConfig.has_node_lib) {
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
  }

  fs.writeFileSync(pkg_path, prettier_package_json.format(pkg));

  // Config file
  prettierConfig.init();
  typescriptConfig.init();
  tsLintConfig.init();

  // Meta files init
  dockerIgnore.init();
  gitIgnore.init();
  editorConfig.init();
  npmrc.init();
  prePublish.init();
  typings.init();
  postcssPlugins.init();

  await ordering_project_deps();
  await sync_with_linked_modules();
  await copy_bundles();

  const endTime = moment();

  console.log("");
  console.log(
    chalk.bold.blue(`[ INIT_PROJECT ][ INTI_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
  );
  console.log(chalk.bold.blue(`[ INIT_PROJECT ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss")} ]`));
  console.log(chalk.bold.blue(`============================================`));
  console.log("");
}
// tslint:enable:variable-name
