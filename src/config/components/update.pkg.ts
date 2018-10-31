import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as moment from "moment";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { configFileName } from "../../const";
import { dist_dir_name, dll_bundle_dirname, isDll, isLib, lib_bundle_dirname, root } from "./target.config";

export async function update_pkg() {
  console.log(chalk.bold.blue(`===============PACKAGE.JSON============`));
  const startTime = moment();
  console.log(chalk.bold.blue(`[ PACKAGE.JSON ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  const pkgPath = path.resolve(root, "package.json");

  if (fs.existsSync(pkgPath)) {
    let pkg = require(pkgPath);

    // Дополнительные флаги.
    pkg.isDLL = false;
    pkg.isLibrary = false;
    pkg.isProject = false;

    if (isDll) {
      pkg.files = [dll_bundle_dirname, configFileName];
      pkg.isDLL = true;
    }

    if (isLib) {
      pkg.files = [dll_bundle_dirname, lib_bundle_dirname, "lib", configFileName];
      pkg.isLibrary = true;
    }

    if (!isDll && !isLib) {
      pkg.files = [dist_dir_name, configFileName];
      pkg.isProject = true;
    }

    if (!isString(pkg.scripts.lint)) {
      pkg.scripts.lint = "echo 'do lint'";
    }
    if (!isString(pkg.scripts.build)) {
      pkg.scripts.build = "echo 'do build'";
    }
    if (!isString(pkg.scripts.test)) {
      pkg.scripts.test = "echo 'do test'";
    }
    if (!isString(pkg.scripts["pre-commit"])) {
      pkg.scripts["pre-commit"] = "sh ./pre_publish.sh";
    }

    pkg = prettier_package_json.format(pkg);

    console.log(chalk.white(`[ PACKAGE.JSON ][ UPDATED: ${pkgPath} ]`));

    fs.writeFileSync(pkgPath, pkg);
  } else {
    console.log(chalk.red(`[ PACKAGE.JSON ][ IS_NOT_EXIST: ${pkgPath} ]`));
  }

  const endTime = moment();

  console.log("");
  console.log(
    chalk.bold.blue(`[ PACKAGE.JSON ][ WORK_TIME ][ ${endTime.diff(startTime, "milliseconds")} ][ millisecond ]`),
  );
  console.log(chalk.bold.blue(`[ PACKAGE.JSON ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");
}
