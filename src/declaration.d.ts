declare module "node-object-hash";
declare module "recursive-copy";
declare module "workbox-build";
declare module "dumper.js";
declare module "find-process";
declare module "postcss-normalize";
declare module "postcss-safe-parser";
declare module "fork-ts-checker-webpack-plugin";

declare module "stylelint-webpack-plugin" {
  import { Plugin } from "stylelint-webpack-plugin";

  declare class StylelintWebpackPlugin extends Plugin {
    constructor(options?: StylelintWebpackPlugin.Options);
  }

  declare namespace StylelintWebpackPlugin {
    interface Message {
      line: number;
      column: number;
      severity: string;
      text: string;
      rule: string;
    }

    type Formatter = (messages: Message[], source: string) => string;

    interface Config {
      rules?: object;
      extends?: string | string[];
      plugins?: string[];
      processors?: string[];
      ignoreFiles?: string | string[];
      defaultSeverity?: "warning" | "error";
    }

    interface Options {
      config?: Config;
      stylelintPath?: string;
      configFile?: string;
      context?: string;
      emitErrors?: boolean;
      failOnError?: boolean;
      files?: string | string[];
      formatter?: Formatter;
      lintDirtyModulesOnly?: boolean;
      syntax?: string;
      quiet?: boolean;
      fix?: boolean;
    }
  }

  export = StylelintWebpackPlugin;
}

declare module "html-webpack-plugin" {
  import { Options as HtmlMinifierOptions } from "html-minifier";
  import { AsyncSeriesWaterfallHook } from "tapable";
  import { Compiler, Plugin } from "webpack";

  declare class HtmlWebpackPlugin extends Plugin {
    public static getHooks(compilation: any): Hooks;

    constructor(options?: HtmlWebpackPlugin.Options);

    apply(compiler: Compiler): void;
  }

  declare namespace HtmlWebpackPlugin {
    type MinifyOptions = HtmlMinifierOptions;

    type Options = Partial<ProcessedOptions>;

    /**
     * The plugin options after adding default values
     */
    interface ProcessedOptions {
      /**
       * Emit the file only if it was changed.
       * Default: `true`.
       */
      cache: boolean;
      /**
       * List all entries which should be injected
       */
      chunks: "all" | string[];
      /**
       * Allows to control how chunks should be sorted before they are included to the html.
       * Default: `'auto'`.
       */
      chunksSortMode: "auto" | "manual" | ((entryNameA: string, entryNameB: string) => number);
      /**
       * List all entries which should not be injeccted
       */
      excludeChunks: string[];
      /**
       * Path to the favicon icon
       */
      favicon: false | string;
      /**
       * The file to write the HTML to.
       * Defaults to `index.html`.
       * Supports subdirectories eg: `assets/admin.html`
       */
      filename: string;
      /**
       * If `true` then append a unique `webpack` compilation hash to all included scripts and CSS files.
       * This is useful for cache busting
       */
      hash: boolean;
      /**
       * Inject all assets into the given `template` or `templateContent`.
       */
      inject:
        | false // Don't inject scripts
        | true // Inject scripts into body
        | "body" // Inject scripts into body
        | "head"; // Inject scripts into head
      /**
       * Inject meta tags
       */
      meta:
        | false // Disable injection
        | {
            [name: string]:
              | string
              | false // name content pair e.g. {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}`
              | { [attributeName: string]: string | boolean }; // custom properties e.g. { name:"viewport" content:"width=500, initial-scale=1" }
          };
      /**
       * HTML Minification options accepts the following valeus:
       * - Set to `false` to disable minifcation
       * - Set to `'auto'` to enable minifcation only for production mode
       * - Set to custom minification according to
       * @https://github.com/kangax/html-minifier#options-quick-reference
       */
      minify: "auto" | boolean | MinifyOptions;
      /**
       * Render errors into the HTML page
       */
      showErrors: boolean;
      /**
       * The `webpack` require path to the template.
       * @see https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
       */
      template: string;
      /**
       * Allow to use a html string instead of reading from a file
       */
      templateContent:
        | false // Use the template option instead to load a file
        | string
        | Promise<string>;
      /**
       * Allows to overwrite the parameters used in the template
       */
      templateParameters:
        | false // Pass an empty object to the template function
        | ((
            compilation: any,
            assets: {
              publicPath: string;
              js: Array<string>;
              css: Array<string>;
              manifest?: string;
              favicon?: string;
            },
            assetTags: {
              headTags: HtmlTagObject[];
              bodyTags: HtmlTagObject[];
            },
            options: ProcessedOptions,
          ) => { [option: string]: any } | Promise<{ [option: string]: any }>)
        | { [option: string]: any };
      /**
       * The title to use for the generated HTML document
       */
      title: string;
      /**
       * Enforce self closing tags e.g. <link />
       */
      xhtml: boolean;
      /**
       * In addition to the options actually used by this plugin, you can use this hash to pass arbitrary data through
       * to your template.
       */
      [option: string]: any;
    }

    /**
     * The values which are available during template execution
     *
     * Please keep in mind that the `templateParameter` options allows to change them
     */
    interface TemplateParameter {
      compilation: any;
      htmlWebpackPlugin: {
        tags: {
          headTags: HtmlTagObject[];
          bodyTags: HtmlTagObject[];
        };
        files: {
          publicPath: string;
          js: Array<string>;
          css: Array<string>;
          manifest?: string;
          favicon?: string;
        };
        options: Options;
      };
      webpackConfig: any;
    }

    interface Hooks {
      alterAssetTags: AsyncSeriesWaterfallHook<{
        assetTags: {
          scripts: HtmlTagObject[];
          styles: HtmlTagObject[];
          meta: HtmlTagObject[];
        };
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;

      alterAssetTagGroups: AsyncSeriesWaterfallHook<{
        headTags: HtmlTagObject[];
        bodyTags: HtmlTagObject[];
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;

      afterTemplateExecution: AsyncSeriesWaterfallHook<{
        html: string;
        headTags: HtmlTagObject[];
        bodyTags: HtmlTagObject[];
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;

      beforeAssetTagGeneration: AsyncSeriesWaterfallHook<{
        assets: {
          publicPath: string;
          js: Array<string>;
          css: Array<string>;
          favicon?: string;
          manifest?: string;
        };
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;

      beforeEmit: AsyncSeriesWaterfallHook<{
        html: string;
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;

      afterEmit: AsyncSeriesWaterfallHook<{
        outputName: string;
        plugin: HtmlWebpackPlugin;
      }>;
    }

    /**
     * A tag element according to the htmlWebpackPlugin object notation
     */
    interface HtmlTagObject {
      /**
       * Attributes of the html tag
       * E.g. `{'disabled': true, 'value': 'demo'}`
       */
      attributes: {
        [attributeName: string]: string | boolean;
      };
      /**
       * The tag name e.g. `'div'`
       */
      tagName: string;
      /**
       * The inner HTML
       */
      innerHTML?: string;
      /**
       * Whether this html must not contain innerHTML
       * @see https://www.w3.org/TR/html5/syntax.html#void-elements
       */
      voidTag: boolean;
    }
  }

  export = HtmlWebpackPlugin;
}
