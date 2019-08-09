export interface IRearguard {
  webpack: {
    context: string;
    entry: string;
    dll_entry: string;
    lib_entry: string;
    modules: string[];
    output: {
      path: string;
      publicPath: string;
    };
  };

  project: {
    deps: string[];
    will_load_on_demand: boolean;
    runtime: "browser" | "node" | "isomorphic";
    type: "app" | "lib";
  };

  distribution: {
    publish_to_git: boolean;
    publish_to_docker: boolean;

    docker: {
      org_namespace: string;
    };
  };

  postcss_plugins: string;
}
