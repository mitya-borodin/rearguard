import webpack from "webpack";
import { getDllEntryPoint } from "./components/getEntryPoints";
import { getDllOutput } from "./components/getOutput";
import { getDllPlugin } from "./components/plugins/dllPlugins";
import { getAssetsWebpackPlugin } from "./components/plugins/getAsstetsPlugin";
import { getGeneralWebpackConfig } from "./webpack.config.common";

export const getDLLWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  isDebug: boolean,
  needUpdateBuildTime: boolean,
): Promise<webpack.Configuration> => {
  return await getGeneralWebpackConfig(
    CWD,
    isDevelopment,
    await getDllEntryPoint(CWD),
    getDllOutput(CWD, isDevelopment),
    [getDllPlugin(CWD, isDevelopment), getAssetsWebpackPlugin(CWD, isDevelopment, false)],
    isDebug,
    needUpdateBuildTime,
    false,
    [],
    {},
    true,
  );
};
