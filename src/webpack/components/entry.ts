import { Entry, EntryFunc } from "webpack";
import { envConfig } from "../../config/env";
import { rearguardConfig } from "../../config/rearguard";
import { wdsConfig } from "../../config/wds";

export default (entries: string[] = []): string | string[] | Entry | EntryFunc => {
  const { isWDS, isDevelopment } = envConfig;
  const { entry } = rearguardConfig;
  const { port, host } = wdsConfig;

  if (isWDS && isDevelopment) {
    return [
      `${envConfig.resolveDevModule("webpack-dev-server")}/client?https://${host}:${port}`,
      `${envConfig.resolveDevModule("webpack")}/hot/only-dev-server`,
      ...entries,
      entry,
    ];
  }

  return [...entries, entry];
};
