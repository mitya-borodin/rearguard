import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { prettierConfig } from "../config/prettier";
import { rearguardConfig } from "../config/rearguard";
import { tsLintConfig } from "../config/tslint";
import { typescriptConfig } from "../config/typescript";
import { dockerIgnore } from "../meta/dockerignore";
import { editorConfig } from "../meta/editorConfig";
import { gitIgnore } from "../meta/gitignore";
import { postcssPlugins } from "../meta/postcssPlugins";
import { prePublish } from "../meta/PrePublish";
import { typings } from "../meta/Typings";
import { npmrc } from "./../meta/Npmrc/index";
/* import { copy_bundles } from "./project_deps/copy_bundles";
import { ordering_project_deps } from "./project_deps/ordering_project_deps";
import { sync_with_linked_modules } from "./project_deps/sync_with_linked_modules";
 */
// tslint:disable:variable-name
export async function initProject() {
  const pkg_path = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(pkg_path)) {
    console.log(chalk.red(`[ INIT ][ ERROR ][ You haven't package.json, you should do npm init ]`));

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
    fs.writeFileSync(entry, `console.log("Точка входа в проект");`);
  }

  if (!fs.existsSync(dll_entry)) {
    fs.writeFileSync(dll_entry, `// В этом файле указываются импорты пакетов, которые необходимо вынести в dll;`);
  }

  if (!fs.existsSync(lib_entry)) {
    fs.writeFileSync(lib_entry, `// Точка экспорта API из библиотеки.`);
  }

  // Scripts init
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  if (!isString(pkg.scripts.start)) {
    pkg.scripts.start = "rearguard wds";
  }

  if (!isString(pkg.scripts.build)) {
    pkg.scripts.build = "rearguard build";
  }

  if (!isString(pkg.scripts.lint)) {
    pkg.scripts.lint = "echo 'do lint'";
  }

  if (!isString(pkg.scripts.test)) {
    pkg.scripts.test = "echo 'do test'";
  }

  if (!isString(pkg.scripts.prepush)) {
    pkg.scripts.prepush = "sh ./pre_publish.sh";
  }

  if (!isString(pkg.scripts.prepublishOnly)) {
    pkg.scripts.prepublishOnly = "sh ./pre_publish.sh";
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

  /*   await ordering_project_deps();
  await sync_with_linked_modules();
  await copy_bundles(); */
}
// tslint:enable:variable-name
