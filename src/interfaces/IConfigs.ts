export interface IContext {
  context: string;
}

export interface IEntry {
  entry: string;
}

export interface IOutput {
  output: {
    path: string;
    publicPath: string;
  };
}

export interface IModules {
  modules: string[];
}

export interface IBrowserslist {
  browserslist: string[];
}

export interface IProxy {
  proxy: {
    [key: string]: string | object;
  };
}

export interface IIsomorphic {
  isomorphic: {
    entry: string;
    publicDirName: string;
  };
}

export interface ICSS {
  css: {
    postCssPlugins: string;
  };
}

export interface ITypescript {
  typescript: {
    configPath: string;
    showConfigForIDE: boolean;
    config: {
      compilerOptions: {
        [key: string]: any;
      }
      compileOnSave: boolean;
    }
  };
}

export interface ISocket {
  analyze: {
    client: number;
    server: number;
  };
  proxy: {
    [key: string]: string | object;
  };
  socket: {
    port: string;
    host: string;
  };
}

export interface Ipkg {
  nodeVersion: number;
  engines: {
    [key: string]: string,
  };
  dependencies: {
    [key: string]: string,
  };
}

export interface IEnv {
  isDevelopment: boolean;
  isBuild: boolean;
  isDebug: boolean;
  isSourceMap: boolean;
  isVerbose: boolean;
  isAnalyze: boolean;
  isIsomorphic: boolean;
  isInferno: boolean;
  isReact: boolean;
  isTS: boolean;
  isStart: boolean;
  onlyServer: boolean;
  staticServer: boolean;
  nodeModulePath: string;
}

export interface IBuildConfig extends IContext, IEntry, IOutput, IModules, IBrowserslist, IProxy, IIsomorphic, ICSS, ITypescript {
}

export interface IConfig extends IBuildConfig, ISocket, Ipkg, IEnv {
}
