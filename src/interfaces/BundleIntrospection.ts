export interface BundleIntrospection {
  pkgName: string;
  pkgSnakeName: string;
  hasDll: boolean;
  hasBrowserLib: boolean;
  willLoadOnDemand: boolean;
  bundleRuntimeName: {
    dll: string;
    lib: string;
  };
  assetsPath: {
    dll: string;
    lib: string;
  };
  dllManifestPath: string;
}
