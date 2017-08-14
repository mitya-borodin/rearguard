export interface IBuildConfig {
  context: string;
  entry: string;
  output: {
    path: string;
    publicPath: string;
  };
  modules: string[];
  browserslist: string[];
  proxy: {
    [key: string]: string;
  }
  isomorphic: {
    entry: string;
    publicDirName: string;
  }
  css: {
    isolation: boolean;
    reset: {
      [key: string]: string;
    }
    postCssPlugins: string;
  }
  typescript: {
    configPath: string;
    showConfigForIDE: boolean;
    config: {
      compilerOptions: {
        [key: string]: any;
      }
      compileOnSave: boolean;
    }
  }
}
