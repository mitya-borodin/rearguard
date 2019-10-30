import chalk from "chalk";
import * as del from "del";
import * as execa from "execa";
import * as fs from "fs";
import * as moment from "moment";
import * as path from "path";
import * as prettier from "prettier";
import * as PPJ from "prettier-package-json";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { DISTRIBUTIVE_DIR_NAME, PRETTIER_JSON_STRINGIFY } from "../../const";
import { processQueue } from "../../helpers/processQueue";
import { buildNodeApp } from "../procedures/buildNodeApp";
import { copyGlobalLinkedModules } from "../procedures/copyGlobalLinkedModules";
import { BuildExecutorOptions } from "../../interfaces/executors/BuildExecutorOptions";

export async function build_node_app(options: BuildExecutorOptions): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE ][ APP ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardConfig = new RearguardConfig(CWD);
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);
  const pkg = rearguardConfig.getPkg();
  const name = rearguardConfig.getName();

  await processQueue.getInQueue(name, options.bypass_the_queue);

  await rearguardLocalConfig.setBuildStatus("in_progress");

  // ! Remove distributive directory
  const paths = await del([path.resolve(CWD, DISTRIBUTIVE_DIR_NAME)]);

  if (paths.length > 0) {
    for (const item of paths) {
      console.log(chalk.gray(`[ REMOVE ][ ${path.relative(CWD, item)} ]`));
    }

    console.log("");
  }

  await copyGlobalLinkedModules(CWD);

  await buildNodeApp(CWD);

  // ! Create production package.json
  console.log(chalk.bold.blue(`[ COPY PKG TO DIST AND INSTALL DEPS FOR PRODUCTION ]`));
  console.log("");

  const prodPkg = {
    private: true,
    // tslint:disable-next-line: object-literal-sort-keys
    engines: pkg.engines,
    dependencies: pkg.dependencies,
  };
  const prodPkgFormatedJSON = JSON.parse(PPJ.format(prodPkg));
  const prodPkgPath = path.resolve(CWD, DISTRIBUTIVE_DIR_NAME, "package.json");
  const prodPkgContent = prettier.format(
    JSON.stringify(prodPkgFormatedJSON),
    PRETTIER_JSON_STRINGIFY,
  );

  fs.writeFileSync(prodPkgPath, prodPkgContent);

  try {
    const execaOptions: execa.Options = {
      cwd: path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
      stdout: "inherit",
      stderr: "inherit",
    };

    await execa("npm", ["install", "--production"], execaOptions);
  } catch (error) {
    console.error(error);
  }

  await rearguardLocalConfig.setBuildStatus("done");

  await processQueue.getOutQueue(name, options.bypass_the_queue);

  console.log("");
  console.log(
    chalk.bold.blue(
      `[ NODE ][ APP ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
