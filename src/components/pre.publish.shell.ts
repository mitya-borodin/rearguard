import chalk from "chalk";
import * as fs from "fs";
import * as moment from "moment";
import * as path from "path";
import { root } from "./target.config";

export function pre_publish_shell() {
  console.log(chalk.bold.blue(`===============PRE_PUBLISH_SHELL============`));
  console.log(chalk.bold.blue(`[ PRE_PUBLISH_SHELL ][ RUN ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log("");

  // tslint:disable-next-line:variable-name
  const file_direction = path.resolve(root, "pre_publish.sh");

  fs.writeFileSync(
    file_direction,
    `#!/bin/bash
cwd=$(pwd)
tgdir=$cwd/pre_publish_build_tmp


mkdir $tgdir
cd $tgdir

git clone $cwd .

npm i
npm run lint
npm run test
npm run build

cd ..
rm -rf $tgdir

echo "Pre publish test well done;"

exit 0`,
  );

  console.log(chalk.white(`[ PRE_PUBLISH_SHELL_FILE: ${file_direction} ]`));

  console.log("");
  console.log(chalk.bold.blue(`[ PRE_PUBLISH_SHELL ][ DONE ][ ${moment().format("YYYY-MM-DD hh:mm:ss ZZ")} ]`));
  console.log(chalk.bold.blue(`=======================================`));
  console.log("");
}
