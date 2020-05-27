import chalk from "chalk";
import del from "del";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const removeMacOSMeta = async (CWD = process.cwd()): Promise<void> => {
  const metaGlobExpression =
    "**/{.DS_Store,.AppleDouble,.apdisk,.VolumeIcon.icns,.Thumbs.db,.fseventsd,.Spotlight-V100,.TemporaryItems,.Trashes}";

  const paths = await del([path.resolve(CWD, metaGlobExpression)]);

  const rearguardConfig = new RearguardConfig(CWD);
  const snakeName = rearguardConfig.getSnakeName();

  for (const item of paths) {
    const relativePath = path.relative(CWD, item);

    console.log(chalk.gray(`[ REMOVE ][ MacOS Meta in module: ${snakeName} ][ ${relativePath} ]`));
  }
  console.log("");
};
