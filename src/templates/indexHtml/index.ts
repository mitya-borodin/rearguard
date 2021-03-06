import chalk from "chalk";
import del from "del";
import fs from "fs";
import path from "path";
import { PUBLIC_DIR_NAME } from "../../const";
import { Template } from "../Template";
import { mkdir } from "../../helpers/mkdir";

export const indexHtmlTemplate = new Template(
  "index.html",
  `${PUBLIC_DIR_NAME}/index.html`,
  __dirname,
);

export const copyPublicAssets = async (CWD: string, force = false): Promise<void> => {
  const pathToSource = path.resolve(__dirname, "public");
  const pathToDestination = path.resolve(CWD, "public");
  const fileNames: string[] = [];

  if (fs.existsSync(pathToSource)) {
    const sourceFileNames = fs.readdirSync(pathToSource);

    for (const sourceFileName of sourceFileNames) {
      const pathToDestinationFile = path.resolve(pathToDestination, sourceFileName);

      if (!fs.existsSync(pathToDestinationFile) || force) {
        fileNames.push(sourceFileName);
      }
    }
  }

  if (fileNames.length > 0) {
    const paths = await del(fileNames.map((fileName) => path.resolve(pathToDestination, fileName)));

    if (paths.length > 0) {
      console.log(chalk.bold.gray(`[ CLEAN ]`));

      for (const item of paths) {
        console.log(chalk.gray(`[ REMOVE ][ ${path.relative(process.cwd(), item)} ]`));
      }

      console.log("");
    }

    for (const fileName of fileNames) {
      const pathToSourceFile = path.resolve(pathToSource, fileName);
      const pathToDestinationFile = path.resolve(pathToDestination, fileName);

      mkdir(pathToDestination);

      fs.copyFileSync(pathToSourceFile, pathToDestinationFile);
    }

    console.log(chalk.cyan(`[ COPY ][ PUBLIC ][ ${fileNames.length} FILES ]`));
    console.log("");
  }
};
