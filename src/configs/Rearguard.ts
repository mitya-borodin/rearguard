import { isArray, isBoolean, isObject, isString } from "@rtcts/utils";

export class Rearguard {
  public bin: string;
  public webpack: {
    context: string;
    entry: string;
    dll_entry: string;
    lib_entry: string;
    modules: string[];
    output: {
      path: string;
      publicPath: string;
      library?: string;
      libraryTarget:
        | "var"
        | "assign"
        | "this"
        | "window"
        | "global"
        | "commonjs"
        | "commonjs2"
        | "amd"
        | "umd"
        | "jsonp";
    };
  };

  public project: {
    runtime: "browser" | "node" | "isomorphic";
    type: "dll" | "app" | "lib" | "mono";
    components: string[];
    unPublishedDependency: string[];
    thisModuleWillLoadOnDemand: boolean;
    buildListOfLoadOnDemandModulesForAll: boolean;
  };

  public distribution: {
    publish_to_git: boolean;
    publish_to_docker: boolean;

    docker: {
      org_namespace: string;
    };
  };

  public configs: {
    noOverwriteTSConfig: boolean;
    noOverwriteTSTestConfig: boolean;
    noOverwriteLintConfig: boolean;
    noOverwriteGitIgnore: boolean;
  };

  public css: {
    postcssPlugins: string;
    useOnlyIsomorphicStyleLoader: boolean;
  };

  public html: {
    noInjectAssets: boolean;
  };

  constructor(data?: any) {
    this.bin = "";

    this.webpack = {
      context: "src",
      dll_entry: "vendors.ts",
      entry: "index.tsx",
      lib_entry: "export.ts",
      modules: ["src"],
      output: {
        path: "dist",
        publicPath: "/",
        libraryTarget: "var",
      },
    };

    this.project = {
      runtime: "browser",
      type: "app",
      components: ["components"],
      unPublishedDependency: [],
      thisModuleWillLoadOnDemand: false,
      buildListOfLoadOnDemandModulesForAll: false,
    };

    this.distribution = {
      publish_to_git: false,
      publish_to_docker: false,
      docker: {
        org_namespace: "org_namespace",
      },
    };

    this.configs = {
      noOverwriteTSConfig: false,
      noOverwriteTSTestConfig: false,
      noOverwriteLintConfig: false,
      noOverwriteGitIgnore: false,
    };

    this.css = {
      postcssPlugins: "postcss.config.js",
      useOnlyIsomorphicStyleLoader: false,
    };

    this.html = {
      noInjectAssets: false,
    };

    if (data) {
      if (isString(data.bin)) {
        this.bin = data.bin;
      }

      if (isObject(data.webpack)) {
        for (const fieldName of ["context", "entry", "dll_entry", "lib_entry"]) {
          if (isString(data.webpack[fieldName])) {
            this.webpack[fieldName] = data.webpack[fieldName];
          }
        }

        if (isArray(data.webpack.modules)) {
          this.webpack.modules = [];

          for (const module of data.webpack.modules) {
            this.webpack.modules.push(module);
          }
        }

        if (isObject(data.webpack.output)) {
          for (const fieldName of ["path", "publicPath", "library", "libraryTarget"]) {
            if (isString(data.webpack.output[fieldName])) {
              this.webpack.output[fieldName] = data.webpack.output[fieldName];
            }
          }
        }
      }

      if (isObject(data.project)) {
        if (["browser", "node", "isomorphic"].includes(data.project.runtime)) {
          this.project.runtime = data.project.runtime;
        }

        if (["dll", "app", "lib", "mono"].includes(data.project.type)) {
          this.project.type = data.project.type;
        }

        if (isArray(data.project.components)) {
          this.project.components = [];

          for (const item of data.project.components) {
            if (isString(item)) {
              this.project.components.push(item);
            }
          }
        }

        if (isArray(data.project.unPublishedDependency)) {
          this.project.unPublishedDependency = [];

          for (const item of data.project.unPublishedDependency) {
            if (isString(item)) {
              this.project.unPublishedDependency.push(item);
            }
          }
        }

        if (isBoolean(data.project.thisModuleWillLoadOnDemand)) {
          this.project.thisModuleWillLoadOnDemand = data.project.thisModuleWillLoadOnDemand;
        }

        if (isBoolean(data.project.buildListOfLoadOnDemandModulesForAll)) {
          this.project.buildListOfLoadOnDemandModulesForAll =
            data.project.buildListOfLoadOnDemandModulesForAll;
        }
      }

      if (isObject(data.distribution)) {
        for (const fieldName of ["publish_to_git", "publish_to_docker"]) {
          if (isBoolean(data.distribution[fieldName])) {
            this.distribution[fieldName] = data.distribution[fieldName];
          }
        }

        if (isObject(data.distribution.docker)) {
          for (const fieldName of ["org_namespace"]) {
            if (isString(data.distribution.docker[fieldName])) {
              this.distribution.docker[fieldName] = data.distribution.docker[fieldName];
            }
          }
        }
      }

      if (isObject(data.configs)) {
        for (const item of [
          "noOverwriteTSConfig",
          "noOverwriteTSTestConfig",
          "noOverwriteLintConfig",
          "noOverwriteGitIgnore",
        ]) {
          if (isBoolean(data.configs[item])) {
            this.configs[item] = data.configs[item];
          }
        }
      }

      if (isObject(data.css)) {
        if (isString(data.css.postcssPlugins)) {
          this.css.postcssPlugins = data.css.postcssPlugins;
        }
        if (isBoolean(data.css.useOnlyIsomorphicStyleLoader)) {
          this.css.useOnlyIsomorphicStyleLoader = data.css.useOnlyIsomorphicStyleLoader;
        }
      }

      if (isObject(data.html)) {
        if (isBoolean(data.html.noInjectAssets)) {
          this.html.noInjectAssets = data.html.noInjectAssets;
        }
      }

      if (this.project.runtime === "isomorphic") {
        this.css.useOnlyIsomorphicStyleLoader = true;
      }
    }
  }

  public toJSON(): object {
    const project = {
      project: {
        runtime: this.project.runtime,
        type: this.project.type,
        unPublishedDependency: this.project.unPublishedDependency,
        buildListOfLoadOnDemandModulesForAll: this.project.buildListOfLoadOnDemandModulesForAll,
      },
    };

    const appDistribution = {
      distribution: {
        publish_to_docker: this.distribution.publish_to_docker,
        docker: this.distribution.docker,
      },
    };

    if (this.project.type === "dll") {
      return {
        webpack: {
          context: this.webpack.context,
          dll_entry: this.webpack.dll_entry,
          output: this.webpack.output,
        },
        ...project,
        distribution: {
          publish_to_git: this.distribution.publish_to_git,
        },
      };
    }

    if (this.project.runtime === "browser") {
      if (this.project.type === "app") {
        return {
          webpack: this.webpack,
          html: {
            noInjectAssets: this.html.noInjectAssets,
          },
          css: { ...this.css },
          ...{
            ...project,
            components: this.project.components,
          },
          ...appDistribution,
          configs: this.configs,
        };
      }
    }

    if (this.project.runtime === "browser" || this.project.runtime === "isomorphic") {
      if (this.project.type === "lib") {
        return {
          webpack: this.webpack,
          html: {
            noInjectAssets: this.html.noInjectAssets,
          },
          css:
            this.project.runtime === "isomorphic"
              ? { postcssPlugins: this.css.postcssPlugins }
              : { ...this.css },
          project: {
            runtime: this.project.runtime,
            type: this.project.type,
            thisModuleWillLoadOnDemand: this.project.thisModuleWillLoadOnDemand,
            buildListOfLoadOnDemandModulesForAll: this.project.buildListOfLoadOnDemandModulesForAll,
            unPublishedDependency: this.project.unPublishedDependency,
          },
          configs: this.configs,
          distribution: {
            publish_to_git: this.distribution.publish_to_git,
          },
        };
      }
    }

    if (this.project.runtime === "node") {
      if (this.project.type === "app") {
        return {
          bin: this.bin,
          ...{
            ...project,
            components: this.project.components,
          },
          configs: this.configs,
          ...appDistribution,
        };
      }

      if (this.project.type === "lib") {
        return {
          ...project,
          configs: this.configs,
          distribution: {
            publish_to_git: this.distribution.publish_to_git,
          },
        };
      }
    }

    if (this.project.type === "mono") {
      return {
        project: {
          type: this.project.type,
          components: this.project.components,
        },
      };
    }

    return this;
  }
}
