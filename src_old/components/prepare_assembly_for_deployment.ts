import chalk from "chalk";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";

// tslint:disable: variable-name
export async function prepare_assembly_for_deployment(
  rearguardConfig: IRearguardConfig,
  target = "dist",
): Promise<void> {
  console.log(chalk.bold.blue(`[ PREPARE_ASSEMBLY_FOR_DEPLOYMENT ][ START ]`));
  console.log("");

  const { pkg } = rearguardConfig;
  const pkg_production = {
    private: true,
    // tslint:disable-next-line: object-literal-sort-keys
    engines: pkg.engines,
    dependencies: pkg.dependencies,
  };
  const pkg_path = path.resolve(process.cwd(), target, "package.json");
  const pkg_text = prettier_package_json.format(pkg_production);

  fs.writeFileSync(pkg_path, pkg_text.trim());

  const command = "npm install --production";

  console.log(chalk.white(command));
  console.log("");

  execSync(command, {
    cwd: path.resolve(process.cwd(), target),
    encoding: "utf8",
    stdio: "inherit",
  });

  console.log(chalk.bold.blue(`[ PREPARE_ASSEMBLY_FOR_DEPLOYMENT ][ END ]`));
  console.log("");
}
