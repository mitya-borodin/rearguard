import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { context, dll_entry, entry as main_entry, isDll, isLib, isWDS, lib_entry } from "./target.config";

export function check_project() {
  if (isDll) {
    const entry = path.resolve(context, dll_entry);

    if (!fs.existsSync(entry)) {
      console.log(chalk.bold.red(`[ CHECK_PROJECT ][ ERROR ][ dll_entry: ${entry} NOT_FOUND ]`));
      console.log("");

      process.exit(1);
    }
  }

  if (isLib) {
    const entry = path.resolve(context, lib_entry);

    if (!fs.existsSync(entry)) {
      console.log(chalk.bold.red(`[ CHECK_PROJECT ][ ERROR ][ lib_entry: ${entry} NOT_FOUND ]`));
      console.log("");

      process.exit(1);
    }
  }

  if (isWDS) {
    const entry = path.resolve(context, main_entry);

    if (!fs.existsSync(entry)) {
      console.log(chalk.bold.red(`[ CHECK_PROJECT ][ ERROR ][ entry: ${entry} NOT_FOUND ]`));
      console.log("");

      process.exit(1);
    }
  }
}
