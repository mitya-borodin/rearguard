import { isArray, isBoolean, isDate, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { snakeCase } from "lodash";
import * as moment from "moment";
import { Moment } from "moment";
import * as path from "path";
import { BUNDLE_SUB_DIR } from "../../const";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { IRearguardConfig } from "../../interfaces/config/IRearguardConfig";
import { VersionableConfig } from "../VersionableConfig";

// tslint:disable:variable-name

export class RearguardConfig extends VersionableConfig implements IRearguardConfig {
  private envConfig: IEnvConfig;

  constructor(envConfig: IEnvConfig, config_path?: string) {
    super(config_path);

    this.envConfig = envConfig;
  }

  public get context(): string {
    const { context } = this.config;

    if (isString(context) && context.length > 0) {
      return context;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ context ][ must be a non empty string ]`));

    this.config = { context: "src" };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ context ][ assign to 'src' ]`));
    console.log("");

    return this.context;
  }

  public get entry(): string {
    const { entry } = this.config;

    if (isString(entry) && entry.length > 0) {
      return entry;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ entry ][ must be a non empty string ]`));

    this.config = { entry: "index.tsx" };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ entry ][ assign to 'index.tsx' ]`));
    console.log("");

    return this.entry;
  }

  public get dll_entry(): string {
    const { dll_entry } = this.config;

    if (isString(dll_entry) && dll_entry.length > 0) {
      return dll_entry;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ dll_entry ][ must be a non empty string ]`));

    this.config = { dll_entry: "vendors.ts" };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ dll_entry ][ assign to 'vendors.ts' ]`));
    console.log("");

    return this.dll_entry;
  }

  public get lib_entry(): string {
    const { lib_entry } = this.config;

    if (isString(lib_entry) && lib_entry.length > 0) {
      return lib_entry;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ lib_entry ][ must be a non empty string ]`));

    this.config = { lib_entry: "lib_exports.ts" };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ lib_entry ][ assign to 'lib_exports.ts' ]`));
    console.log("");

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
          console.log(chalk.bold.red(`[ RERGUARD_CONFIG ][ ERROR ][ module: ${i_m} must be a string ]`));

          has_error = true;
        }
      }

      if (!has_error && modules.length > 0) {
        console.log("");

        return [
          ...modules.map((dir_name) => path.resolve(process.cwd(), dir_name)),
          this.envConfig.resolveLocalModule(""),
          this.envConfig.resolveDevModule(""),
        ];
      }
    }

    if (!has_error && modules.length === 0) {
      console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ modules ][ must be not empty array of string ]`));
    }

    if (modules.length === 0) {
      modules.push("src");
    }

    this.config = { modules };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ modules ][ assign to [ ${modules.join(", ")} ] ]`));
    console.log("");

    return this.modules;
  }

  public get output(): { path: string; publicPath: string } {
    const { output } = this.config;

    if (
      output &&
      isString(output.path) &&
      output.path.length > 0 &&
      isString(output.publicPath) &&
      output.publicPath.length
    ) {
      return {
        path: path.resolve(process.cwd(), output.path),
        publicPath: output.publicPath,
      };
    }

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

    console.log(
      chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ output ][ output assign to '{ path: "dist", publicPath: "/" }' ]`),
    );
    console.log("");

    return this.output;
  }

  public get bundle_public_path(): string {
    return path.normalize(`${this.output.publicPath}/${snakeCase(this.pkg.name)}/${BUNDLE_SUB_DIR()}/`);
  }

  public get post_css_plugins_path(): string {
    const { post_css_plugins_path } = this.config;

    if (isString(post_css_plugins_path) && post_css_plugins_path.length > 0) {
      return post_css_plugins_path;
    }

    console.log(
      chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ post_css_plugins_path ][ must be a non empty string ]`),
    );

    this.config = { post_css_plugins_path: "post_css_plugins.js" };

    console.log(
      chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ post_css_plugins_path ][ assign to 'post_css_plugins.js' ]`),
    );
    console.log("");

    return this.post_css_plugins_path;
  }

  public get sync_project_deps(): string[] {
    const { sync_project_deps: a_sync_project_deps } = this.config;
    const sync_project_deps: string[] = [];
    let has_error = false;

    if (isArray(a_sync_project_deps)) {
      for (const i_s of a_sync_project_deps) {
        if (isString(i_s)) {
          sync_project_deps.push(i_s);
        } else {
          console.log(chalk.bold.red(`[ RERGUARD_CONFIG ][ ERROR ][ sync_npm_dep: ${i_s} must be a string ]`));

          has_error = true;
        }
      }

      if (!has_error) {
        return sync_project_deps;
      }
    }

    console.log(
      chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ sync_project_deps ][ must be not empty array of string ]`),
    );

    this.config = { sync_project_deps };

    console.log(
      chalk.bold.green(
        `[ RERGUARD_CONFIG ][ INIT ][ sync_project_deps ][ assign to [ ${sync_project_deps.join(", ")} ] ]`,
      ),
    );
    console.log("");

    return this.sync_project_deps;
  }

  public set sync_project_deps(sync_project_deps: string[]) {
    this.config = { sync_project_deps };
  }

  /**
   * Среда может содержать три флага:
   * has_dll: boolean; - говорит, о том, что в директории dll_bundle/%(package.json).name% собран бандл и manifest.json;
   * has_node_lib: boolean; - говорит, о том, что в директории lib находятся .js, .d.ts файлы;
   * has_browser_lib: boolean; - говорит, о том, что в директории lib_bundle/%(package.json).name% собран бандл и
   * manifest.json;
   *
   * Эти флаги используются только для копирования собранных файлов из директорий dll_bundle, lib_bundle, lib;
   */

  // HAS_DLL
  // Говорит, о том, что в директории dll_bundle/%(package.json).name% собран бандл и manifest.json;
  public get has_dll(): boolean {
    const { has_dll } = this.config;

    if (isBoolean(has_dll)) {
      return has_dll;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ has_dll ][ must be a boolean ]`));

    this.config = { has_dll: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ has_dll ][ assign to 'false' ]`));
    console.log("");

    return this.has_dll;
  }

  public set has_dll(has_dll: boolean) {
    this.config = { has_dll };
  }

  // HAS_NODE_LIB
  // Говорит, о том, что в директории lib находятся .js, .d.ts файлы;
  public get has_node_lib(): boolean {
    const { has_node_lib } = this.config;

    if (isBoolean(has_node_lib)) {
      return has_node_lib;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ has_node_lib ][ must be a boolean ]`));

    this.config = { has_node_lib: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ has_node_lib ][ assign to 'false' ]`));
    console.log("");

    return this.has_node_lib;
  }

  public set has_node_lib(has_node_lib: boolean) {
    this.config = { has_node_lib };
  }

  // has_browser_lib
  // Говорит, о том, что в директории lib_bundle/%(package.json).name% собран бандл и assets.json;
  public get has_browser_lib(): boolean {
    const { has_browser_lib } = this.config;

    if (isBoolean(has_browser_lib)) {
      return has_browser_lib;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ has_browser_lib ][ must be a boolean ]`));

    this.config = { has_browser_lib: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ has_browser_lib ][ assign to 'false' ]`));
    console.log("");

    return this.has_browser_lib;
  }

  public set has_browser_lib(has_browser_lib: boolean) {
    this.config = { has_browser_lib };
  }

  // IS_APPLICATION
  // Говорит, о том, что проект можно собарть как файлы без экспортов, для заливки на сервер;
  public get is_application(): boolean {
    const { is_application } = this.config;

    if (isBoolean(is_application)) {
      return is_application;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ is_application ][ must be a boolean ]`));

    this.config = { is_application: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ is_application ][ assign to 'false' ]`));
    console.log("");

    return this.is_application;
  }

  public set is_application(is_application: boolean) {
    this.config = { is_application };
  }

  // LOAD_ON_DEMAND
  // Говорит, о том, что библиотека не будет автоматически добавлена в index.html, а будет
  // добавлена информация о том, где она расположена на сервере, для загрузки во времени выполнения.
  public get load_on_demand(): boolean {
    const { load_on_demand } = this.config;

    if (isBoolean(load_on_demand)) {
      return load_on_demand;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ load_on_demand ][ must be a boolean ]`));

    this.config = { load_on_demand: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ load_on_demand ][ assign to 'false' ]`));
    console.log("");

    return this.load_on_demand;
  }

  public set load_on_demand(load_on_demand: boolean) {
    this.config = { load_on_demand };
  }

  // PUBLISH_IN_GIT
  // Говорит о том, что необходимо оставить под версионированием директории указанные в (package.json).files;
  public get publish_in_git(): boolean {
    const { publish_in_git } = this.config;

    if (isBoolean(publish_in_git)) {
      return publish_in_git;
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ publish_in_git ][ must be a boolean ]`));

    this.config = { publish_in_git: false };

    console.log(chalk.bold.green(`[ RERGUARD_CONFIG ][ INIT ][ publish_in_git ][ assign to 'false' ]`));
    console.log("");

    return this.publish_in_git;
  }

  // ! LAST_BUILD_TIME
  // ! Время последней сборки.
  public get last_build_time(): Moment {
    const { last_build_time } = this.config;

    if (isDate(last_build_time)) {
      return moment(new Date(last_build_time)).utc();
    }

    console.log(chalk.bold.yellow(`[ RERGUARD_CONFIG ][ WARNING ][ last_build_time ][ must be a Date ]`));

    const def_last_build_time = moment().utc();

    this.config = { last_build_time: def_last_build_time.toDate() };

    console.log(
      chalk.bold.green(
        `[ RERGUARD_CONFIG ][ INIT ][ last_build_time ]` +
          `[ assign to ${def_last_build_time.format("YYYY-MM-DD HH:mm ZZ")} ]`,
      ),
    );
    console.log("");

    return this.last_build_time;
  }

  public set last_build_time(last_build_time: Moment) {
    this.config = { last_build_time: last_build_time.utc().toISOString() };
  }
}

// tslint:enable:variable-name
