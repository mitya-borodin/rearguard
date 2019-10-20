import webpack from "webpack";
import { getLibEntryPoint } from "./components/getEntryPoints";
import { getLibOutput } from "./components/getOutput";
import { getDllReferencePlugin } from "./components/plugins/dllPlugins";
import { getAssetsWebpackPlugin } from "./components/plugins/getAsstetsPlugin";
import { getGeneralWebpackConfig } from "./webpack.config.common";

// tslint:disable:object-literal-sort-keys

export const getLibWebpackConfig = async (
  CWD: string,
  isDevelopment: boolean,
  isDebug: boolean,
  needUpdateBuildTime: boolean,
): Promise<webpack.Configuration> => {
  return await getGeneralWebpackConfig(
    CWD,
    isDevelopment,
    await getLibEntryPoint(CWD),
    getLibOutput(CWD, isDevelopment),
    [
      ...(await getDllReferencePlugin(CWD, isDevelopment)),
      getAssetsWebpackPlugin(CWD, isDevelopment, true),
    ],
    isDebug,
    needUpdateBuildTime,
  );
};

// tslint:enable:object-literal-sort-keys
