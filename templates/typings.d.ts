/* tslint:disable: max-classes-per-file */

declare module "*.css" {
  interface IClassNames {
    [ className: string ]: any;
  }

  const classNames: IClassNames;
  export = classNames;
}

// For more information you need to go here:
// https://github.com/webpack-contrib/worker-loader#integrating-with-typescript

declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export = WebpackWorker;
}

declare module "*.jpg" {
  const path: string;

  export = path;
}

declare module "*.ico" {
  const path: string;

  export = path;
}

declare module "*.jpeg" {
  const path: string;

  export = path;
}

declare module "*.png" {
  const path: string;

  export = path;
}

declare module "*.gif" {
  const path: string;

  export = path;
}
declare module "*.eot" {
  const path: string;

  export = path;
}
declare module "*.otf" {
  const path: string;

  export = path;
}
declare module "*.webp" {
  const path: string;

  export = path;
}

declare module "*.svg" {
  const path: string;

  export = path;
}

declare module "*.ttf" {
  const path: string;

  export = path;
}

declare module "*.woff" {
  const path: string;

  export = path;
}

declare module "*.woff2" {
  const path: string;

  export = path;
}
/* tslint:enable: max-classes-per-file */
