import { isArray, isBoolean, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { VersionableConfig } from "../VersionableConfig";

// tslint:disable:variable-name

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
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ context ][ assign to 'src' ]`));

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
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ entry ][ assign to 'index.tsx' ]`));

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
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ dll_entry ][ assign to 'vendors.ts' ]`));

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
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ lib_entry ][ assign to 'lib_exports.ts' ]`));

    return this.lib_entry;
  }

  public get modules(): string[] {
    const { modules: a_modules } = this.config;
    const modules: string[] = [];
    let has_error = false;

    if (isArray(a_modules) && a_modules.length > 0) {
      for (const i_m of a_modules) {
        if (isString(i_m)) {
          modules.push(i_m);
        } else {
          console.log("");
          console.log(chalk.bold.red(`[ RERGUARD_CONFIG ][ ERROR ][ module: ${i_m} must be a string ]`));

          has_error = true;
        }
      }

      if (!has_error && modules.length > 0) {
        return modules;
      }
    }

    if (!has_error && modules.length === 0) {
      console.log("");
      console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ modules ][ must be not empty array of string ]`));
    }

    if (modules.length === 0) {
      modules.push("src");
    }

    this.config = { modules };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ modules ][ assign to [ ${modules.join(", ")} ] ]`));

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

    return this.output;
  }

  public get post_css_plugins_path(): string {
    const { post_css_plugins_path } = this.config;

    if (isString(post_css_plugins_path) && post_css_plugins_path.length > 0) {
      return post_css_plugins_path;
    }

    console.log("");
    console.log(
      chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ post_css_plugins_path ][ must be a non empty string ]`),
    );

    this.config = { post_css_plugins_path: "post_css_plugins.js" };

    console.log("");
    console.log(
      chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ post_css_plugins_path ][ assign to 'post_css_plugins.js' ]`),
    );

    return this.post_css_plugins_path;
  }

  public get sync_npm_deps(): string[] {
    const { sync_npm_deps: a_sync_npm_deps } = this.config;
    const sync_npm_deps: string[] = [];
    let has_error = false;

    if (isArray(a_sync_npm_deps) && a_sync_npm_deps.length > 0) {
      for (const i_s of a_sync_npm_deps) {
        if (isString(i_s)) {
          sync_npm_deps.push(i_s);
        } else {
          console.log("");
          console.log(chalk.bold.red(`[ RERGUARD_CONFIG ][ ERROR ][ sync_npm_dep: ${i_s} must be a string ]`));

          has_error = true;
        }
      }

      if (!has_error && sync_npm_deps.length > 0) {
        return sync_npm_deps;
      }
    }

    if (!has_error) {
      console.log("");
      console.log(
        chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ sync_npm_deps ][ must be not empty array of string ]`),
      );
    }

    this.config = { sync_npm_deps };

    console.log("");
    console.log(
      chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ sync_npm_deps ][ assign to [ ${sync_npm_deps.join(", ")} ] ]`),
    );

    return this.sync_npm_deps;
  }

  public get is_project(): boolean {
    const { is_project } = this.config;

    if (isBoolean(is_project)) {
      return is_project;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ is_project ][ must be a boolean ]`));

    this.config = { is_project: false };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ is_project ][ assign to 'false' ]`));

    return this.is_project;
  }

  public set is_project(is_project: boolean) {
    this.config = { is_project };
  }

  public get is_node_lib(): boolean {
    const { is_node_lib } = this.config;

    if (isBoolean(is_node_lib)) {
      return is_node_lib;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ is_node_lib ][ must be a boolean ]`));

    this.config = { is_node_lib: false };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ is_node_lib ][ assign to 'false' ]`));

    return this.is_node_lib;
  }

  public set is_node_lib(is_node_lib: boolean) {
    this.config = { is_node_lib };
  }

  public get is_ui_lib(): boolean {
    const { is_ui_lib } = this.config;

    if (isBoolean(is_ui_lib)) {
      return is_ui_lib;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ is_ui_lib ][ must be a boolean ]`));

    this.config = { is_ui_lib: false };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ is_ui_lib ][ assign to 'false' ]`));

    return this.is_ui_lib;
  }

  public set is_ui_lib(is_ui_lib: boolean) {
    this.config = { is_ui_lib };
  }

  public get is_dll(): boolean {
    const { is_dll } = this.config;

    if (isBoolean(is_dll)) {
      return is_dll;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ is_dll ][ must be a boolean ]`));

    this.config = { is_dll: false };

    console.log("");
    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ WRITE ][ is_dll ][ assign to 'false' ]`));

    return this.is_dll;
  }

  public set is_dll(is_dll: boolean) {
    this.config = { is_dll };
  }
}

// tslint:enable:variable-name
