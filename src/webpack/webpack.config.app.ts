import webpack from "webpack";
import { getAppEntryPoints } from "./components/getEntryPoints";
import { getAppOutput } from "./components/getOutput";
import { getHotModuleReplacementPlugin } from "./components/plugins/getHotModuleReplacementPlugin";
import { getHtmlWebpackPlugin } from "./components/plugins/getHtmlWebpackPlugin";
import { getGeneralWebpackConfig } from "./webpack.config.common";
import { getDllReferencePlugin } from "./components/plugins/dllPlugins";

export const getAppWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  isBuild: boolean,
  isDebug: boolean,
): Promise<webpack.Configuration> => {
  return await getGeneralWebpackConfig(
    CWD,
    isDevelopment,
    await getAppEntryPoints(CWD),
    getAppOutput(CWD, isDevelopment),
    [
      ...(await getDllReferencePlugin(CWD, isDevelopment)),
      ...getHotModuleReplacementPlugin(isDevelopment, isBuild),
      ...getHtmlWebpackPlugin(CWD, isDevelopment),
    ],
    isDebug,
    false,
  );
};
