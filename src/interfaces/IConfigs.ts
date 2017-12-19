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

export interface IProxy {
  proxy: {
    [key: string]: string | object;
  };
}

export interface ICSS {
  postCSS: {
    plugins: string;
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
    port: number;
  };
  proxy: {
    [key: string]: string | object;
  };
  socket: {
    port: number;
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
  isStart: boolean;
  nodeModulePath: string;
}

export interface IBuildConfig extends IContext, IEntry, IOutput, IModules, IProxy, ICSS, ITypescript {
}

export interface IConfig extends IBuildConfig, ISocket, Ipkg, IEnv {
}
