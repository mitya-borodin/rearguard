import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import {context} from "../config/components/target.config";

export default function setTypingForAllCSSandFiles() {
  const tmpTypings = path.resolve(__dirname, "../../../templates");

  del([path.resolve(context, "**/*.css.d.ts")]).then((paths) => {
    for (const item of paths) {
      console.log(chalk.bold.yellowBright("[REMOVED *.css.d.ts]"), chalk.cyan(item));
    }

    copy([`${tmpTypings}/*.d.ts`], context, (error: any, files: any[]) => {
      if (!error) {
        for (const file of files) {
          console.log(chalk.bold.yellowBright("[SET TYPING]"), chalk.cyan(file.path));
        }
      } else {
        console.error(error);
      }
    });
  });

  console.log(`\n\r`);
}
