export interface IContext {
  context: string;
}

export interface IDllEntries {
  dll_entry: string;
}

export interface ILibEntry {
  lib_entry: string;
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

export interface ISyncNpmDeps {
  sync_npm_deps: string[];
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
    config: {
      compilerOptions: {
        [key: string]: any;
      };
      compileOnSave: boolean;
      include: string[];
      exclude: string[];
    };
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
  name: string;
  nodeVersion: number;
  engines: {
    [key: string]: string;
  };
  dependencies: {
    [key: string]: string;
  };
}

export interface IEnv {
  isWDS: boolean;
  isSyncDeps: boolean;
  isBuild: boolean;
  isDevelopment: boolean;
  isDebug: boolean;
  isLib: boolean;
  isDll: boolean;
  nodeModulePath: string;
  localNodeModulePath: string;
}

export interface IBuildConfig
  extends IContext,
    IEntry,
    IOutput,
    ISyncNpmDeps,
    IModules,
    IProxy,
    ICSS,
    ITypescript,
    ILibEntry,
    IDllEntries {}

export interface IConfig extends IBuildConfig, ISocket, Ipkg, IEnv {}
