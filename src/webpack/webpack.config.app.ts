import webpack from "webpack";
import { getAppEntryPoints } from "./components/getEntryPoints";
import { getAppOutput } from "./components/getOutput";
import { getDllReferencePlugin } from "./components/plugins/dllPlugins";
import { getHotModuleReplacementPlugin } from "./components/plugins/getHotModuleReplacementPlugin";
import { getHtmlWebpackPlugin } from "./components/plugins/getHtmlWebpackPlugin";
import { getGeneralWebpackConfig } from "./webpack.config.common";

export const getAppWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  isBuild: boolean,
  isDebug: boolean,
): Promise<webpack.Configuration> => {
  return await getGeneralWebpackConfig(
    CWD,
    isDevelopment,
    await getAppEntryPoints(CWD, isDevelopment),
    getAppOutput(CWD),
    [
      ...(await getDllReferencePlugin(CWD, isDevelopment)),
      ...getHotModuleReplacementPlugin(isDevelopment, isBuild),
      ...getHtmlWebpackPlugin(CWD, isDevelopment),
    ],
    isDebug,
  );
};
