import chalk from "chalk";
import * as moment from "moment";
import { RearguardLocalConfig } from "../../configs/RearguardLocalConfig";
import { buildLib } from "../procedures/buildLib";
import { updatePkgFiles } from "../procedures/updatePkgFiles";

export async function build_node_lib(): Promise<void> {
  console.log(chalk.bold.blue(`[ NODE ][ LIB ][ BUILD ][ START ]`));
  console.log("");
  const startTime = moment();

  const CWD: string = process.cwd();
  const rearguardLocalConfig = new RearguardLocalConfig(CWD);

  await rearguardLocalConfig.setBuildStatus("in_progress");
  await updatePkgFiles(CWD);

  await buildLib(CWD);

  await rearguardLocalConfig.setBuildStatus("done");

  console.log(
    chalk.bold.blue(
      `[ NODE ][ LIB ][ BUILD ][ FINISH ][ ${moment().diff(startTime, "milliseconds")} ms ]`,
    ),
  );
  console.log("");
}
