import { isArray, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { VersionableConfig } from "../VersionableConfig";

export class RearguardConfig extends VersionableConfig {
  public get context(): string {
    const { context } = this.config;

    if (isString(context) && context.length > 0) {
      return context;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ context ][ must be a non empty string ]`));

    this.config = { context: "src" };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ context ][ context assign to 'src' ]`));
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.context;
  }

  public get entry(): string {
    const { entry } = this.config;

    if (isString(entry) && entry.length > 0) {
      return entry;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ entry ][ must be a non empty string ]`));

    this.config = { entry: "index.tsx" };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ entry ][ entry assign to 'index.tsx' ]`));
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.entry;
  }

  public get dll_entry(): string {
    const { dll_entry } = this.config;

    if (isString(dll_entry) && dll_entry.length > 0) {
      return dll_entry;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ dll_entry ][ must be a non empty string ]`));

    this.config = { dll_entry: "vendors.ts" };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ dll_entry ][ dll_entry assign to 'vendors.ts' ]`));
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.dll_entry;
  }

  public get lib_entry(): string {
    const { lib_entry } = this.config;

    if (isString(lib_entry) && lib_entry.length > 0) {
      return lib_entry;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ lib_entry ][ must be a non empty string ]`));

    this.config = { lib_entry: "lib_exports.ts" };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ lib_entry ][ lib_entry assign to 'lib_exports.ts' ]`));
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.lib_entry;
  }

  public get modules(): string[] {
    const { modules } = this.config;

    if (isArray(modules) && modules.length > 0) {
      // tslint:disable-next-line:variable-name
      const modules_result: string[] = [];

      for (const m of modules) {
        if (isString(m)) {
          modules_result.push(m);
        } else {
          console.log("");
          console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ ERROR ][ module: ${m} ][ must be a string ]`));

          process.exit(1);
        }
      }

      if (modules_result.length > 0) {
        return modules_result;
      }
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ modules ][ must be not empty Array<string> ]`));

    this.config = { modules: ["src"] };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ modules ][ modules assign to ["src"] ]`));
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.modules;
  }

  public get output(): { path: string; publicPath: string } {
    const { output } = this.config;

    if (isString(output.path) && output.path.length > 0 && isString(output.publicPath) && output.publicPath.length) {
      return output;
    }

    console.log("");
    console.log(
      chalk.bold.yellow(
        `[ RERGUARD_CONFIG ][ WARNING ][ output ][ must include { path: string, publicPath: string } ]`,
      ),
    );

    this.config = {
      output: {
        path: "dist",
        publicPath: "/",
      },
    };

    console.log("");
    console.log(
      chalk.bold.green(
        `[ RERGUARD_CONFIG ][ WRITE ][ output ][ output assign to '{ path: "dist", publicPath: "/" }' ]`,
      ),
    );
    console.log(chalk.bold.green(JSON.stringify(this.config, null, 2)));

    return this.output;
  }
}
