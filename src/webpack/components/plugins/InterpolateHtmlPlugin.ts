/* eslint-disable @typescript-eslint/explicit-function-return-type */
import escapeStringRegexp from "escape-string-regexp";

export class InterpolateHtmlPlugin {
  htmlWebpackPlugin: any;
  replacements: any;

  constructor(htmlWebpackPlugin: any, replacements: any) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InterpolateHtmlPlugin", (compilation) => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .afterTemplateExecution.tap("InterpolateHtmlPlugin", (data) => {
          // Run HTML through a series of user-specified string replacements.
          Object.keys(this.replacements).forEach((key) => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp("%" + escapeStringRegexp(key) + "%", "g"),
              value,
            );
          });
        });
    });
  }
}
