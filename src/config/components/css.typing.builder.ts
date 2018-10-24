import chalk from "chalk";
import * as copy from "copy";
import * as del from "del";
import * as path from "path";
import { context } from "./target.config";

export async function css_typing_builder() {
  await new Promise((resolve, reject) => {
    const tmpTypings = path.resolve(__dirname, "../../../templates");

    del([path.resolve(context, "**/*.css.d.ts")]).then((paths) => {
      for (const item of paths) {
        console.log(chalk.yellow("[ REMOVED *.css.d.ts ]"), chalk.cyan(item));
      }

      if (paths.length > 0) {
        console.log("");
      }

      copy([`${tmpTypings}/*.d.ts`], context, (error: any, files: any[]) => {
        if (!error) {
          for (const file of files) {
            console.log(chalk.bold.cyanBright("[ SET TYPING ]"));
            console.log(chalk.cyanBright(file.path));
          }

          if (files.length > 0) {
            console.log("");
          }

          resolve();
        } else {
          console.error(error);
          reject();
        }
      });
    });
  });
}
