import * as fs from "fs";
import * as path from "path";
import * as copy from "copy";
import { Template } from "../Template";
import { PUBLIC_DIR_NAME } from "../../const";
import File = require("vinyl");
import chalk from "chalk";

export const indexHtmlTemplate = new Template(
  "index.html",
  `${PUBLIC_DIR_NAME}/index.html`,
  __dirname,
);

export const copyPublicAssets = async (CWD: string, force = false): Promise<void> => {
  const pathToSource = path.resolve(__dirname, "public");
  const pathToDestination = path.resolve(CWD, "public");
  const toCopy: string[] = [];

  if (fs.existsSync(pathToSource)) {
    const sourceFiles = fs.readdirSync(pathToSource);

    for (const sourceFile of sourceFiles) {
      const pathToSourceFile = path.resolve(pathToSource, sourceFile);
      const pathToDestinationFile = path.resolve(pathToDestination, sourceFile);

      if (!fs.existsSync(pathToDestinationFile) || force) {
        toCopy.push(pathToSourceFile);
      }
    }
  }

  console.log(toCopy, pathToDestination);

  if (toCopy.length > 0) {
    await new Promise((resolve, reject): void => {
      copy(toCopy, "public", { cwd: CWD }, (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files && files.length > 0) {
            console.log(chalk.cyan(`[ COPY ][ PUBLIC FILE ][ ${files.length} FILES ]`));
          }

          resolve();
        } else {
          reject(error);
        }
      });
    });
  }
};
