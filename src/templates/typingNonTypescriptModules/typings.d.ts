declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

// For more information you need to go here:
// https://github.com/webpack-contrib/worker-loader#integrating-with-typescript
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

declare module "isomorphic-style-loader/StyleContext";
declare module "isomorphic-style-loader/withStyles";
declare module "isomorphic-style-loader/useStyles";

type _getContent = () => [string, string, string] | string;
type _getCss = () => string;
type _insertCss = () => removeCss;
type removeCss = () => void;

declare module "*.css" {
  const classes: {
    readonly [key: string]: string | undefined;
  };

  export default classes;

  export const _getContent: _getContent;
  export const _getCss: _getCss;
  export const _insertCss: _insertCss;
  export const removeCss: removeCss;
}

declare module "*.module.css" {
  const classes: {
    readonly [key: string]: string | undefined;
  };

  export default classes;

  export const _getContent: _getContent;
  export const _getCss: _getCss;
  export const _insertCss: _insertCss;
  export const removeCss: removeCss;
}

declare module "*.module.scss" {
  const classes: {
    readonly [key: string]: string | undefined;
  };

  export default classes;

  export const _getContent: _getContent;
  export const _getCss: _getCss;
  export const _insertCss: _insertCss;
  export const removeCss: removeCss;
}

declare module "*.module.sass" {
  const classes: {
    readonly [key: string]: string | undefined;
  };

  export default classes;

  export const _getContent: _getContent;
  export const _getCss: _getCss;
  export const _insertCss: _insertCss;
  export const removeCss: removeCss;
}

declare module "*.ico" {
  const src: string;

  export default src;
}

declare module "*.bmp" {
  const src: string;

  export default src;
}

declare module "*.gif" {
  const src: string;

  export default src;
}

declare module "*.jpg" {
  const src: string;

  export default src;
}

declare module "*.jpeg" {
  const src: string;

  export default src;
}

declare module "*.png" {
  const src: string;

  export default src;
}

declare module "*.webp" {
  const src: string;

  export default src;
}

declare module "*.svg" {
  import React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;

  export default src;
}

declare module "*.eot" {
  const src: string;

  export default src;
}

declare module "*.otf" {
  const src: string;

  export default src;
}

declare module "*.ttf" {
  const src: string;

  export default src;
}

declare module "*.woff" {
  const src: string;

  export default src;
}

declare module "*.woff2" {
  const src: string;

  export default src;
}

declare module "*.csv" {
  const src: string;

  export default src;
}

declare module "*.text" {
  const src: string;

  export default src;
}
