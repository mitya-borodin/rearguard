import { isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { execSync } from "child_process";
import * as spawn from "cross-spawn";
import * as path from "path";
import * as semver from "semver";
import { envConfig } from "../../config/env";
import { RearguardConfig } from "../../config/rearguard/RearguardConfig";

// tslint:disable:variable-name

export async function publish(CWD: string) {
  const rearguardConfig = new RearguardConfig(envConfig, path.resolve(CWD, "package.json"));

  if (!rearguardConfig.publish_in_git) {
    const cur_name = rearguardConfig.pkg.name;
    const cur_version = rearguardConfig.pkg.version;
    let pub_version: string = "1.0.0";
    console.log(chalk.bold.green(`[ ${cur_name} ][ PUBLISH ]`));
    console.log("");

    let was_published = false;
    const search_result = execSync(`npm search --json ${cur_name}`, { encoding: "utf8" });

    try {
      const result: Array<{ [key: string]: any }> = JSON.parse(search_result);

      if (Array.isArray(result) && result.length > 0) {
        for (const item of result) {
          if (item.name === cur_name) {
            was_published = true;
            pub_version = item.version;
            break;
          }
        }
      }

      if (was_published) {
        if (cur_version === pub_version || semver.lt(cur_version, pub_version)) {
          let release: "patch" | "minor" | "major" = "patch";

          if (envConfig.is_mono_publish_minor) {
            release = "minor";
          }

          if (envConfig.is_mono_publish_major) {
            release = "major";
          }

          const target_version = semver.inc(pub_version, release);

          if (isString(target_version) && semver.valid(target_version)) {
            rearguardConfig.pkg = { version: target_version };
          } else {
            throw new Error(`[ MONOREPO ][ PUBLISH ][ target version is not valid ]`);
          }
        }
      }

      if (semver.valid(rearguardConfig.pkg.version)) {
        const publish_result = spawn.sync("npm", ["publish"], {
          cwd: CWD,
          encoding: "utf8",
          stdio: "inherit",
        });

        if (publish_result.signal) {
          if (publish_result.signal === "SIGKILL") {
            console.log(
              chalk.red(
                "The build failed because the process exited too early. " +
                  "This probably means the system ran out of memory or someone called `kill -9` on the process.",
              ),
            );

            process.exit(1);
          } else if (publish_result.signal === "SIGTERM") {
            console.log(
              chalk.bold.red(
                "The build failed because the process exited too early. " +
                  "Someone might have called `kill` or `killall`, or the system could be shutting down.",
              ),
            );

            process.exit(1);
          }

          process.exit(0);
        }
      } else {
        throw new Error(`[ MONOREPO ][ PUBLISH ][ current version is not valid ]`);
      }
    } catch (error) {
      console.error(error);
    }

    console.log(chalk.green(`[ ${cur_name} ][ PUBLISH ][ END ]`));
    console.log("");
  }
}
// tslint:enable:variable-name
